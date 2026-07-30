export const ERROR_MAP = {
	CHK0223: 'Seu pagamento não foi autorizado'
}

export const extractGatewayMessage = (errorMessage) => {
	if (!errorMessage) return null;

	// Só extrai a mensagem específica se o erro for do Cartão DS
	if (!errorMessage.includes('Cartão DS') && !errorMessage.includes('Cartao DS')) {
		return null;
	}

	const match = errorMessage.match(/Message:(.+)$/);
	if (match && match[1]) {
		const extracted = match[1].trim();
		
		// Se a mensagem do gateway for de timeout, retornamos null 
		// para que o CheckoutReview exiba a mensagem padrão/genérica.
		if (extracted.toLowerCase().includes('timeout')) {
			return null;
		}
		
		return extracted;
	}
	return null;
}
