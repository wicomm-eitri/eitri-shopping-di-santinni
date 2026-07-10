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
		// Busca direto no MasterData VTEX da entidade de lojas (OS)
		const data =
			(await vtexMasterData.getDataOfEntity(
				'OS',
				'?_fields=state,city,nomeDaLoja,phone,horarioFuncionamento,latitude,longitude,googleMaps,region',
				{
					headers: {
						'REST-Range': 'resources=0-500'
					}
				}
			)) || []

		console.log("DATA STORES: ", data);
		const stores = (Array.isArray(data) ? data : []).map(item => ({
			country: 'BRASIL',
			state: item.state,
			city: item.city,
			name: item.nomeDaLoja,
			address: item.googleMaps,
			phone: item.phone,
			whatsapp: null,
			hours: item.horarioFuncionamento,
			latitude: item.latitude,
			longitude: item.longitude,
			googleMaps: item.googleMaps,
			region: item.region
		}))

		return stores
	} catch (e) {
		console.error('Erro ao carregar lojas', e)

		return []
	}
}
