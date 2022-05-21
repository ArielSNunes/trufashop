const path = require('path')
const https = require('https')
const axios = require('axios')
const fs = require('fs')
require('dotenv').config({
	path: path.resolve(__dirname, '..', '.env.homologacao')
})

const helpers = require('./helpers')
const {
	GN_ENV,
	GN_CLIENT_ID,
	GN_CLIENT_SECRET,
	GN_CERTIFICATE_FILE
} = process.env

const getToken = async () => {
	const certificate = fs.readFileSync(
		path.resolve(__dirname, '..', GN_CERTIFICATE_FILE)
	)
	const credentials = {
		client_id: GN_CLIENT_ID,
		client_secret: GN_CLIENT_SECRET
	}

	const data = JSON.stringify({
		grant_type: 'client_credentials'
	})

	const dataCredentials = [
		credentials.client_id,
		':',
		credentials.client_secret
	].join('')

	const auth = Buffer.from(dataCredentials).toString('base64')
	const agent = new https.Agent({
		pfx: certificate,
		passphrase: ''
	})

	const axiosConfig = {
		method: 'POST',
		url: helpers.getUrl(GN_ENV) + '/oauth/token',
		headers: {
			Authorization: `Basic ${auth}`,
			'Content-type': 'application/json'
		},
		httpsAgent: agent,
		data
	}

	try {
		const response = await axios(axiosConfig)
		const json = response.data
		console.log(json)
	} catch (error) {
		console.log(error)
	}

}

getToken()