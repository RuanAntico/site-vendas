/**
 * AdminController - Controla a logica do painel administrativo
 */
class AdminController {
    constructor(sistema, view) {
        this.sistema = sistema;
        this.view = view;
        this.init();
    }

    init() {
        this.view.defineCallbackSubmit(() => this.handleAdicionarCliente());
        this.view.defineCallbackEditarPedido((pedidoId) => this.handleEditarPedido(pedidoId));
        this.view.defineCallbackFiltroStatus((status) => this.handleFiltrarStatus(status));
        this.view.defineCallbackSalvarPedido((payload) => this.handleSalvarEdicaoPedido(payload));
        this.pedidosCache = [];
        this.statusFiltroAtual = '';
    }

    /**
     * Processa a adicao de um novo cliente
     */
    async handleAdicionarCliente() {
        const dados = this.view.obterDados();

        const validacao = this.view.validarDados(dados);
        if (!validacao.valido) {
            this.view.mostrarMensagem(validacao.mensagem, 'error');
            return;
        }

        const resultado = await this.sistema.adicionarCliente(
            dados.nome,
            dados.email,
            dados.senha,
            dados.telefone,
            dados.cpf
        );

        if (resultado.sucesso) {
            this.view.mostrarMensagem('Cliente cadastrado com sucesso!', 'success');
            this.view.limpar();
            await this.atualizarListaClientes();
            await this.atualizarPedidos();
        } else {
            this.view.mostrarMensagem(resultado.mensagem || 'Erro ao cadastrar cliente', 'error');
        }
    }

    /**
     * Atualiza a lista de clientes na tela
     */
    async atualizarListaClientes() {
        const clientes = await this.sistema.obterClientes();
        this.view.atualizarTabelaClientes(clientes);
    }

    /**
     * Atualiza a lista de dados coletados (PF e PJ)
     */
    async atualizarDadosColetados() {
        if (this.sistema.usarBancoDados) {
            try {
                const resultadoPF = await fetch(`${this.sistema.apiUrl}/pessoas-fisicas.php?action=listar`);
                const resultadoPJ = await fetch(`${this.sistema.apiUrl}/pessoas-juridicas.php?action=listar`);

                const pf = await resultadoPF.json();
                const pj = await resultadoPJ.json();

                this.view.atualizarTabelaDadosColetados({
                    pessoasFisicas: pf.dados || [],
                    pessoasJuridicas: pj.dados || []
                });
            } catch (erro) {
                console.error('Erro ao carregar dados:', erro);
                this.view.mostrarMensagem('Erro ao carregar dados dos clientes', 'error');
            }
        }
    }

    /**
     * Atualiza pedidos para o admin
     */
    async atualizarPedidos() {
        const pedidos = await this.sistema.obterPedidos();
        this.pedidosCache = pedidos;
        this.renderizarPedidosFiltrados();
    }

    /**
     * Edita pedido ao clicar em uma linha da tabela
     */
    async handleEditarPedido(pedidoId) {
        const pedido = this.pedidosCache.find((p) => String(p.id) === String(pedidoId));
        if (!pedido) {
            this.view.mostrarMensagem('Pedido nao encontrado para edicao.', 'error');
            return;
        }
        this.view.abrirModalPedido(pedido);
    }

    /**
     * Salva a edicao do pedido
     */
    async handleSalvarEdicaoPedido(payload) {
        const resultado = await this.sistema.atualizarPedidoCompleto(payload);
        if (!resultado.sucesso) {
            this.view.mostrarMensagem(resultado.mensagem || 'Erro ao atualizar pedido', 'error');
            return;
        }
        this.view.fecharModalPedido();
        this.view.mostrarMensagem('Pedido atualizado com sucesso!', 'success');
        await this.atualizarPedidos();
    }

    /**
     * Aplica filtro de status no grid
     */
    handleFiltrarStatus(status) {
        this.statusFiltroAtual = status || '';
        this.renderizarPedidosFiltrados();
    }

    /**
     * Renderiza pedidos conforme filtro atual
     */
    renderizarPedidosFiltrados() {
        const statusFiltro = (this.statusFiltroAtual || '').trim().toLowerCase();
        if (!statusFiltro) {
            this.view.atualizarTabelaPedidos(this.pedidosCache);
            return;
        }
        const filtrados = this.pedidosCache.filter((pedido) => {
            const status = String(pedido.status || '').trim().toLowerCase();
            return status === statusFiltro;
        });
        this.view.atualizarTabelaPedidos(filtrados);
    }

    /**
     * Exibe a pagina e atualiza as listas
     */
    exibir() {
        this.view.exibir();
        this.atualizarListaClientes();
        this.atualizarDadosColetados();
        this.atualizarPedidos();
    }
}
