/**
 * ClientController - Controla a logica da area do cliente
 */
class ClientController {
    constructor(sistema, view) {
        this.sistema = sistema;
        this.view = view;
        this.init();
    }

    init() {
        this.view.defineCallbackSubmit(() => this.handleAdicionarPedido());
    }

    /**
     * Processa a adicao de um novo pedido
     */
    async handleAdicionarPedido() {
        const dados = this.view.obterDados();

        const validacao = this.view.validarDados(dados);
        if (!validacao.valido) {
            this.view.mostrarMensagem(validacao.mensagem, 'error');
            return;
        }

        const resultado = await this.sistema.adicionarPedido(
            dados.nomeProduto,
            dados.categoria,
            dados.quantidade,
            dados.preco,
            dados.observacoes
        );

        if (resultado.sucesso) {
            this.view.mostrarMensagem(resultado.mensagem, 'success');
            this.view.limpar();

            setTimeout(() => {
                window.app.servicoController.exibir();
            }, 2000);
        } else {
            this.view.mostrarMensagem(resultado.mensagem || 'Erro ao enviar pedido', 'error');
        }
    }

    /**
     * Exibe a pagina do cliente
     */
    exibir() {
        this.view.exibir();
    }
}
