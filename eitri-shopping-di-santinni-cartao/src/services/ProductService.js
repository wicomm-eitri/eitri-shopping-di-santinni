import { Vtex } from 'eitri-shopping-vtex-shared'
import { startConfigure } from './AppService'

// TODO: trocar pela coleção "Ofertas para você" quando ela existir na VTEX. Por ora usando "APP - Exclusivo DS - Sandália"
export const OFFERS_COLLECTION_ID = 233

const OFFERS_COUNT = 2

const getBestInstallment = seller => {
	const installments = seller?.commertialOffer?.Installments || []

	const best = installments.reduce(
		(max, current) => (current.NumberOfInstallments > max.NumberOfInstallments ? current : max),
		{ NumberOfInstallments: 0 }
	)

	if (best.NumberOfInstallments <= 1) return null

	return { count: best.NumberOfInstallments, value: best.Value }
}

const parseOfferProduct = product => {
	const item =
		product?.items?.find(i => i.sellers?.some(seller => seller.commertialOffer?.AvailableQuantity > 0)) ||
		product?.items?.[0]

	const seller = item?.sellers?.find(s => s.sellerDefault) || item?.sellers?.[0]

	if (!item || !seller?.commertialOffer) return null

	return {
		id: product.productId,
		itemId: item.itemId,
		name: product.productName,
		price: seller.commertialOffer.Price,
		installments: getBestInstallment(seller),
		image: item.images?.[0]?.imageUrl || ''
	}
}

export const getOfferProducts = async () => {
	await startConfigure()

	const result = await Vtex.catalog.getProductsByFacets(`productClusterIds/${OFFERS_COLLECTION_ID}`, {
		count: OFFERS_COUNT
	})

	return (result?.products || []).map(parseOfferProduct).filter(Boolean)
}
