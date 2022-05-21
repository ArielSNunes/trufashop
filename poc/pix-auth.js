const path = require('path')
const https = require('https')
const axios = require('axios')
const fs = require('fs')
require('dotenv').config({
	path: path.resolve(__dirname, '..', '.env.homologacao')
})

const GNTransactions = require('./GNTransactions')
const {
	GN_ENV,
	GN_CLIENT_ID,
	GN_CLIENT_SECRET,
	GN_CERTIFICATE_FILE
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

	const token = await gnTransaction.getToken(data)

	console.log(token)

}

getToken()