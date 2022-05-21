const path = require('path')
const fs = require('fs')
require('dotenv').config({
	path: path.resolve(__dirname, '..', '.env.producao')
})

const GNTransactions = require('./GNTransactions')
const {
	GN_ENV,
	GN_CLIENT_ID,
	GN_CLIENT_SECRET,
	GN_CERTIFICATE_FILE,
	GN_CHAVE_PIX
} = process.env

const getToken = async () => {
	const gnTransaction = new GNTransactions({
		certificate: fs.readFileSync(
			path.resolve(__dirname, '..', GN_CERTIFICATE_FILE)
		),
		credentials: {
			client_id: GN_CLIENT_ID,
			client_secret: GN_CLIENT_SECRET
		}
	})
	const data = JSON.stringify({
		grant_type: 'client_credentials'
	})

	await gnTransaction.getToken(data)

	const cobranca = await gnTransaction.askForPix(
		{
			calendario: { expiracao: 3600 },
			devedor: { cpf: '44189727814', nome: 'Ariel dos Santos Nunes' },
			valor: { original: '1.50' },
			chave: GN_CHAVE_PIX,
			solicitacaoPagador: 'Cobrança dos serviços prestados'

		}
	)
	const qrcode = await gnTransaction.getLocData(cobranca)
	console.log(qrcode)
}

getToken()