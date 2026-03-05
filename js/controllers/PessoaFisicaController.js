/**
 * PessoaFisicaController - Controla a lógica do formulário de Pessoa Física
 */
class PessoaFisicaController {
    constructor(sistema, view, tipoPessoaController) {
        this.sistema = sistema;
        this.view = view;
        this.tipoPessoaController = tipoPessoaController;
        this.init();
    }

    init() {
        this.view.defineCallbackSubmit(() => this.handleAdicionarDados());
        this.view.defineCallbackVoltar(() => this.handleVoltar());
    }

    /**
     * Processa a adição de dados de pessoa física
     */
    async handleAdicionarDados() {
        const dados = this.view.obterDados();

        // Valida os dados
        const validacao = this.view.validarDados(dados);
        if (!validacao.valido) {
            this.view.mostrarMensagem(validacao.mensagem, 'error');
            return;
        }

        // Adiciona os dados à pessoa física atual
        dados.servicoId = this.sistema.servicoAtual;
        dados.nomeServico = this.sistema.nomeServicoAtual;
        dados.dataRegistro = new Date().toLocaleString('pt-BR');
        dados.email = this.sistema.usuarioLogado?.email || null;

        // Salva os dados
        const resultado = await this.sistema.adicionarPessoaFisica(dados);

        if (resultado.sucesso) {
            const resultadoPedido = await this.sistema.adicionarPedido(
                this.sistema.nomeServicoAtual || 'Servico sem nome',
                'pessoa_fisica',
                1,
                0,
                `Pedido gerado a partir do formulario de Pessoa Fisica (${this.sistema.nomeServicoAtual || 'Servico'})`,
                { pessoa_tipo: 'fisica', pessoa_ref_id: resultado.id || null }
            );

            if (!resultadoPedido.sucesso) {
                this.view.mostrarMensagem('Dados salvos, mas o pedido nao foi registrado. Tente novamente.', 'error');
                return;
            }

            this.view.mostrarMensagem('Dados e pedido salvos com sucesso!', 'success');
            this.view.limpar();

            // Volta para seleção de serviço após 2 segundos
            setTimeout(() => {
                this.sistema.servicoAtual = null;
                this.sistema.nomeServicoAtual = null;
                this.sistema.tipoPessoaAtual = null;
                window.app.servicoController.exibir();
            }, 2000);
        } else {
            this.view.mostrarMensagem(resultado.mensagem || 'Erro ao salvar dados', 'error');
        }
    }

    /**
     * Volta para seleção de tipo de pessoa
     */
    handleVoltar() {
        this.tipoPessoaController.exibir(this.sistema.nomeServicoAtual);
    }

    /**
     * Exibe a página de pessoa física
     */
    exibir(nomeServico) {
        this.view.exibirTitulo(nomeServico);
        this.view.exibir();
    }
}
