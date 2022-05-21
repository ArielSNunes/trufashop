const urls = {
	producao: 'https://api-pix.gerencianet.com.br',
	homologacao: 'https://api-pix-h.gerencianet.com.br'
}

const getUrl = (env) => urls[env] || urls.homologacao

module.exports = {
	getUrl
}