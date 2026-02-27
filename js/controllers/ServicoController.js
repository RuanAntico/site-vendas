/**
 * ServicoController - Controla a seleção de serviço
 */
class ServicoController {
    constructor(sistema, view) {
        this.sistema = sistema;
        this.view = view;
        this.servicosSelecionaveis = [
            { id: 'mailing', nome: 'Mailing' },
            { id: 'enriquecimento', nome: 'Enriquecimento' },
            { id: 'tratamento', nome: 'Tratamento e Higienização' },
            { id: 'whatsapp', nome: 'Disparo de Whats App' },
            { id: 'outro', nome: 'Serviço Customizado' }
        ];
        this.init();
    }

    init() {
        this.view.defineCallbackSelecao((servico) => this.handleSelecaoServico(servico));
    }

    /**
     * Processa a seleção de serviço
     */
    handleSelecaoServico(servicoId) {
        const servico = this.servicosSelecionaveis.find(s => s.id === servicoId);
        if (servico) {
            this.sistema.servicoAtual = servicoId;
            this.sistema.nomeServicoAtual = servico.nome;

            // Dispara evento de seleção de serviço
            window.dispatchEvent(new CustomEvent('servicoSelecionado', {
                detail: { servicoId, nomeServico: servico.nome }
            }));
        }
    }

    /**
     * Exibe a página de seleção de serviço
     */
    exibir() {
        this.view.exibir();
    }
}
