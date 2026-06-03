import { useEffect, useRef, useState } from 'react'

const MIN_ZOOM_SCALE = 1
const MAX_ZOOM_SCALE = 5

const DIRECTION_LOCK_THRESHOLD = 8
const EDGE_RELEASE_DISTANCE = 56
const EDGE_HOLD_MS = 160
const BLOCKED_MOVES_BEFORE_SLIDE = 3
const EDGE_EPSILON = 1

const DEFAULT_TRANSFORM = {
	scale: 1,
	translateX: 0,
	translateY: 0
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const getTouchDistance = touches => {
	if (!touches || touches.length < 2) return 0

	const deltaX = touches[0].pageX - touches[1].pageX
	const deltaY = touches[0].pageY - touches[1].pageY

	return Math.hypot(deltaX, deltaY)
}

const getTouchCenter = touches => {
	if (!touches || touches.length < 2) return { x: 0, y: 0 }

	return {
		x: (touches[0].pageX + touches[1].pageX) / 2,
		y: (touches[0].pageY + touches[1].pageY) / 2
	}
}

const getGestureAxis = (deltaX, deltaY) => {
	const absX = Math.abs(deltaX)
	const absY = Math.abs(deltaY)

	if (absX < DIRECTION_LOCK_THRESHOLD && absY < DIRECTION_LOCK_THRESHOLD) {
		return null
	}

	return absX > absY ? 'x' : 'y'
}

export default function useZoomFixed({ showModal, normalizedStart, listRef, onRequestSlide }) {
	const [imageTransforms, setImageTransforms] = useState({})
	const imageTransformsRef = useRef({})
	const gestureStateRef = useRef({})
	const zoomElementRefs = useRef({})

	useEffect(() => {
		imageTransformsRef.current = imageTransforms
	}, [imageTransforms])

	useEffect(() => {
		if (!showModal) return

		setImageTransforms({})
		imageTransformsRef.current = {}
		gestureStateRef.current = {}
		zoomElementRefs.current = {}
	}, [showModal, normalizedStart])

	const getCurrentTransform = index => imageTransformsRef.current[index] || DEFAULT_TRANSFORM

	const getViewportRect = index => {
		const listElement = listRef.current
		const zoomElement = zoomElementRefs.current[index]

		if (listElement?.getBoundingClientRect) {
			return listElement.getBoundingClientRect()
		}

		if (zoomElement?.getBoundingClientRect) {
			return zoomElement.getBoundingClientRect()
		}

		return {
			left: 0,
			top: 0,
			width: typeof window !== 'undefined' ? window.innerWidth || 0 : 0,
			height: typeof window !== 'undefined' ? window.innerHeight || 0 : 0
		}
	}

	const getSizes = index => {
		const zoomElement = zoomElementRefs.current[index]
		const listElement = listRef.current

		const viewportFallbackWidth = typeof window !== 'undefined' ? window.innerWidth || window.screen?.width || 0 : 0

		const viewportFallbackHeight =
			typeof window !== 'undefined' ? window.innerHeight || window.screen?.height || 0 : 0

		const elementWidth = zoomElement?.offsetWidth || listElement?.clientWidth || viewportFallbackWidth
		const elementHeight = zoomElement?.offsetHeight || listElement?.clientHeight || viewportFallbackHeight

		const viewportWidth = listElement?.clientWidth || viewportFallbackWidth || elementWidth
		const viewportHeight = listElement?.clientHeight || viewportFallbackHeight || elementHeight

		return {
			elementWidth,
			elementHeight,
			viewportWidth,
			viewportHeight
		}
	}

	const getTransformBounds = (index, scale) => {
		const { elementWidth, elementHeight, viewportWidth, viewportHeight } = getSizes(index)

		const scaledWidth = elementWidth * scale
		const scaledHeight = elementHeight * scale

		const minTranslateX = Math.min(0, viewportWidth - scaledWidth)
		const minTranslateY = Math.min(0, viewportHeight - scaledHeight)

		return {
			minTranslateX,
			maxTranslateX: 0,
			minTranslateY,
			maxTranslateY: 0
		}
	}

	const getBoundedTransform = (index, transform) => {
		const nextScale = clamp(transform?.scale || 1, MIN_ZOOM_SCALE, MAX_ZOOM_SCALE)

		if (nextScale <= 1) {
			return DEFAULT_TRANSFORM
		}

		const { minTranslateX, maxTranslateX, minTranslateY, maxTranslateY } = getTransformBounds(index, nextScale)

		return {
			scale: nextScale,
			translateX: clamp(transform?.translateX || 0, minTranslateX, maxTranslateX),
			translateY: clamp(transform?.translateY || 0, minTranslateY, maxTranslateY)
		}
	}

	const setTransformForIndex = (index, nextTransform) => {
		setImageTransforms(previous => {
			const currentTransform = previous[index] || DEFAULT_TRANSFORM
			const boundedTransform = getBoundedTransform(index, nextTransform)

			if (
				boundedTransform.scale === currentTransform.scale &&
				boundedTransform.translateX === currentTransform.translateX &&
				boundedTransform.translateY === currentTransform.translateY
			) {
				return previous
			}

			const nextState = {
				...previous,
				[index]: boundedTransform
			}

			imageTransformsRef.current = nextState

			return nextState
		})
	}

	const resetImageTransform = index => {
		setImageTransforms(previous => {
			const currentTransform = previous[index] || DEFAULT_TRANSFORM

			if (
				currentTransform.scale === 1 &&
				currentTransform.translateX === 0 &&
				currentTransform.translateY === 0
			) {
				return previous
			}

			const nextState = {
				...previous,
				[index]: DEFAULT_TRANSFORM
			}

			imageTransformsRef.current = nextState

			return nextState
		})
	}

	const resetEdgeIntent = gesture => ({
		...gesture,
		edgeOverscrollX: 0,
		edgeEnteredAt: null,
		edgeDirection: null,
		blockedHorizontalMoves: 0
	})

	const handleImageTouchStart = (index, event) => {
		const touches = event?.touches

		if (!touches || touches.length === 0) return

		const currentTransform = getCurrentTransform(index)

		if (touches.length >= 2) {
			event?.preventDefault?.()
			event?.stopPropagation?.()

			const touchCenter = getTouchCenter(touches)
			const viewportRect = getViewportRect(index)

			const focalX = touchCenter.x - viewportRect.left
			const focalY = touchCenter.y - viewportRect.top
			const safeScale = currentTransform.scale || 1

			gestureStateRef.current[index] = {
				startDistance: getTouchDistance(touches),
				startScale: safeScale,
				startTranslateX: currentTransform.translateX,
				startTranslateY: currentTransform.translateY,
				pinchLocalX: (focalX - currentTransform.translateX) / safeScale,
				pinchLocalY: (focalY - currentTransform.translateY) / safeScale,
				lastSingleTouch: null,
				startSingleTouch: null,
				gestureAxis: null,
				slideTriggered: false,
				edgeOverscrollX: 0,
				edgeEnteredAt: null,
				edgeDirection: null,
				blockedHorizontalMoves: 0
			}

			return
		}

		gestureStateRef.current[index] = {
			...(gestureStateRef.current[index] || {}),
			lastSingleTouch: {
				x: touches[0].pageX,
				y: touches[0].pageY
			},
			startSingleTouch: {
				x: touches[0].pageX,
				y: touches[0].pageY
			},
			gestureAxis: null,
			slideTriggered: false,
			edgeOverscrollX: 0,
			edgeEnteredAt: null,
			edgeDirection: null,
			blockedHorizontalMoves: 0
		}
	}

	const handleImageTouchMove = (index, event) => {
		const touches = event?.touches

		if (!touches || touches.length === 0) return

		if (touches.length >= 2) {
			event?.preventDefault?.()
			event?.stopPropagation?.()

			const gesture = gestureStateRef.current[index] || {}
			const currentDistance = getTouchDistance(touches)
			const baseDistance = gesture.startDistance || currentDistance || 1
			const startScale = gesture.startScale || 1
			const nextScale = clamp((currentDistance / baseDistance) * startScale, MIN_ZOOM_SCALE, MAX_ZOOM_SCALE)

			const touchCenter = getTouchCenter(touches)
			const viewportRect = getViewportRect(index)

			const focalX = touchCenter.x - viewportRect.left
			const focalY = touchCenter.y - viewportRect.top

			const pinchLocalX = gesture.pinchLocalX ?? focalX
			const pinchLocalY = gesture.pinchLocalY ?? focalY

			const nextTranslateX = focalX - pinchLocalX * nextScale
			const nextTranslateY = focalY - pinchLocalY * nextScale

			gestureStateRef.current[index] = {
				...gesture,
				gestureAxis: null,
				slideTriggered: false,
				edgeOverscrollX: 0,
				edgeEnteredAt: null,
				edgeDirection: null,
				blockedHorizontalMoves: 0
			}

			setTransformForIndex(index, {
				scale: nextScale,
				translateX: nextTranslateX,
				translateY: nextTranslateY
			})

			return
		}

		const gesture = gestureStateRef.current[index] || {}
		const currentTransform = getCurrentTransform(index)

		if (currentTransform.scale <= 1) return

		if (gesture.slideTriggered) return

		const currentTouch = {
			x: touches[0].pageX,
			y: touches[0].pageY
		}

		const lastSingleTouch = gesture.lastSingleTouch

		gestureStateRef.current[index] = {
			...gesture,
			lastSingleTouch: currentTouch
		}

		if (!lastSingleTouch) return

		const deltaX = currentTouch.x - lastSingleTouch.x
		const deltaY = currentTouch.y - lastSingleTouch.y

		const totalDeltaX = currentTouch.x - (gesture.startSingleTouch?.x || currentTouch.x)
		const totalDeltaY = currentTouch.y - (gesture.startSingleTouch?.y || currentTouch.y)

		const lockedAxis = gesture.gestureAxis || getGestureAxis(totalDeltaX, totalDeltaY)

		const bounds = getTransformBounds(index, currentTransform.scale)

		const wasAtLeftEdge = currentTransform.translateX >= bounds.maxTranslateX - EDGE_EPSILON
		const wasAtRightEdge = currentTransform.translateX <= bounds.minTranslateX + EDGE_EPSILON

		const attemptedTransform = {
			...currentTransform,
			translateX: currentTransform.translateX + deltaX,
			translateY: currentTransform.translateY + deltaY
		}

		const boundedTransform = getBoundedTransform(index, attemptedTransform)

		const consumedDeltaX = boundedTransform.translateX - currentTransform.translateX
		const remainingDeltaX = deltaX - consumedDeltaX

		let nextGesture = {
			...gestureStateRef.current[index],
			gestureAxis: lockedAxis
		}

		const isPushingPrev = lockedAxis === 'x' && wasAtLeftEdge && deltaX > 0 && remainingDeltaX > 0
		const isPushingNext = lockedAxis === 'x' && wasAtRightEdge && deltaX < 0 && remainingDeltaX < 0

		if (isPushingPrev || isPushingNext) {
			const direction = isPushingPrev ? 'prev' : 'next'
			const now = Date.now()

			if (nextGesture.edgeDirection !== direction) {
				nextGesture = {
					...resetEdgeIntent(nextGesture),
					gestureAxis: lockedAxis,
					edgeDirection: direction,
					edgeEnteredAt: now,
					blockedHorizontalMoves: 1,
					edgeOverscrollX: remainingDeltaX
				}
			} else {
				nextGesture = {
					...nextGesture,
					edgeOverscrollX: (nextGesture.edgeOverscrollX || 0) + remainingDeltaX,
					blockedHorizontalMoves: (nextGesture.blockedHorizontalMoves || 0) + 1
				}
			}
		} else {
			nextGesture = resetEdgeIntent(nextGesture)
			nextGesture.gestureAxis = lockedAxis
		}

		gestureStateRef.current[index] = nextGesture

		const edgeHeldFor = nextGesture.edgeEnteredAt ? Date.now() - nextGesture.edgeEnteredAt : 0

		const shouldGoPrev =
			nextGesture.edgeDirection === 'prev' &&
			nextGesture.edgeOverscrollX > EDGE_RELEASE_DISTANCE &&
			edgeHeldFor >= EDGE_HOLD_MS &&
			(nextGesture.blockedHorizontalMoves || 0) >= BLOCKED_MOVES_BEFORE_SLIDE

		const shouldGoNext =
			nextGesture.edgeDirection === 'next' &&
			Math.abs(nextGesture.edgeOverscrollX) > EDGE_RELEASE_DISTANCE &&
			edgeHeldFor >= EDGE_HOLD_MS &&
			(nextGesture.blockedHorizontalMoves || 0) >= BLOCKED_MOVES_BEFORE_SLIDE

		if (shouldGoPrev || shouldGoNext) {
			gestureStateRef.current[index] = {
				...nextGesture,
				slideTriggered: true,
				edgeOverscrollX: 0,
				edgeEnteredAt: null,
				edgeDirection: null,
				blockedHorizontalMoves: 0
			}

			onRequestSlide?.(shouldGoPrev ? 'prev' : 'next')

			return
		}

		event?.preventDefault?.()
		event?.stopPropagation?.()

		setTransformForIndex(index, boundedTransform)
	}

	const handleImageTouchEnd = (index, event) => {
		const gesture = gestureStateRef.current[index]

		if (!gesture) return

		const remainingTouch = event?.touches?.[0]
		const currentTransform = getCurrentTransform(index)

		gestureStateRef.current[index] = {
			...gesture,
			startDistance: null,
			startScale: currentTransform.scale || 1,
			startTranslateX: currentTransform.translateX || 0,
			startTranslateY: currentTransform.translateY || 0,
			lastSingleTouch: remainingTouch
				? {
						x: remainingTouch.pageX,
						y: remainingTouch.pageY
					}
				: null,
			startSingleTouch: remainingTouch
				? {
						x: remainingTouch.pageX,
						y: remainingTouch.pageY
					}
				: null,
			gestureAxis: null,
			slideTriggered: false,
			edgeOverscrollX: 0,
			edgeEnteredAt: null,
			edgeDirection: null,
			blockedHorizontalMoves: 0
		}
	}

	const registerZoomElement = (index, element) => {
		if (element) {
			zoomElementRefs.current[index] = element

			return
		}

		delete zoomElementRefs.current[index]
	}

	const isImageZoomed = index => (imageTransforms[index]?.scale || 1) > 1

	const getZoomStyle = index => ({
		transform: `translate3d(${imageTransforms[index]?.translateX || 0}px, ${
			imageTransforms[index]?.translateY || 0
		}px, 0) scale(${imageTransforms[index]?.scale || 1})`,
		transformOrigin: 'top left',
		touchAction: 'none',
		willChange: 'transform',
		width: '100%',
		height: '100%'
	})

	return {
		registerZoomElement,
		handleImageTouchStart,
		handleImageTouchMove,
		handleImageTouchEnd,
		isImageZoomed,
		getZoomStyle,
		resetImageTransform
	}
}