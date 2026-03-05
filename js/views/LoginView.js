/**
 * LoginView - Gerencia a visualização da página de login
 */
class LoginView extends BaseView {
    constructor() {
        super();
        this.init();
    }

    init() {
        this.formulario = document.getElementById('loginForm');
        if (this.formulario) {
            this.formulario.addEventListener('submit', (e) => {
                this.aoSubmeter(e);
            });
        }
    }

    /**
     * Retorna os dados do formulário de login
     */
    obterDados() {
        return {
            email: this.obterValor('email'),
            senha: this.obterValor('password')
        };
    }

    /**
     * Define o callback para quando o formulário é submetido
     */
    aoSubmeter(callback) {
        if (typeof callback === 'function') {
            this.callbackSubmeter = callback;
        }
    }

    /**
     * Dispara o evento de submit
     */
    aoSubmeter(e) {
        e.preventDefault();
        if (this.callbackSubmeter) {
            this.callbackSubmeter();
        }
    }

    /**
     * Exibe a página de login
     */
    exibir() {
        this.mostrarPagina('loginPage');
    }

    /**
     * Define o callback de submit
     */
    defineCallbackSubmit(callback) {
        this.callbackSubmeter = callback;
    }

    /**
     * Limpa o formulário de login
     */
    limpar() {
        this.limparFormulario('loginForm');
    }
}
