import Eitri from 'eitri-bifrost'
import { Vtex, EventBus } from 'eitri-shopping-vtex-shared'

export const requestLogin = () => {
	return new Promise((resolve, reject) => {
		;(async () => {
			if (await isLoggedIn()) {
				resolve()

				return
			}

			Eitri.nativeNavigation.open({
				slug: 'account',
				initParams: { action: 'RequestLogin', closeAppAfterLogin: true }
			})
			Eitri.navigation.addOnResumeListener(async () => {
				if (await isLoggedIn()) {
					resolve()
				} else {
					reject(new Error('User not logged in'))
				}
			})
		})()
	})
}

export const isLoggedIn = async () => {
	try {
		return await Vtex.customer.isLoggedIn()
	} catch (e) {
		console.error('Erro ao buscar dados do cliente', e)

		return false
	}
}

// Helper para enviar a autenticação limpa e evitar o Cache agressivo da VTEX
const getAuthHeaders = async () => {
	try {
		const tokenData = await Vtex.customer.getCustomerToken()
		const token = typeof tokenData === 'object' ? tokenData?.token : tokenData

		return {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Cache-Control': 'no-cache, no-store',
			...(token ? { Cookie: `VtexIdclientAutCookie_disantinni=${token}` } : {})
		}
	} catch (error) {
		return {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Cache-Control': 'no-cache, no-store'
		}
	}
}

const GRAPHQL_URL = 'https://disantinni.myvtex.com/_v/private/graphql/v1?app=vtex.my-wishlists@2.x&locale=pt-BR'

export const getWishlist = async () => {
	try {
		if (!(await isLoggedIn())) return []

		// REMOVIDO os parâmetros (page, pageSize) igual ao viewListQuery do FastStore
		const query = `
            query GetUserWishlists {
                getWishlistsByEmail {
                    id
                    wishlistType
                    isPublic
                    products {
                        ID
                        skuCodeReference
                        nameProduct
                        quantityProduct
                        notes
                        linkProduct
                        department
                    }
                }
            }
        `
		const headers = await getAuthHeaders()
		const response = await Eitri.http.post(GRAPHQL_URL, { query, variables: {} }, { headers })

		const wishlists = response.data?.data?.getWishlistsByEmail || []

		if (wishlists.length === 0) return []

		const products = wishlists[0].products || []

		const uniqueProducts = []
		const seenIds = new Set()

		for (const p of products) {
			if (!seenIds.has(p.ID)) {
				seenIds.add(p.ID)
				uniqueProducts.push(p)
			}
		}

		return uniqueProducts.map(p => ({
			id: String(p.ID),
			skuId: String(p.ID),
			productId: p.notes || p.linkProduct || p.skuCodeReference || String(p.ID),
			name: p.nameProduct,
			sku: p.skuCodeReference || String(p.ID)
		}))
	} catch (error) {
		console.error('Erro ao carregar wishlist via bypass:', error)

		return []
	}
}

export const productOnWishlist = async identifier => {
	try {
		const products = await getWishlist()
		const itemExists = products.find(item => 
			String(item.productId) === String(identifier) || String(item.id) === String(identifier)
		)

		return { inList: !!itemExists, listId: itemExists ? true : null }
	} catch (error) {
		return { inList: false }
	}
}

export const removeItemFromWishlist = async identifier => {
	try {
		const headers = await getAuthHeaders()
		const queryList = `
            query GetUserWishlists {
                getWishlistsByEmail {
                    id
                    wishlistType
                    isPublic
                    products {
                        ID
                        Image
                        linkProduct
                        nameProduct
                        quantityProduct
                        skuCodeReference
                        department
                        bundle
                        notes
                    }
                }
            }
        `
		const listResponse = await Eitri.http.post(GRAPHQL_URL, { query: queryList, variables: {} }, { headers })
		const wishlists = listResponse.data?.data?.getWishlistsByEmail || []

		if (wishlists.length === 0) return true

		const targetList = wishlists[0]
		const updatedProducts = (targetList.products || []).filter(item => String(item.ID) !== String(identifier) && String(item.notes) !== String(identifier))

		const mutationUpdate = `
            mutation UpdateWishlist($wishlist: WishlistInput!) {
                updateWishlist(wishlist: $wishlist) {
                    id
                }
            }
        `

		const variables = {
			wishlist: {
				id: targetList.id,
				wishlistType: targetList.wishlistType || 'Wishlist',
				isPublic: targetList.isPublic || false,
				products: updatedProducts.map(p => ({
					ID: Number(p.ID),
					Image: p.Image || '',
					linkProduct: p.linkProduct || '',
					nameProduct: String(p.nameProduct || ''),
					quantityProduct: Number(p.quantityProduct || 1),
					skuCodeReference: String(p.skuCodeReference || p.ID),
					department: p.department || '',
					bundle: Number(p.bundle || 1),
					notes: p.notes || ''
				}))
			}
		}

		await Eitri.http.post(GRAPHQL_URL, { query: mutationUpdate, variables }, { headers })

		EventBus.publish({
			channel: 'removeFromWishlist',
			broadcast: true,
			data: { 
				id: targetList.id, 
				response: { 
					data: { 
						removeFromList: true 
					} 
				} 
			}
		})

		return true
	} catch (error) {
		console.error('Erro no removeFromWishlist manual:', error)

		return false
	}
}

