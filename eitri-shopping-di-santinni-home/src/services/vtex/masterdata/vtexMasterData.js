import VtexCaller from '../_helpers/_vtexCaller.js'

export default class vtexMasterData {
	static async sendDataToEntity(entity, payload) {
		try {
			const response = await VtexCaller.post(`/api/dataentities/${entity}/documents/`, payload)

			return response.data
		} catch (error) {
			console.log('ERROR sendDataToEntity =>', error)
		}
	}

	static async getDataOfEntity(entity, condition, options) {
		console.log('PATH =>', `/api/dataentities/${entity}/search${condition ?? ''}`)

		try {
			const response = await VtexCaller.get(`/api/dataentities/${entity}/search${condition ?? ''}`, {
				headers: {
					...options?.headers,
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'x-vtex-api-appkey': `vtexappkey-wicommpartnerbr-IWDRZJ`,
					'x-vtex-api-apptoken':
						'FALSUVIUAKAJRRABECIRQOZYXNCHTVAHLNESMSPDANUSWDRWKLHYICTLSNSQHDCCKJAMPTRVBGGSJSFQSDJUUIFWXIGMHCBSCOHUHASGMRNPHWJZYYJQCZDATJUPPUSX'
				}
			})

			return response.data
		} catch (error) {
			console.log('ERROR getDataOfEntity =>', error)
		}
	}

	static async updateDataOfEntity(entity, data) {
		let id = data.id
		let bodyReq = data.payload

		try {
			const response = await VtexCaller.patch(`/api/dataentities/${entity}/documents/${id}`, bodyReq, {
				headers: {}
			})

			return response.data
		} catch (error) {
			console.log('ERROR updateDataOfEntity =>', error)
		}
	}

	static async deleteDataOfEntity(entity, id) {
		try {
			const response = await VtexCaller.delete(`/api/dataentities/${entity}/documents/${id}`, {
				headers: {}
			})

			return response.data
		} catch (error) {
			console.log('ERROR deleteDataOfEntity =>', error)
		}
	}
}
