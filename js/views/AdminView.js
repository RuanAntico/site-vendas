/**
 * AdminView - Gerencia a visualização do painel administrativo
 */
class AdminView extends BaseView {
    constructor() {
        super();
        this.init();
    }

    init() {
        this.formulario = document.getElementById('adminForm');
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
     * Retorna os dados do formulário de cadastro de cliente
     */
    obterDados() {
        return {
            nome: this.obterValor('clientName'),
            email: this.obterValor('clientEmail'),
            senha: this.obterValor('clientPassword'),
            telefone: this.obterValor('clientPhone'),
            cpf: this.obterValor('clientCpf')
        };
    }

    /**
     * Atualiza a tabela de clientes
     */
    atualizarTabelaClientes(clientes) {
        const tableBody = document.getElementById('clientsList');
        if (!tableBody) return;

        tableBody.innerHTML = clientes.map(cliente => `
            <tr>
                <td>${cliente.nome}</td>
                <td>${cliente.email}</td>
                <td>${cliente.telefone || 'Não informado'}</td>
                <td>${cliente.cpf || 'Não informado'}</td>
            </tr>
        `).join('');
    }

    /**
     * Exibe a página de admin
     */
    exibir() {
        this.mostrarPagina('adminPage');
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
        this.limparFormulario('adminForm');
    }

    /**
     * Valida os dados obrigatórios
     */
    validarDados(dados) {
        if (!dados.nome || !dados.email || !dados.senha) {
            return { valido: false, mensagem: 'Preencha todos os campos obrigatórios!' };
        }
        return { valido: true };
    }

    /**
     * Atualiza a tabela de dados coletados (PF e PJ)
     */
    atualizarTabelaDadosColetados(dados) {
        const { pessoasFisicas = [], pessoasJuridicas = [] } = dados;
        
        const tablePF = document.getElementById('pessoasFisicasList');
        if (tablePF) {
            tablePF.innerHTML = pessoasFisicas.map((pf, idx) => `
                <tr>
                    <td>${idx + 1}</td>
                    <td>${pf.nome_servico || pf.nomeServico || '-'}</td>
                    <td>${pf.cidade || '-'}</td>
                    <td>${pf.estado || '-'}</td>
                    <td>${pf.whatsapp || '-'}</td>
                    <td><small>${new Date(pf.created_at || pf.data_registro).toLocaleDateString('pt-BR')}</small></td>
                </tr>
            `).join('');
            if (pessoasFisicas.length === 0) {
                tablePF.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum dado coletado</td></tr>';
            }
        }
        
        const tablePJ = document.getElementById('pessoasJuridicasList');
        if (tablePJ) {
            tablePJ.innerHTML = pessoasJuridicas.map((pj, idx) => `
                <tr>
                    <td>${idx + 1}</td>
                    <td>${pj.nome_servico || pj.nomeServico || '-'}</td>
                    <td>${pj.cidade || '-'}</td>
                    <td>${pj.estado || '-'}</td>
                    <td>${pj.whatsapp || '-'}</td>
                    <td><small>${new Date(pj.created_at || pj.data_registro).toLocaleDateString('pt-BR')}</small></td>
                </tr>
            `).join('');
            if (pessoasJuridicas.length === 0) {
                tablePJ.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum dado coletado</td></tr>';
            }
        }
    }
}
