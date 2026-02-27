/**
 * ClientController - Controla a lógica da área do cliente
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
     * Processa a adição de um novo pedido
     */
    handleAdicionarPedido() {
        const dados = this.view.obterDados();

        // Valida os dados
        const validacao = this.view.validarDados(dados);
        if (!validacao.valido) {
            this.view.mostrarMensagem(validacao.mensagem, 'error');
            return;
        }

        // Adiciona o pedido
        const resultado = this.sistema.adicionarPedido(
            dados.nomeProduto,
            dados.categoria,
            dados.quantidade,
            dados.preco,
            dados.observacoes
        );

        if (resultado.sucesso) {
            this.view.mostrarMensagem(resultado.mensagem, 'success');
            this.view.limpar();
            
            // Volta para seleção de serviço após 2 segundos
            setTimeout(() => {
                window.app.servicoController.exibir();
            }, 2000);
        } else {
            this.view.mostrarMensagem(resultado.mensagem, 'error');
        }
    }

    /**
     * Exibe a página do cliente
     */
    exibir() {
        this.view.exibir();
    }
}
