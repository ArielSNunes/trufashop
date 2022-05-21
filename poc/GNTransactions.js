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
 * @typedef Cobranca
 * @type {object}
 * @property {object} calendario - Objeto com dados da expiração e criação
 * @property {number} calendario.expiracao - Tempo para expiração da cobrança
 * @property {string=} calendario.criacao - Horário da criação da cobrança
 * @property {string=} txid - Id da transaçào, caso não informado, é gerado pela
 * GerenciaNet
 * @property {number=} revisao - Revisão da transação PIX
 * @property {object=} loc - Metadados da location da cobrança
 * @property {number=} loc.id Id da location
 * @property {string=} loc.location URL do QRCode
 * @property {string=} loc.tipoCob Tipo da cobrança
 * @property {string=} loc.criacao Data da cobrança
 * @property {string=} location URL do QRCode
 * @property {string=} status Status da cobrança
 * @property {object} devedor - Objeto com os dados do devedor
 * @property {string} devedor.cpf - CPF do devedor
 * @property {string} devedor.nome - Nome do devedor
 * @property {object} valor - Valor da cobrança
 * @property {string} valor.original - Valor original da cobrança, com decimal
 * separado por .
 * @property {string} chave - Chave Pix que recebe o valor
 * @property {string} solicitacaoPagador - Descrição da cobrança
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
		try {
			/** 
			 * @type {https.Agent} Agente Https com informações do certificado
			 */
			const agent = new https.Agent({
				pfx: this._certificate,
				passphrase: ''
			})
			/**
			 * @type {import 'axios'.AxiosRequestConfig} Configuração do Axios
			 */
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
			/**
			 * @type {import 'axios'.AxiosResponse} Resposta da requisição
			 */
			const response = await axios(axiosConfig)

			/**
			 * @type {Token} Dados da requisição
			 */
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
	 * @returns {Promise<string>}
	 */
	async getToken(data) {
		await this._getToken(data)
		return this._token
	}

	/**
	 * Função responsável por criar a cobrança via Pix
	 * 
	 * @function askForPix
	 * @async
	 * @param {Cobranca} cobranca Informações da cobranca
	 */
	async askForPix(cobranca) {
		try {
			if (!this?._token?.access_token) {
				throw new Error('Falha ao capturar token')
			}
			/** 
			 * @type {https.Agent} Agente Https com informações do certificado
			 */
			const agent = new https.Agent({
				pfx: this._certificate,
				passphrase: ''
			})
			/**
			 * @type {import 'axios'.AxiosRequestConfig} Configuração do Axios
			 */
			const axiosConfig = {
				method: 'POST',
				url: this.getBaseUrl(process.env.GN_ENV) + '/v2/cob',
				headers: {
					Authorization: `Bearer ${this._token.access_token}`,
					'Content-type': 'application/json'
				},
				httpsAgent: agent,
				data: {
					...cobranca
				}
			}
			/**
			 * @type {import 'axios'.AxiosResponse} Resposta da requisição
			 */
			const response = await axios(axiosConfig)
			const cobranca = response.data
		} catch (error) {
			this._token = null
			console.log(error)
			console.log('Ocorreu um erro')
		}
	}
}

module.exports = GNTransactions