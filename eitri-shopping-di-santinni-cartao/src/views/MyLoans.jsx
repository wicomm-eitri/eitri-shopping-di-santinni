import { useState, useEffect } from 'react'
import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { BottomInset, Loading } from 'eitri-shopping-di-santinni-shared'
import CardHeader from '../components/CardHeader/CardHeader'
import LoanCard from '../components/LoanCard/LoanCard'
import { getLoans } from '../services/CardService'

const mergeNewLoan = (loans, newLoan) => {
	if (!newLoan) return loans

	return [newLoan, ...loans.filter(loan => loan.id !== newLoan.id)]
}

export default function MyLoans(props) {
	const { t } = useTranslation()

	const newLoan = props?.location?.state?.loan || null

	const [loans, setLoans] = useState(null)

	useEffect(() => {
		loadLoans()
	}, [])

	const loadLoans = async () => {
		try {
			const data = await getLoans()

			setLoans(mergeNewLoan(data, newLoan))
		} catch (e) {
			console.error('loadLoans error:', e)
			setLoans(newLoan ? [newLoan] : [])
		}
	}

	const onBack = () => Eitri.navigation.back()

	// TODO: definir destino (link/rota) dos detalhes do empréstimo
	const onPressDetails = () => {}

	return (
		<Page
			title={t('myLoans.pageTitle', 'Empréstimo - Cartão Di Santinni')}
			statusBarTextColor='black'>
			<CardHeader onBack={onBack} />

			<Loading
				isLoading={!loans}
				fullScreen={true}
			/>

			<View className='flex flex-col gap-[30px] px-4 pt-6 bg-snow'>
				<Text className='text-lg font-semibold leading-6 tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					{t('myLoans.title', 'Empréstimo')}
				</Text>

				{loans &&
					loans.map(loan => (
						<LoanCard
							key={loan.id}
							loan={loan}
							onPressDetails={onPressDetails}
						/>
					))}

				<BottomInset />
			</View>
		</Page>
	)
}
