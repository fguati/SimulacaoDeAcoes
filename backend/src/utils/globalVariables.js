//global variables used in multiple modules of the app 

//list of the data that a user needs to have
const userPropertyList = ['username', 'email', 'hashed_password']

//number of seconds for a token to expire
const authTokenDurationInSec = 30 * 60

//path of the directory where the db file will be
const dbFileDir = 'C:\\Users\\nando\\Desktop\\Projetos Programação\\Projetos Pessoais\\Simulação Ações\\SimulacaoDeAcoes\\backend\\src\\db'

module.exports = { userPropertyList, authTokenDurationInSec, dbFileDir }