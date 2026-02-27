/**
 * ServicoView - Gerencia a visualização de seleção de serviço
 */
class ServicoView extends BaseView {
    constructor() {
        super();
        this.init();
    }

    init() {
        this.botoesServico = document.querySelectorAll('[data-servico]');
        this.botoesServico.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (this.callbackSelecao) {
                    const servico = e.currentTarget.dataset.servico;
                    this.callbackSelecao(servico);
                }
            });
        });
    }

    /**
     * Define o callback para seleção de serviço
     */
    defineCallbackSelecao(callback) {
        this.callbackSelecao = callback;
    }

    /**
     * Exibe a página de seleção de serviço
     */
    exibir() {
        this.mostrarPagina('servicoPage');
    }
}
