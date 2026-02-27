/**
 * PessoaJuridicaView - Gerencia a visualização do formulário de Pessoa Jurídica
 */
class PessoaJuridicaView extends BaseView {
    constructor() {
        super();
        this.init();
    }

    init() {
        this.formulario = document.getElementById('pessoaJuridicaForm');
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
     * Retorna os dados do formulário de pessoa jurídica
     */
    obterDados() {
        return {
            regiao: this.obterValor('pj_regiao'),
            cep: this.obterValor('pj_cep'),
            bairro: this.obterValor('pj_bairro'),
            cidade: this.obterValor('pj_cidade'),
            estado: this.obterValor('pj_estado'),
            tempoMercado: this.obterValor('pj_tempoMercado'),
            matrizFilial: this.obterValor('pj_matrizFilial'),
            naturezaJuridica: this.obterValor('pj_naturezaJuridica'),
            porte: this.obterValor('pj_porte'),
            perfilTributario: this.obterValor('pj_perfilTributario'),
            dividaAtiva: this.obterValor('pj_dividaAtiva'),
            quantidadeFuncionarios: this.obterValor('pj_quantidadeFuncionarios'),
            capitalSocial: this.obterValor('pj_capitalSocial'),
            faturamento: this.obterValor('pj_faturamento'),
            cnae: this.obterValor('pj_cnae'),
            whatsapp: this.obterValor('pj_whatsapp'),
            tipoPessoa: 'juridica'
        };
    }

    /**
     * Exibe a página de pessoa jurídica
     */
    exibir() {
        this.mostrarPagina('pessoaJuridicaPage');
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
        this.limparFormulario('pessoaJuridicaForm');
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
        const titulo = document.getElementById('servicoAtualPJ');
        if (titulo) {
            titulo.textContent = nomeServico;
        }
    }

    /**
     * Adiciona botão de voltar
     */
    defineCallbackVoltar(callback) {
        const btnVoltar = document.getElementById('voltarPJ');
        if (btnVoltar) {
            btnVoltar.addEventListener('click', callback);
        }
    }
}
