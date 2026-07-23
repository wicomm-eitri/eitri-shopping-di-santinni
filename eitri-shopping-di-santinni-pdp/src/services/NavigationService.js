import Eitri from 'eitri-bifrost'

export const openCart = async cart => {
	try {
		Eitri.nativeNavigation.open({
			slug: 'cart',
			initParams: { orderFormId: cart?.orderFormId }
		})
	} catch (e) {
		console.error('navigate to cart: Error trying to open cart', e)
	}
}

export const openProduct = async product => {
	try {
		Eitri.nativeNavigation.open({
			slug: 'pdp',
			initParams: { product: product }
		})
	} catch (e) {
		console.error('navigate to cart: Error trying to open cart', e)
	}
}

export const openProductVariant = async productId => {
	try {
		Eitri.nativeNavigation.open({
			slug: 'pdp',
			initParams: { productId },
			replace: true
		})
	} catch (e) {
		console.error('navigate to product variant: Error trying to open pdp', e)
	}
}
