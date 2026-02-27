/**
 * ClientView - Gerencia a visualização da área do cliente
 */
class ClientView extends BaseView {
    constructor() {
        super();
        this.init();
    }

    init() {
        this.formulario = document.getElementById('clientForm');
        if (this.formulario) {
            this.formulario.addEventListener('submit', (e) => {
                if (this.callbackSubmeter) {
                    e.preventDefault();
                    this.callbackSubmeter();
                }
            });
        }
    }

    /**
     * Retorna os dados do formulário de pedido
     */
    obterDados() {
        return {
            nomeProduto: this.obterValor('productName'),
            categoria: this.obterValor('productCategory'),
            quantidade: this.obterValor('productQuantity'),
            preco: this.obterValor('productPrice'),
            observacoes: this.obterValor('orderNotes')
        };
    }

    /**
     * Exibe a página do cliente
     */
    exibir() {
        this.mostrarPagina('clientPage');
    }

    /**
     * Define o callback de submit do formulário
     */
    defineCallbackSubmit(callback) {
        this.callbackSubmeter = callback;
    }

    /**
     * Limpa o formulário
     */
    limpar() {
        this.limparFormulario('clientForm');
    }

    /**
     * Valida os dados obrigatórios
     */
    validarDados(dados) {
        if (!dados.nomeProduto || !dados.categoria || !dados.quantidade || !dados.preco) {
            return { valido: false, mensagem: 'Preencha todos os campos obrigatórios!' };
        }
        if (parseFloat(dados.quantidade) <= 0) {
            return { valido: false, mensagem: 'A quantidade deve ser maior que 0!' };
        }
        if (parseFloat(dados.preco) <= 0) {
            return { valido: false, mensagem: 'O preço deve ser maior que 0!' };
        }
        return { valido: true };
    }
}
