const https = require('https')
const axios = require('axios')
/**
 * @typedef Token
 * @type {object}
 * @property {string} access_token - Token de acesso
 * @property {string} token_type - Tipo do token de acesso
 * @property {number} expires_in - Tempo de expiração após a captura do token
 * @property {string} scope - Lista de atribuições do token, separados por 
 * espaço
 * 
 * @typedef Credentials
 * @type {object}
 * @property {string} client_id - Client ID do ambiente
 * @property {string} client_secret - Client ID do ambiente
 * 
 * @typedef GetTokenData
 * @type {object}
 * @property {string} grant_type - Tipo da operação sendo solicitada
 * 
 */

/**
 * Classe responsável por tratar as transações com a Gerencianet
 * 
 * @class
 */
class GNTransactions {
	/** @type {null|Token} Token de autenticação */
	_token = null
	/**  @type {Buffer} Buffer da leitura do arquivo do certificado */
	_certificate = null

	/** @type {Credentials} Credenciais do ambiente */
	_credentials = null

	/**
	 * Construtor da classe
	 * 
	 * @param {object} params
	 * @param {Buffer} params.certificate
	 * @param {Credentials} params.credentials
	 */
	constructor({ certificate, credentials }) {
		this._certificate = certificate
		this._credentials = credentials
	}

	/**
	 * Função responsável por gerar o hash das credenciais
	 * 
	 * @function encryptCredentails
	 */
	encryptCredentails() {
		return Buffer.from(
			[this._credentials.client_id, ':', this._credentials.client_secret]
				.join('')
		).toString('base64')
	}

	/**
	 * Função responsável por retornar a URL do ambiente
	 * 
	 * @function getBaseUrl
	 * 
	 * @param {string} env
	 * 
	 * @returns {string} URL do ambiente
	 */
	getBaseUrl(env) {
		const urls = {
			producao: 'https://api-pix.gerencianet.com.br',
			homologacao: 'https://api-pix-h.gerencianet.com.br'
		}
		if (urls[env])
			return urls[env]
		return urls.homologacao
	}

	/**
	 * Função responsável por fazer a requisição e capturar o token de 
	 * autenticação
	 * 
	 * @function _getToken
	 * @async
	 * @private
	 * @params {GetTokenData} Parametros da getToken
	 * @returns {Promise<void>}
	 */
	async _getToken(data) {
		const agent = new https.Agent({
			pfx: this._certificate,
			passphrase: ''
		})
		const axiosConfig = {
			method: 'POST',
			url: this.getBaseUrl(process.env.GN_ENV) + '/oauth/token',
			headers: {
				Authorization: `Basic ${this.encryptCredentails()}`,
				'Content-type': 'application/json'
			},
			httpsAgent: agent,
			data
		}
		try {
			const response = await axios(axiosConfig)
			const json = response.data
			this._token = json
		} catch (error) {
			this._token = null
			console.log(error)
			console.log('Ocorreu um erro')
		}
	}

	/**
	 * Função responsável por fazer a requisição e capturar o token de 
	 * autenticação
	 * 
	 * @function getToken
	 * @async
	 * @private
	 * @params {GetTokenData} Parametros da getToken
	 * @returns {string}
	 */
	async getToken(data) {
		await this._getToken(data)
		return this._token
	}
}

module.exports = GNTransactions