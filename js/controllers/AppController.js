/**
 * AppController - Controlador principal da aplicação
 * Gerencia a navegação entre as diferentes telas
 */
class AppController {
    constructor() {
        this.sistema = new Sistema();
        this.loginView = new LoginView();
        this.servicoView = new ServicoView();
        this.tipoPessoaView = new TipoPessoaView();
        this.pessoaFisicaView = new PessoaFisicaView();
        this.pessoaJuridicaView = new PessoaJuridicaView();
        this.adminView = new AdminView();
        this.clientView = new ClientView();

        this.loginController = new LoginController(this.sistema, this.loginView);
        this.servicoController = new ServicoController(this.sistema, this.servicoView);
        this.tipoPessoaController = new TipoPessoaController(this.sistema, this.tipoPessoaView);
        this.pessoaFisicaController = new PessoaFisicaController(this.sistema, this.pessoaFisicaView, this.tipoPessoaController);
        this.pessoaJuridicaController = new PessoaJuridicaController(this.sistema, this.pessoaJuridicaView, this.tipoPessoaController);
        this.adminController = new AdminController(this.sistema, this.adminView);
        this.clientController = new ClientController(this.sistema, this.clientView);

        this.init();
    }

    init() {
        // Observa eventos de login bem-sucedido
        window.addEventListener('loginSucesso', (event) => {
            const { usuario, tipo } = event.detail;
            this.redirecionarAposLogin(tipo);
        });

        // Observa seleção de serviço
        window.addEventListener('servicoSelecionado', (event) => {
            const { nomeServico } = event.detail;
            this.tipoPessoaController.exibir(nomeServico);
        });

        // Observa seleção de tipo de pessoa
        window.addEventListener('tipoPessoaSelecionado', (event) => {
            const { tipo } = event.detail;
            if (tipo === 'fisica') {
                this.pessoaFisicaController.exibir(this.sistema.nomeServicoAtual);
            } else if (tipo === 'juridica') {
                this.pessoaJuridicaController.exibir(this.sistema.nomeServicoAtual);
            }
        });

        // Tenta restaurar o login se houver sessão ativa
        const usuarioRestaurado = this.sistema.restaurarLogin();
        if (usuarioRestaurado) {
            const tipo = usuarioRestaurado.tipo;
            this.redirecionarAposLogin(tipo);
        } else {
            this.loginView.exibir();
        }

        // Configura o botão de logout
        this.configurarLogout();

        // Configura os botões de abas no painel admin
        this.configurarAbasAdmin();
    }

    /**
     * Configura os botões de abas para PF e PJ no admin
     */
    configurarAbasAdmin() {
        const btnAbaPF = document.getElementById('btnAbaPF');
        const btnAbaPJ = document.getElementById('btnAbaPJ');
        const abaPF = document.getElementById('abaPF');
        const abaPJ = document.getElementById('abaPJ');

        if (btnAbaPF && btnAbaPJ && abaPF && abaPJ) {
            btnAbaPF.addEventListener('click', () => {
                abaPF.style.display = 'block';
                abaPJ.style.display = 'none';
                btnAbaPF.style.background = '#3498db';
                btnAbaPJ.style.background = '#7f8c8d';
            });

            btnAbaPJ.addEventListener('click', () => {
                abaPF.style.display = 'none';
                abaPJ.style.display = 'block';
                btnAbaPF.style.background = '#7f8c8d';
                btnAbaPJ.style.background = '#3498db';
            });
        }
    }

    /**
     * Redireciona para a página apropriada após login bem-sucedido
     */
    redirecionarAposLogin(tipo) {
        if (tipo === 'admin') {
            this.adminController.exibir();
        } else if (tipo === 'client') {
            // Clientes vão para seleção de serviço
            this.servicoController.exibir();
        }
    }

    /**
     * Exibe a tela de seleção de serviço após login de client
     */
    exibirSelecaoServico() {
        this.servicoController.exibir();
    }

    /**
     * Configura os botões de logout
     */
    configurarLogout() {
        const logoutBtns = document.querySelectorAll('.logout-btn');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleLogout());
        });

        // Alternativa: adiciona listener global para 'logout'
        window.logout = () => this.handleLogout();
    }

    /**
     * Processa o logout
     */
    handleLogout() {
        this.sistema.logout();
        this.loginView.exibir();
        this.loginView.limpar();
        this.loginView.mostrarMensagem('Você foi desconectado!', 'success');
    }
}

// Inicia a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AppController();
});
