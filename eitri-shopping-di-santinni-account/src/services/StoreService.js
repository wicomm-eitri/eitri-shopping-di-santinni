import Eitri from 'eitri-bifrost'
import { Vtex } from 'eitri-shopping-vtex-shared'
import vtexMasterData from './vtex/masterdata/vtexMasterData'

let STORE_PREFERENCES = null

export const getStorePreferences = (page, state = {}, replace = false) => {
	if (STORE_PREFERENCES) {
		return STORE_PREFERENCES
	}

	return new Promise((resolve, reject) => {
		Eitri.environment
			.getRemoteConfigs()
			.then(conf => {
				resolve(conf?.storePreferences || {})
			})
			.catch(e => {
				reject(e)
			})
	})
}

export const getLoginProviders = async () => {
	return await Vtex.store.getLoginProviders()
}

export const getStores = async () => {
	try {
		// Busca direto no MasterData VTEX da entidade de lojas (LN)
		const data =
			(await vtexMasterData.getDataOfEntity(
				'LN',
				'?_fields=uf,cidade,info_nome,info_endereco,info_telefone,info_whatsapp,info_funcionamento,info_lat,info_lng',
				{
					headers: {
						'REST-Range': 'resources=0-500'
					}
				}
			)) || []

		const stores = (Array.isArray(data) ? data : []).map(item => ({
			country: 'BRASIL',
			state: item.uf,
			city: item.cidade,
			name: item.info_nome,
			address: item.info_endereco,
			phone: item.info_telefone,
			whatsapp: item.info_whatsapp,
			hours: item.info_funcionamento,
			lat: item.info_lat,
			lng: item.info_lng
		}))

		return stores
	} catch (e) {
		console.error('Erro ao carregar lojas', e)

		return []
	}
}
