import { TrackingService } from 'eitri-shopping-di-santinni-shared'

export const sendScreenView = async (friendlyScreenName, screenFilename) => {
	try {
		TrackingService.screenView(friendlyScreenName, screenFilename)
	} catch (e) {
		console.log('Error on TrackingService.screenView', e)
	}
}
