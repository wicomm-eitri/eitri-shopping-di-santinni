import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { isLoggedIn } from '../../services/CustomerService'

export default function ProtectedView(props) {
	const { afterLoginRedirectTo, redirectState, labelLoading } = props
	const { t } = useTranslation()

	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		async function checkIfUserIsLogged() {
			setIsLoading(true)
			const logged = await isLoggedIn()

			if (!logged) {
				Eitri.navigation.navigate({
					path: 'SignIn',
					replace: true,
					state: { redirectTo: afterLoginRedirectTo, redirectState: redirectState }
				})
			}

			return setIsLoading(false)
		}

		checkIfUserIsLogged()
	}, [])

	if (isLoading) {
		return (
			<View className='flex justify-center items-center min-h-screen'>
				<Text block>{labelLoading || t('protectedView.loading', 'Carregando...')}</Text>
			</View>
		)
	}

	return <>{props.children}</>
}
