import Eitri from 'eitri-bifrost'

export default class VtexCaller {
	static _mountUrl = (baseUrl, path) => {
		try {
			return new URL(`${baseUrl}/${path.startsWith('/') ? path.substring(1) : path}`)
		} catch (error) {
			console.log('Erro ao montar URL', `${baseUrl}/${path.startsWith('/') ? path.substring(1) : path}`, error)
		}
	}

	static async get(path, options = {}, baseUrl) {
		const remoteConfig = await Eitri.environment.getRemoteConfigs()
		const account = remoteConfig?.providerInfo?.account || 'tezhht'

		const _baseUrl = baseUrl || `https://${account}.vtexcommercestable.com.br`
		const url = VtexCaller._mountUrl(_baseUrl, path)

		console.log('URL', url.href)

		const res = await Eitri.http.get(url.href, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				'accept': 'application/json',
				...options.headers
			}
		})

		return res
	}

	static async post(path, data, options = {}, baseUrl) {
		const remoteConfig = await Eitri.environment.getRemoteConfigs()
		const account = remoteConfig?.providerInfo?.account || 'tezhht'

		const _baseUrl = baseUrl || `https://${account}.vtexcommercestable.com.br`
		const url = VtexCaller._mountUrl(_baseUrl, path)

		const res = await Eitri.http.post(url.href, data, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/vnd.vtex.ds.v10+json',
				...options.headers
			}
		})

		return res
	}

	static async patch(path, data, options = {}, baseUrl) {
		const remoteConfig = await Eitri.environment.getRemoteConfigs()
		const account = remoteConfig?.providerInfo?.account || 'tezhht'

		const _baseUrl = baseUrl || `https://${account}.vtexcommercestable.com.br`
		const url = VtexCaller._mountUrl(_baseUrl, path)

		const res = await Eitri.http.patch(url.href, data, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				'accept': 'application/json',
				...options.headers
			}
		})

		return res
	}

	static async delete(path, options = {}, baseUrl) {
		const remoteConfig = await Eitri.environment.getRemoteConfigs()
		const account = remoteConfig?.providerInfo?.account || 'tezhht'

		const _baseUrl = baseUrl || `https://${account}.vtexcommercestable.com.br`
		const url = VtexCaller._mountUrl(_baseUrl, path)

		console.log('URL', url.href)

		const res = await Eitri.http.delete(url.href, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				'accept': 'application/json',
				...options.headers
			}
		})

		return res
	}
}
