/**
 * AdminController - Controla a lógica do painel administrativo
 */
class AdminController {
    constructor(sistema, view) {
        this.sistema = sistema;
        this.view = view;
        this.init();
    }

    init() {
        this.view.defineCallbackSubmit(() => this.handleAdicionarCliente());
    }

    /**
     * Processa a adição de um novo cliente
     */
    handleAdicionarCliente() {
        const dados = this.view.obterDados();

        // Valida os dados
        const validacao = this.view.validarDados(dados);
        if (!validacao.valido) {
            this.view.mostrarMensagem(validacao.mensagem, 'error');
            return;
        }

        // Adiciona o cliente
        const resultado = this.sistema.adicionarCliente(
            dados.nome,
            dados.email,
            dados.senha,
            dados.telefone,
            dados.cpf
        );

        if (resultado.sucesso) {
            this.view.mostrarMensagem(resultado.mensagem, 'success');
            this.view.limpar();
            this.atualizarListaClientes();
        } else {
            this.view.mostrarMensagem(resultado.mensagem, 'error');
        }
    }

    /**
     * Atualiza a lista de clientes na tela
     */
    atualizarListaClientes() {
        const clientes = this.sistema.obterClientes();
        this.view.atualizarTabelaClientes(clientes);
    }

    /**
     * Atualiza a lista de dados coletados (PF e PJ)
     */
    async atualizarDadosColetados() {
        if (this.sistema.usarBancoDados) {
            try {
                // Tenta carregar do banco via API
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
        } else {
            // Usa dados locais
            const pf = this.sistema.obterPessoasFisicas();
            const pj = this.sistema.obterPessoasJuridicas();
            this.view.atualizarTabelaDadosColetados({
                pessoasFisicas: pf,
                pessoasJuridicas: pj
            });
        }
    }

    /**
     * Exibe a página e atualiza as listas
     */
    exibir() {
        this.view.exibir();
        this.atualizarListaClientes();
        this.atualizarDadosColetados();
    }
}
