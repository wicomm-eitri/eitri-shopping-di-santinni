import React, { useState, useEffect } from 'react'
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
import { fetchCategorySizes } from '../../../../services/sizesService'
import CategoryGroupTitle from './CategoryGroupTitle'
import CategorySizeSwipe from './CategorySizeSwipe'
import CategoryTitle from './CategoryTitle'

const SIZE_SECTION_TITLE = 'compre por tamanho'

export default function CategoryPageItem({ item, goToItem }) {
	const { t } = useTranslation()

	const [showSubItems, setShowSubItems] = useState(false)
	const [dynamicSizes, setDynamicSizes] = useState(null)

	useEffect(() => {
		if (item?.title) {
			fetchCategorySizes(item.title).then(sizes => {
				if (sizes && sizes.length > 0) {
					setDynamicSizes(sizes)
				}
			})
		}
	}, [item?.title])

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

	const hasSubItems = Boolean(
		(item?.subcategories && item.subcategories.length > 0) || (dynamicSizes && dynamicSizes.length > 0)
	)

	const handleItemPress = pressedItem => {
		if (pressedItem === item && hasSubItems) {
			setShowSubItems(true)
		} else if (pressedItem?.subcategories && pressedItem.subcategories.length > 0) {
			setShowSubItems(true)
		} else {
			goToItem(pressedItem)
		}
	}

	const hasExistingSizeSection = item?.subcategories?.some(s => {
		const titleLower = s.title?.trim().toLowerCase() || ''

		return titleLower === SIZE_SECTION_TITLE || titleLower.includes('tamanho')
	})

	return (
		<>
			<CategoryTitle
				icon={item.icon || item.imageUrl || item.image || item.thumbnail}
				title={item.title}
				hasSubItems={hasSubItems}
				onClick={() => handleItemPress(item)}
				isCard={true}
				color={item.color}
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
						{!hasExistingSizeSection && dynamicSizes && dynamicSizes.length > 0 && (
							<View className='flex flex-col gap-4'>
								<CategoryGroupTitle
									title='Compre por tamanho'
									variant='size'
								/>
								<CategorySizeSwipe
									items={dynamicSizes}
									onItemClick={handleItemPress}
								/>
							</View>
						)}

						{item?.subcategories?.map(s => {
							const titleLower = s.title?.trim().toLowerCase() || ''
							const isSizeSection = titleLower === SIZE_SECTION_TITLE || titleLower.includes('tamanho')
							const sizeItems = isSizeSection
								? dynamicSizes || s?.subSubcategories || []
								: s?.subSubcategories

							return (
								<View
									key={s.title}
									className='flex flex-col gap-4'>
									<CategoryGroupTitle
										title={s.title}
										variant={isSizeSection ? 'size' : undefined}
									/>

									{isSizeSection ? (
										<CategorySizeSwipe
											items={sizeItems}
											onItemClick={handleItemPress}
										/>
									) : (
										s?.subSubcategories?.map((subItem, index) => (
											<CategoryTitle
												key={`${subItem.title}-${index}`}
												icon={subItem.icon}
												hasSubItems={false}
												title={subItem.title}
												onClick={() => handleItemPress(subItem)}
												textClassName='text-sm'
											/>
										))
									)}

									{s?.action && !isSizeSection && (
										<CategoryTitle
											icon={s.icon}
											hasSubItems={false}
											title={`${t('categoryPageItem.seeAll', 'Ver tudo')}`}
											onClick={() => goToItem(s)}
											textClassName='!capitalize !text-red-700 underline'
										/>
									)}
								</View>
							)
						})}

						{item?.action && (
							<CategoryTitle
								icon={item.icon}
								hasSubItems={false}
								title={`${t('categoryPageItem.seeAllIn', 'Ver tudo em')} ${item.title}`}
								onClick={() => goToItem(item)}
								textClassName='!capitalize !text-red-700 underline'
							/>
						)}
					</View>
				</View>
			</View>
		</>
	)
}
