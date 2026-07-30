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
		return match[1].trim();
	}
	return null;
}
