import Eitri from 'eitri-bifrost'
import { Vtex } from 'eitri-shopping-vtex-shared'

export const doLogin = async (email, password, rememberMe) => {
	return await Vtex.customer.loginWithEmailAndPassword(email, password, rememberMe)
}

export async function loginWithEmailAndKey(email, verificationCode) {
	return await Vtex.customer.loginWithEmailAndAccessKey(email, verificationCode)
}

export async function sendAccessKeyByEmail(email) {
	return await Vtex.customer.sendAccessKeyByEmail(email)
}

export const doLogout = async () => {
	return await Vtex.customer.logout()
}

export const isLoggedIn = async () => {
	return await Vtex.customer.isLoggedIn()
}

export const getSavedUser = async () => {
	return await Vtex.customer.retrieveCustomerData()
}

export const sendPasswordResetCode = async userEmail => {
	return await Vtex.customer.sendAccessKeyByEmail(userEmail)
}

export const setPassword = async (email, accessKey, newPassword) => {
	return await Vtex.customer.setPassword(email, accessKey, newPassword)
}

export const getCustomerData = async () => {
	try {
		const result = await Vtex.customer.getCustomerProfile()
		const profile = result?.data?.profile
		return profile
	} catch (e) {
		console.log('getCustomerData error', e)
		return null
	}
}

export const setCustomerData = async profileData => {
	try {
		const payload = {
			firstName: profileData.firstName,
			lastName: profileData.lastName,
			email: profileData.email,
			document: profileData.document,
			homePhone: profileData.homePhone,
			gender: profileData.gender,
			birthDate: profileData.birthDate,
			corporateName: profileData.corporateName,
			corporateDocument: profileData.corporateDocument,
			businessPhone: profileData.businessPhone,
			stateRegistration: profileData.stateRegistration,
			tradeName: profileData.tradeName,
			isCorporate: profileData.isCorporate
		}
		const result = await Vtex.customer.updateCustomerProfile(payload)
		const updateProfile = result?.data?.updateProfile
		return updateProfile
	} catch (e) {
		console.log('setCustomerData error', e)
	}
}

// ============================================================================
// BYPASS WISHLIST (vtex.my-wishlists@2.x) - LEITURA E REMOÇÃO
// ============================================================================

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
                    }
                }
            }
        `
		const headers = await getAuthHeaders()
		const response = await Eitri.http.post(GRAPHQL_URL, { query, variables: {} }, { headers })

		const wishlists = response.data?.data?.getWishlistsByEmail || []
		if (wishlists.length === 0) return []

		const products = wishlists[0].products || []

		// Mapeamos para que o componente Wishlist.jsx consiga ler o item.id e item.productId corretamente
		return products.map(p => ({
			id: String(p.ID),
			productId: String(p.ID),
			name: p.nameProduct,
			sku: p.skuCodeReference
		}))
	} catch (error) {
		console.error('Erro ao carregar wishlist via bypass:', error)
		return []
	}
}

export const removeFromWishlist = async wishListItemId => {
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

		// Remove o produto da lista baseando-se no ID retornado para a tela
		const updatedProducts = (targetList.products || []).filter(item => String(item.ID) !== String(wishListItemId))

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

		const response = await Eitri.http.post(GRAPHQL_URL, { query: mutationUpdate, variables }, { headers })

		if (response.data?.errors) {
			console.error('Detalhes do erro na remoção', JSON.stringify(response.data.errors))
			throw new Error('Falha ao remover item da wishlist')
		}

		return true
	} catch (error) {
		console.error('Erro no removeFromWishlist manual:', error)
		return false
	}
}

// ============================================================================
// OUTRAS FUNÇÕES ORIGINAIS DE LOGIN/PEDIDOS
// ============================================================================

export async function loginWithGoogle() {
	return await Vtex.customer.loginWithGoogle()
}

export async function loginWithFacebook() {
	return await Vtex.customer.loginWithFacebook()
}

export const listOrders = async page => {
	const response = await Vtex.customer.listOrders(page)
	return response
}

export const getOrderById = async orderId => {
	return await Vtex.customer.getOrderById(orderId)
}

export const saveUserEmailOnStorage = async email => {
	return await Vtex.customer.setCustomerData('email', email)
}

export const loadUserEmailFromStorage = async () => {
	return await Vtex.customer.getCustomerData('email')
}

export const saveUserCredentialsOnStorage = async (email, password) => {
	try {
		await Vtex.customer.setCustomerData('email', email)
		await Vtex.customer.setCustomerData('password', password)
	} catch (e) {
		// swallow error; storage is best-effort
		console.warn('saveUserCredentialsOnStorage error', e)
	}
}
