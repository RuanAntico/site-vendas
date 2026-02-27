/**
 * TipoPessoaView - Gerencia a visualização de seleção de Pessoa Física ou Jurídica
 */
class TipoPessoaView extends BaseView {
    constructor() {
        super();
        this.init();
    }

    init() {
        this.btoesType = document.querySelectorAll('[data-tipo-pessoa]');
        this.btoesType.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (this.callbackSelecao) {
                    const tipo = e.currentTarget.dataset.tipoPessoa;
                    this.callbackSelecao(tipo);
                }
            });
        });
    }

    /**
     * Define o callback para seleção de tipo de pessoa
     */
    defineCallbackSelecao(callback) {
        this.callbackSelecao = callback;
    }

    /**
     * Exibe o título do serviço selecionado
     */
    exibirTitulo(nomeServico) {
        const titulo = document.getElementById('servicoSelecionado');
        if (titulo) {
            titulo.textContent = nomeServico;
        }
    }

    /**
     * Exibe a página de seleção de tipo de pessoa
     */
    exibir() {
        this.mostrarPagina('tipoPessoaPage');
    }
}