export const addToWishlist = async (productId, title, sku) => {
	await requestLogin()

	try {
		const headers = await getAuthHeaders()

		const queryList = `
            query GetUserWishlists {
                getWishlistsByEmail {
                    id
                    wishlistType
                    isPublic
                    products {
                        ID
                        Image
                        linkProduct
                        nameProduct
                        quantityProduct
                        skuCodeReference
                        department
                        bundle
                        notes
                    }
                }
            }
        `

		const listResponse = await Eitri.http.post(GRAPHQL_URL, { query: queryList, variables: {} }, { headers })
		let wishlists = listResponse.data?.data?.getWishlistsByEmail || []

		const newProduct = {
			ID: Number(sku || productId),
			Image: '',
			linkProduct: '',
			nameProduct: String(title || 'Favorito'),
			quantityProduct: 1,
			skuCodeReference: String(sku || productId),
			department: '',
			bundle: 1,
			notes: String(productId)
		}

		let response = null

		if (wishlists.length > 0) {
			const targetList = wishlists[0]
			const currentProducts = targetList.products || []
			const hasProduct = currentProducts.find(p => String(p.ID) === String(sku || productId))
			const updatedProducts = hasProduct ? currentProducts : [...currentProducts, newProduct]

			const mutationUpdate = `
                mutation UpdateWishlist($wishlist: WishlistInput!) {
                    updateWishlist(wishlist: $wishlist) {
                        id
                    }
                }
            `

			response = await Eitri.http.post(
				GRAPHQL_URL,
				{
					query: mutationUpdate,
					variables: {
						wishlist: {
							id: targetList.id,
							wishlistType: targetList.wishlistType || 'Wishlist',
							isPublic: targetList.isPublic || false,
							products: updatedProducts.map(p => ({
								ID: Number(p.ID),
								Image: p.Image || '',
								linkProduct: p.linkProduct || '',
								nameProduct: String(p.nameProduct || ''),
								quantityProduct: Number(p.quantityProduct || 1),
								skuCodeReference: String(p.skuCodeReference || p.ID),
								department: p.department || '',
								bundle: Number(p.bundle || 1),
								notes: p.notes || ''
							}))
						}
					}
				},
				{ headers }
			)
		} else {
			const mutationCreate = `
                mutation CreateWishlist($wishlist: WishlistInput!) {
                    createWishlist(wishlist: $wishlist) {
                        Id
                    }
                }
            `

			response = await Eitri.http.post(
				GRAPHQL_URL,
				{
					query: mutationCreate,
					variables: {
						wishlist: {
							wishlistType: 'Wishlist',
							isPublic: false,
							products: [newProduct]
						}
					}
				},
				{ headers }
			)
		}

		const result = response.data

		if (result?.errors) {
			console.error('Detalhes do Erro GraphQL:', JSON.stringify(result.errors))
			throw new Error('Falha na validação do GraphQL')
		}

		EventBus.publish({
			channel: 'addToWishlist',
			broadcast: true,
			data: { 
				productId, 
				response: { 
					data: { 
						addToList: result?.data?.updateWishlist?.id || result?.data?.createWishlist?.Id || -1
					} 
				} 
			}
		})

		return result
	} catch (error) {
		console.error('Erro ao adicionar item na wishlist (manual):', error)
		throw error
	}
}
