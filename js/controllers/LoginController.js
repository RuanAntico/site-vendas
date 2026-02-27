/**
 * LoginController - Controla a lógica de login
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

        const resultado = await this.sistema.login(dados.email, dados.senha, dados.userType);

        if (resultado.sucesso) {
            const tipoMsg = dados.userType === 'admin' ? 'Administrador' : 'Cliente';
            this.view.mostrarMensagem(`Bem-vindo, ${tipoMsg}!`, 'success');
            
            // Dispara evento de login bem-sucedido
            window.dispatchEvent(new CustomEvent('loginSucesso', {
                detail: { usuario: resultado.usuario, tipo: dados.userType }
            }));

            // Se é client, mostra seleção de serviço após login
            if (dados.userType === 'client') {
                setTimeout(() => {
                    window.app.exibirSelecaoServico();
                }, 1500);
            }
        } else {
            this.view.mostrarMensagem(resultado.mensagem, 'error');
        }
    }
}
