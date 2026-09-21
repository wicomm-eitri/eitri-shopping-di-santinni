import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { Page, View, Text, Image } from 'eitri-luminus'
import { BottomInset } from 'eitri-shopping-di-santinni-shared'
import CardHeader from '../components/CardHeader/CardHeader'
import ContactCard from '../components/ContactCard/ContactCard'
import ChevronIcon from '../assets/icons/chevron-left.svg'
import WhatsappIcon from '../assets/icons/whatsapp.svg'
import CleoImage from '../assets/images/cleo.png'

const SUPPORT_EMAIL = 'atendimento@credystem.com'

const CONTACTS = [
	{
		id: 'capitals',
		title: 'Capitais e Regiões Metropolitanas',
		phone: '4003 3900',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
	},
	{
		id: 'sac',
		title: 'Dúvidas e SAC',
		phone: '0800 729 3900',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
	},
	{
		id: 'ombudsman',
		title: 'Ouvidoria',
		phone: '0800 777 5297',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
	}
]

export default function Help() {
	const { t } = useTranslation()

	const onBack = () => Eitri.navigation.back()

	const openEmail = () => {
		try {
			Eitri.deeplink.open({ url: `mailto:${SUPPORT_EMAIL}` })
		} catch (error) {
			console.error('openEmail error:', error)
		}
	}

	const callPhone = phone => {
		try {
			Eitri.deeplink.open({ url: `tel:${phone.replace(/\s/g, '')}` })
		} catch (error) {
			console.error('callPhone error:', error)
		}
	}

	return (
		<Page
			title='Me Ajuda - Cartão Di Santinni'
			statusBarTextColor='black'>
			<CardHeader onBack={onBack} />

			<View className='flex flex-col gap-[30px] px-4 pt-5 bg-snow'>
				<Text className='text-lg font-semibold tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					{t('help.pageTitle', 'Me Ajuda')}
				</Text>

				<View className='flex flex-row items-center justify-between border-b border-[#CCCCCC] pb-[2px]'>
					<Text className='text-sm font-semibold text-[#555555]'>
						{t('help.privacyAndTransparency', 'Privacidade e Transparência')}
					</Text>

					<Image
						src={ChevronIcon}
						alt=''
						className='w-5 h-5 rotate-180'
					/>
				</View>

				<Text className='text-xl font-semibold text-[#0C0C0C]'>
					{t('help.customerService', 'Central de Atendimento')}
				</Text>

				<View className='flex flex-row items-center justify-between'>
					<Image
						src={CleoImage}
						alt='Cleo'
						className='w-[95px] h-[91px] object-cover'
					/>

					<View className='flex flex-row items-center justify-center gap-[10px] w-[220px] h-[34px] px-6 rounded-full bg-[#C8102E]'>
						<Image
							src={WhatsappIcon}
							alt=''
							className='w-7 h-7'
						/>

						<Text className='text-xs font-bold uppercase text-white'>
							{t('help.talkToCleo', 'Falar com cleo')}
						</Text>
					</View>
				</View>

				<View className='flex flex-col gap-[10px]'>
					<Text className='text-xs text-black'>
						{t('help.talkToAgents', 'Fale com um dos nossos atendentes:')}
					</Text>

					<View
						className='flex items-center justify-center w-[180px] h-7 border border-[#1A5FA8] rounded-[5px]'
						onClick={openEmail}>
						<Text className='text-xs underline text-[#1A5FA8]'>{SUPPORT_EMAIL}</Text>
					</View>
				</View>

				<View className='w-full border-t border-[#CCCCCC]' />

				{CONTACTS.map(contact => (
					<ContactCard
						key={contact.id}
						contact={contact}
						onPress={() => callPhone(contact.phone)}
					/>
				))}

				<BottomInset />
			</View>
		</Page>
	)
}
