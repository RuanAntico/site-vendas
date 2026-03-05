/**
 * LoginController - Controla a logica de login
 */
class LoginController {
    constructor(sistema, view) {
        this.sistema = sistema;
        this.view = view;
        this.init();
    }

    init() {
        this.view.defineCallbackSubmit(() => this.handleLogin());
    }

    /**
     * Processa o login
     */
    async handleLogin() {
        const dados = this.view.obterDados();

        const resultado = await this.sistema.login(dados.email, dados.senha);

        if (resultado.sucesso) {
            const tipoUsuario = resultado.usuario.tipo;
            const tipoMsg = tipoUsuario === 'admin' ? 'Administrador' : 'Cliente';
            this.view.mostrarMensagem(`Bem-vindo, ${tipoMsg}!`, 'success');

            window.dispatchEvent(new CustomEvent('loginSucesso', {
                detail: { usuario: resultado.usuario, tipo: tipoUsuario }
            }));

            if (tipoUsuario === 'client') {
                setTimeout(() => {
                    window.app.exibirSelecaoServico();
                }, 1500);
            }
        } else {
            this.view.mostrarMensagem(resultado.mensagem, 'error');
        }
    }
}
