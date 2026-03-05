/**
 * Model - Sistema de Vendas
 * Opera prioritariamente via API/MySQL
 */
class Sistema {
    constructor() {
        this.apiUrl = CONFIG.API_BASE_URL;
        this.usarBancoDados = CONFIG.USAR_BANCO_DADOS;

        this.usuarioLogado = null;
        this.servicoAtual = null;
        this.nomeServicoAtual = null;
        this.tipoPessoaAtual = null;
    }

    /**
     * Realiza o login de um usuario
     */
    async login(email, senha) {
        if (!this.usarBancoDados) {
            return { sucesso: false, mensagem: 'Modo banco de dados esta desativado na configuracao.' };
        }

        try {
            const response = await fetch(`${this.apiUrl}/login.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const resultado = await response.json();

            if (resultado.sucesso) {
                this.usuarioLogado = resultado.usuario;
                localStorage.setItem('userType', resultado.usuario.tipo);
                localStorage.setItem('userEmail', resultado.usuario.email);
                localStorage.setItem('userData', JSON.stringify(resultado.usuario));
            }

            return resultado;
        } catch (erro) {
            logErro('Erro ao fazer login via API', erro);
            return { sucesso: false, mensagem: 'Erro ao conectar ao servidor' };
        }
    }

    /**
     * Faz logout do usuario
     */
    logout() {
        this.usuarioLogado = null;
        localStorage.removeItem('userType');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userData');
        log('Logout realizado');
    }

    /**
     * Restaura sessao de login
     */
    restaurarLogin() {
        const userData = localStorage.getItem('userData');
        if (!userData) {
            return null;
        }

        try {
            const usuario = JSON.parse(userData);
            if (usuario && usuario.email && usuario.tipo) {
                this.usuarioLogado = usuario;
                return usuario;
            }
            return null;
        } catch (erro) {
            logErro('Erro ao restaurar login', erro);
            return null;
        }
    }

    /**
     * Adiciona um novo cliente
     */
    async adicionarCliente(nome, email, senha, telefone, cpf) {
        if (!this.usarBancoDados) {
            return { sucesso: false, mensagem: 'Modo banco de dados esta desativado na configuracao.' };
        }

        try {
            const response = await fetch(`${this.apiUrl}/usuarios.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome,
                    email,
                    senha,
                    telefone,
                    cpf,
                    tipo: 'client'
                })
            });

            const resultado = await response.json();
            if (!resultado.sucesso) {
                return resultado;
            }

            // Confirma no banco antes de sinalizar sucesso na UI.
            const clientes = await this.obterClientes();
            const clienteCriado = clientes.find((c) => c.email === email);
            if (!clienteCriado) {
                return {
                    sucesso: false,
                    mensagem: 'Cadastro nao confirmado no banco. Atualize a pagina e tente novamente.'
                };
            }

            return resultado;
        } catch (erro) {
            logErro('Erro ao criar cliente via API', erro);
            return { sucesso: false, mensagem: 'Erro ao conectar ao servidor' };
        }
    }

    /**
     * Retorna lista de clientes
     */
    async obterClientes() {
        if (!this.usarBancoDados) {
            return [];
        }

        try {
            const response = await fetch(`${this.apiUrl}/usuarios.php?tipo=client`);
            const resultado = await response.json();
            return resultado.sucesso ? (resultado.dados || []) : [];
        } catch (erro) {
            logErro('Erro ao listar clientes via API', erro);
            return [];
        }
    }

    /**
     * Adiciona um novo pedido
     */
    async adicionarPedido(nomeProduto, categoria, quantidade, preco, observacoes, meta = {}) {
        if (!this.usuarioLogado) {
            return { sucesso: false, mensagem: 'Usuario nao autenticado.' };
        }

        if (!this.usarBancoDados) {
            return { sucesso: false, mensagem: 'Modo banco de dados esta desativado na configuracao.' };
        }

        const quantidadeNum = parseInt(quantidade, 10) || 0;
        const precoNum = parseFloat(preco) || 0;
        const valorTotal = (quantidadeNum * precoNum).toFixed(2);

        const payload = {
            email: this.usuarioLogado.email,
            cliente_nome: this.usuarioLogado.nome || this.usuarioLogado.email,
            produto: nomeProduto,
            categoria,
            quantidade: quantidadeNum,
            preco_unitario: precoNum,
            valor_total: parseFloat(valorTotal),
            observacoes,
            status: 'Pendente',
            pessoa_tipo: meta.pessoa_tipo || null,
            pessoa_ref_id: meta.pessoa_ref_id || null
        };

        try {
            const response = await fetch(`${this.apiUrl}/pedidos.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const resultado = await response.json();
            if (resultado.sucesso) {
                return { sucesso: true, mensagem: 'Pedido enviado com sucesso!' };
            }
            return resultado;
        } catch (erro) {
            logErro('Erro ao enviar pedido via API', erro);
            return { sucesso: false, mensagem: 'Erro ao conectar ao servidor' };
        }
    }

    /**
     * Lista pedidos (todos ou por email)
     */
    async obterPedidos(emailCliente = '') {
        if (!this.usarBancoDados) {
            return [];
        }

        try {
            let url = `${this.apiUrl}/pedidos.php`;
            if (emailCliente) {
                url += `?email=${encodeURIComponent(emailCliente)}`;
            }

            const response = await fetch(url);
            const resultado = await response.json();
            return resultado.sucesso ? (resultado.dados || []) : [];
        } catch (erro) {
            logErro('Erro ao listar pedidos via API', erro);
            return [];
        }
    }

    /**
     * Atualiza um pedido e seus dados vinculados de PF/PJ
     */
    async atualizarPedidoCompleto(payload) {
        if (!this.usarBancoDados) {
            return { sucesso: false, mensagem: 'Modo banco de dados esta desativado na configuracao.' };
        }

        try {
            const response = await fetch(`${this.apiUrl}/pedidos.php`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            return await response.json();
        } catch (erro) {
            logErro('Erro ao atualizar pedido via API', erro);
            return { sucesso: false, mensagem: 'Erro ao conectar ao servidor' };
        }
    }

    /**
     * Lista pedidos do usuario logado
     */
    async obterPedidosUsuario() {
        if (!this.usuarioLogado) {
            return [];
        }
        return this.obterPedidos(this.usuarioLogado.email);
    }

    /**
     * Adiciona dados de pessoa fisica
     */
    async adicionarPessoaFisica(dados) {
        if (!this.usarBancoDados) {
            return { sucesso: false, mensagem: 'Modo banco de dados esta desativado na configuracao.' };
        }

        try {
            const response = await fetch(`${this.apiUrl}/pessoas-fisicas.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            return await response.json();
        } catch (erro) {
            logErro('Erro ao salvar pessoa fisica', erro);
            return { sucesso: false, mensagem: 'Erro ao conectar ao servidor' };
        }
    }

    /**
     * Adiciona dados de pessoa juridica
     */
    async adicionarPessoaJuridica(dados) {
        if (!this.usarBancoDados) {
            return { sucesso: false, mensagem: 'Modo banco de dados esta desativado na configuracao.' };
        }

        try {
            const response = await fetch(`${this.apiUrl}/pessoas-juridicas.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            return await response.json();
        } catch (erro) {
            logErro('Erro ao salvar pessoa juridica', erro);
            return { sucesso: false, mensagem: 'Erro ao conectar ao servidor' };
        }
    }

    /**
     * Nao utilizado em modo banco
     */
    obterPessoasFisicas() {
        return [];
    }

    /**
     * Nao utilizado em modo banco
     */
    obterPessoasJuridicas() {
        return [];
    }
}
