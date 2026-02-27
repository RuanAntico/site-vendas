/**
 * TipoPessoaController - Controla a seleção de tipo de pessoa (Física ou Jurídica)
 */
class TipoPessoaController {
    constructor(sistema, view) {
        this.sistema = sistema;
        this.view = view;
        this.init();
    }

    init() {
        this.view.defineCallbackSelecao((tipo) => this.handleSelecaoTipo(tipo));
    }

    /**
     * Processa a seleção do tipo de pessoa
     */
    handleSelecaoTipo(tipo) {
        this.sistema.tipoPessoaAtual = tipo;

        // Dispara evento de seleção de tipo de pessoa
        window.dispatchEvent(new CustomEvent('tipoPessoaSelecionado', {
            detail: { tipo }
        }));
    }

    /**
     * Exibe a página de seleção de tipo de pessoa
     */
    exibir(nomeServico) {
        this.view.exibirTitulo(nomeServico);
        this.view.exibir();
    }
}
