/**
 * PessoaFisicaView - Gerencia a visualização do formulário de Pessoa Física
 */
class PessoaFisicaView extends BaseView {
    constructor() {
        super();
        this.init();
    }

    init() {
        this.formulario = document.getElementById('pessoaFisicaForm');
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
     * Retorna os dados do formulário de pessoa física
     */
    obterDados() {
        return {
            regiao: this.obterValor('pf_regiao'),
            cep: this.obterValor('pf_cep'),
            bairro: this.obterValor('pf_bairro'),
            cidade: this.obterValor('pf_cidade'),
            estado: this.obterValor('pf_estado'),
            faixaEtaria: this.obterValor('pf_faixaEtaria'),
            genero: this.obterValor('pf_genero'),
            estadoCivil: this.obterValor('pf_estadoCivil'),
            banco: this.obterValor('pf_banco'),
            aposentado: document.getElementById('pf_aposentado')?.checked || false,
            pensionista: document.getElementById('pf_pensionista')?.checked || false,
            servidor: this.obterValor('pf_servidor'),
            profissao: this.obterValor('pf_profissao'),
            orgao: this.obterValor('pf_orgao'),
            investidor: this.obterValor('pf_investidor'),
            empresario: this.obterValor('pf_empresario'),
            imoveis: this.obterValor('pf_imoveis'),
            veiculos: this.obterValor('pf_veiculos'),
            escolaridade: this.obterValor('pf_escolaridade'),
            poderAquisitivo: this.obterValor('pf_poderAquisitivo'),
            classesSocial: this.obterValor('pf_classeSocial'),
            especie: this.obterValor('pf_especie'),
            margemDisponivel: this.obterValor('pf_margemDisponivel'),
            whatsapp: this.obterValor('pf_whatsapp'),
            tipoPessoa: 'fisica'
        };
    }

    /**
     * Exibe a página de pessoa física
     */
    exibir() {
        this.mostrarPagina('pessoaFisicaPage');
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
        this.limparFormulario('pessoaFisicaForm');
    }

    /**
     * Valida os dados obrigatórios
     */
    validarDados(dados) {
        if (!dados.cep || !dados.cidade || !dados.estado) {
            return { valido: false, mensagem: 'Preencha CEP, Cidade e Estado!' };
        }
        return { valido: true };
    }

    /**
     * Exibe o título do serviço
     */
    exibirTitulo(nomeServico) {
        const titulo = document.getElementById('servicoAtual');
        if (titulo) {
            titulo.textContent = nomeServico;
        }
    }

    /**
     * Adiciona botão de voltar
     */
    defineCallbackVoltar(callback) {
        const btnVoltar = document.getElementById('voltarPF');
        if (btnVoltar) {
            btnVoltar.addEventListener('click', callback);
        }
    }
}
