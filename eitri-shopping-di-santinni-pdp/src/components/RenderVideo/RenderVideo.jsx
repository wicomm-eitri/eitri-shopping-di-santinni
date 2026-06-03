import { Image } from 'eitri-luminus'
import mockedvideo from '../../assets/images/mockedvideo.png'

export default function RenderVideo({ videoUrl, isMocked }) {
	if (isMocked) {
		return (
			<View className='w-full my-8'>
				<Image
					src={mockedvideo}
					className='w-full object-cover'
				/>
			</View>
		)
	}

	return (
		<View className='w-full my-8'>
			<Video
				source={videoUrl}
				autoPlay={false}
				muted
				className='rounded-lg w-full h-[180px] object-cover'
			/>
		</View>
	)
}
