import { Vtex } from 'eitri-shopping-vtex-shared'

export const getProductById = async productId => {
	return await Vtex.searchGraphql.product({
		identifier: { field: 'id', value: productId }
	})
}

export const getProductBySku = async skuId => {
	return await Vtex.searchGraphql.product({
		identifier: { field: 'sku', value: skuId }
	})
}
