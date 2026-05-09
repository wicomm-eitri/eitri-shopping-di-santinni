export default function RenderVideo({ videoUrl }) {
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
