import { shippingResolver } from 'eitri-shopping-di-santinni-shared'
import { Vtex } from 'eitri-shopping-vtex-shared'

// const formatZipCode = zipCode => {
// 	if (!zipCode) {
// 		return zipCode
// 	}

// 	return String(zipCode).replace(/\D/g, '')
// }

export default async function fetchFreight(zipCode, currentSku) {
	if (!zipCode) {
		return
	}

	try {
		// const formattedZipCode = formatZipCode(zipCode)

		// console.log('formattedZipCode: ', formattedZipCode);

		const address = await Vtex.checkout.resolveZipCode(zipCode)
		const { postalCode, country, geoCoordinates } = address

		let cartSimulationPayload
		let result

		const sellerDefault = currentSku?.sellers?.find(seller => seller.sellerDefault) || currentSku?.sellers[0]

		cartSimulationPayload = {
			items: [
				{
					id: currentSku?.itemId,
					quantity: '1',
					seller: sellerDefault?.sellerId
				}
			],
			country,
			postalCode,
			geoCoordinates
		}

		result = await Vtex.cart.simulateCart(cartSimulationPayload)

		const cannotBeDelivered = result?.messages?.find(item => item.code === 'cannotBeDelivered')

		if (cannotBeDelivered) {
			return []
		}

		return shippingResolver({
			items: result?.items || [],
			shippingData: {
				address: true,
				logisticsInfo: result?.logisticsInfo ? result.logisticsInfo : result?.data?.shipping?.logisticsInfo,
				messages: result?.messages || ''
			}
		})
	} catch (error) {
		console.error('Error fetching freight', error)
	}
}
