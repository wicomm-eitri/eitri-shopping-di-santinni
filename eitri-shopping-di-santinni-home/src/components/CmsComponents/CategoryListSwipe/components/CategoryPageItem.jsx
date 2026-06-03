import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import {
	HeaderReturn,
	HeaderContentWrapper,
	HeaderText,
	HeaderCart,
	HeaderSearchIcon
} from 'eitri-shopping-di-santinni-shared'
import { goToCart, goToSearch } from '../../../../utils/utils'
import CategoryGroupTitle from './CategoryGroupTitle'
import CategoryTitle from './CategoryTitle'

export default function CategoryPageItem({ item, goToItem }) {
	const { t } = useTranslation()

	const [showSubItems, setShowSubItems] = useState(false)

	useEffect(() => {
		if (showSubItems) {
			Eitri.navigation.addBackHandler(() => {
				setShowSubItems(false)

				return false
			})
		} else {
			Eitri.navigation.clearBackHandlers()
		}
	}, [showSubItems])

	const handleItemPress = item => {
		if (item.subcategories && item.subcategories.length > 0) {
			setShowSubItems(true)
		} else {
			goToItem(item)
		}
	}

	return (
		<>
			<CategoryTitle
				icon={item.icon}
				title={item.title}
				hasSubItems={item.subcategories && item.subcategories.length > 0}
				onClick={() => handleItemPress(item)}
			/>
			<View
				className={`flex flex-col min-h-screen h-screen w-screen fixed ${showSubItems ? 'left-0 ' : 'left-[100vw]'} top-0 transition-left duration-300 z-[9999]`}>
				<HeaderContentWrapper
					containerClassName={`${showSubItems ? 'left-0' : '!left-[100vw] !shadow-none'} transition-left !duration-300 !backdrop-blur-none !bg-white`}>
					<View className='justify-between w-full flex items-center'>
						<View className='flex items-center gap-3'>
							<HeaderReturn onClick={() => setShowSubItems(false)} />
							<HeaderText text={item.title}>{item.title}</HeaderText>
						</View>
						<View className='flex items-center gap-6'>
							<HeaderSearchIcon onClick={goToSearch} />
							<HeaderCart onClick={goToCart} />
						</View>
					</View>
				</HeaderContentWrapper>

				<View
					bottomInset={'auto'}
					className='bg-white flex-1 overflow-y-auto'>
					{/* TODO: Perguntar Erick sobre o padding horizontal, se é 26px ou 24px */}
					<View className='flex flex-col px-[26px] py-[32px] gap-8'>
						{item?.subcategories?.map(s => (
							<View
								key={s.title}
								className='flex flex-col gap-6'>
								<CategoryGroupTitle title={s.title} />
								{s?.subSubcategories?.map((subItem, index) => (
									<CategoryTitle
										key={`${subItem.title}-${index}`}
										icon={subItem.icon}
										hasSubItems={false}
										title={subItem.title}
										onClick={() => handleItemPress(subItem)}
									/>
								))}
								{s?.action && (
									<CategoryTitle
										icon={s.icon}
										hasSubItems={false}
										title={`${t('categoryPageItem.seeAll', 'Ver tudo')}`}
										onClick={() => goToItem(s)}
										textClassName='!capitalize !text-red-700'
									/>
								)}
							</View>
						))}
						{/* {item?.action && (
							<CategoryTitle
								icon={item.icon}
								hasSubItems={false}
								title={`${t('categoryPageItem.seeAllIn', 'Ver tudo em')} ${item.title}`}
								onClick={() => goToItem(item)}
							/>
						)}

						{item?.subcategories?.map((subItem, index) => (
							<CategoryTitle
								key={`${subItem.title}-${index}`}
								icon={subItem.icon}
								hasSubItems={false}
								title={subItem.title}
								onClick={() => handleItemPress(subItem)}
							/>
						))} */}
					</View>
				</View>
			</View>
		</>
	)
}
