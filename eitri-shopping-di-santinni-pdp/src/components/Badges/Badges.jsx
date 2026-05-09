export default function Badges({ textBold, textRegular }) {
    return (
        <View className='flex flex-row items-center gap-0.5 px-3 py-2 rounded-full bg-red-100'>
            <Text className='text-sm w-max font-semibold text-red-700'>{textBold}</Text>
            <Text className='text-sm w-max text-red-700'>{textRegular}</Text>
        </View>
    )
}