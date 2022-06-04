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
	const maxRows = sheet.rowCount
	await sheet.loadCells('A1:A' + maxRows)
	await sheet.loadCells('H1:H' + maxRows)
	const validIndex = [...Array(maxRows - 1).keys()]

	const orderId = 123
	const cellCols = {
		pedido: 0,
		nomeCliente: 1,
		telefoneCliente: 2,
		produto: 3,
		quantidade: 4,
		subtotal: 5,
		totalPedido: 6,
		status: 7
	}

	for await (const i of validIndex) {
		const cellPos = i + 1
		const cell = sheet.getCell(cellPos, 0)
		if (cell.value && parseInt(cell.value) === orderId) {
			const statusCell = sheet.getCell(cellPos, cellCols.status)
			statusCell.value = 'Pago com Pix'

		} else {
			break
		}
	}

	await sheet.saveUpdatedCells()

}
run()