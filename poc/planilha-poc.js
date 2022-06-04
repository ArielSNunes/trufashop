const path = require('path')
const fs = require('fs')
require('dotenv').config({
	path: path.resolve(__dirname, '..', '.env.homologacao')
})
const { GoogleSpreadsheet } = require('google-spreadsheet')
const credentials = require('../credentials.json')

const doc = new GoogleSpreadsheet('1tJbwZKqU9BI5I_nECGaYGNPti8l9PamPvMrX6L4K-BI')

const run = async () => {
	await doc.useServiceAccountAuth({
		client_email: process.env.EMAIL_GOOGLE_API,
		private_key: credentials.private_key
	})

	await doc.loadInfo()
	const sheet = doc.sheetsByTitle['Pedidos']
	await sheet.addRows(
		[
			{
				'Pedido': '123',
				'Nome do Cliente': 'Ariel Nunes POC',
				'Telefone do Cliente': '12 982000000',
				'Produto': 'Trufa de Brigadeiro',
				'Quantidade': '3',
				'Subtotal': '17.00',
				'Total do Pedido': '17.00',
				'Status': 'Aguardando Pagamento',
			}
		]
	)
}
run()