/**
 * Configuração Global - config.js
 * Facilita alternância entre modo desenvolvimento e produção
 */

const CONFIG = {
    USAR_BANCO_DADOS: true,       // usa MySQL em vez de localStorage
    API_BASE_URL: '/api',         // caminho para as APIs
    DEBUG: false,
    TOAST_DURATION: 5000,
    TRANSITION_DELAY: 1500
};

// Função para log com debug ativado
function log(mensagem, dados = null) {
    if (CONFIG.DEBUG) {
        console.log(`[SISTEMA] ${mensagem}`, dados || '');
    }
}

// Função para erro com debug ativado
function logErro(mensagem, erro = null) {
    if (CONFIG.DEBUG) {
        console.error(`[ERRO] ${mensagem}`, erro || '');
    } else {
        console.error(`[ERRO] ${mensagem}`);
    }
}
