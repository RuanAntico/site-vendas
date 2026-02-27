/**
 * Model - Sistema de Vendas
 * Gerencia toda a lógica de dados com integração a API
 */
class Sistema {
    constructor() {
        // URL base da API (adaptar para o domínio do InfinityFree)
        this.apiUrl = CONFIG.API_BASE_URL;
        this.usarBancoDados = CONFIG.USAR_BANCO_DADOS;
        
        this.usuarios = [
            { email: 'admin@email.com', senha: 'senha123', tipo: 'admin', nome: 'Administrador' },
            { email: 'cliente@email.com', senha: 'senha123', tipo: 'client', nome: 'Cliente Demo', telefone: '(11) 99999-8888', cpf: '123.456.789-00' }
        ];
        this.clientes = [];
        this.pedidos = [];
        this.pessoasFisicas = [];
        this.pessoasJuridicas = [];
        this.usuarioLogado = null;
        this.servicoAtual = null;
        this.nomeServicoAtual = null;
        this.tipoPessoaAtual = null;
        this.loadFromStorage();
    }

    /**
     * Realiza o login de um usuário
     */
    async login(email, senha, tipo) {
        if (this.usarBancoDados) {
            try {
                log('Tentando login via API:', { email, tipo });
                
                const response = await fetch(`${this.apiUrl}/login.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha, tipo })
                });

                const resultado = await response.json();
                
                if (resultado.sucesso) {
                    this.usuarioLogado = resultado.usuario;
                    localStorage.setItem('userType', tipo);
                    localStorage.setItem('userEmail', email);
                    log('Login bem-sucedido:', resultado.usuario);
                    return resultado;
                }
                logErro('Login falhou');
                return resultado;
            } catch (erro) {
                logErro('Erro ao fazer login:', erro);
                return { sucesso: false, mensagem: 'Erro ao conectar ao servidor' };
            }
        } else {
            // Usa dados locais (para desenvolvimento)
            const usuario = this.usuarios.find(u => u.email === email && u.senha === senha && u.tipo === tipo);
            if (usuario) {
                this.usuarioLogado = { ...usuario };
                localStorage.setItem('userType', tipo);
                localStorage.setItem('userEmail', email);
                log('Login local bem-sucedido:', usuario);
                return { sucesso: true, usuario };
            }
            logErro('Credenciais inválidas');
            return { sucesso: false, mensagem: 'Credenciais inválidas!' };
        }
    }

    /**
     * Faz logout do usuário
     */
    logout() {
        this.usuarioLogado = null;
        localStorage.removeItem('userType');
        localStorage.removeItem('userEmail');
        log('Logout realizado');
    }

    /**
     * Restaura o login se houver usuário na storage
     */
    restaurarLogin() {
        const userType = localStorage.getItem('userType');
        const userEmail = localStorage.getItem('userEmail');
        
        if (userType && userEmail) {
            const usuario = this.usuarios.find(u => u.email === userEmail && u.tipo === userType);
            if (usuario) {
                this.usuarioLogado = { ...usuario };
                log('Login restaurado:', usuario);
                return usuario;
            }
        }
        return null;
    }

    /**
     * Adiciona um novo cliente
     */
    adicionarCliente(nome, email, senha, telefone, cpf) {
        // Verifica se email já existe
        if (this.usuarios.some(u => u.email === email)) {
            return { sucesso: false, mensagem: 'Este e-mail já está cadastrado!' };
        }

        const novoCliente = {
            email,
            senha,
            tipo: 'client',
            nome,
            telefone,
            cpf
        };

        this.usuarios.push(novoCliente);
        this.clientes.push({
            email,
            nome,
            telefone,
            cpf,
            dataCadastro: new Date().toLocaleDateString('pt-BR')
        });

        this.saveToStorage();
        log('Cliente adicionado:', nom);
        return { sucesso: true, mensagem: `Cliente ${nome} cadastrado com sucesso!` };
    }

    /**
     * Retorna lista de clientes
     */
    obterClientes() {
        return this.usuarios.filter(u => u.tipo === 'client');
    }

    /**
     * Adiciona um novo pedido
     */
    adicionarPedido(nomeProduto, categoria, quantidade, preco, observacoes) {
        if (!this.usuarioLogado) {
            return { sucesso: false, mensagem: 'Usuário não autenticado!' };
        }

        const valorTotal = (parseFloat(quantidade) * parseFloat(preco)).toFixed(2);

        const novoPedido = {
            email: this.usuarioLogado.email,
            clienteNome: this.usuarioLogado.nome,
            produto: nomeProduto,
            categoria,
            quantidade,
            precoUnitario: preco,
            valorTotal,
            observacoes,
            data: new Date().toLocaleString('pt-BR'),
            status: 'Pendente'
        };

        this.pedidos.push(novoPedido);
        this.saveToStorage();
        log('Pedido adicionado:', novoPedido);
        return { sucesso: true, mensagem: 'Pedido enviado com sucesso! Voltando à seleção de serviços...' };
    }

    /**
     * Obtém pedidos do usuário logado
     */
    obterPedidosUsuario() {
        if (!this.usuarioLogado) return [];
        return this.pedidos.filter(p => p.email === this.usuarioLogado.email);
    }

    /**
     * Adiciona dados de pessoa física (com suporte a API)
     */
    async adicionarPessoaFisica(dados) {
        if (this.usarBancoDados) {
            try {
                log('Salvando pessoa física via API:', dados);
                
                const response = await fetch(`${this.apiUrl}/pessoas-fisicas.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });

                const resultado = await response.json();
                if (resultado.sucesso) {
                    log('Pessoa física salva com sucesso. ID:', resultado.id);
                }
                return resultado;
            } catch (erro) {
                logErro('Erro ao salvar pessoa física:', erro);
                return { sucesso: false, mensagem: 'Erro ao conectar ao servidor' };
            }
        } else {
            // Usa dados locais
            this.pessoasFisicas.push(dados);
            this.saveToStorage();
            log('Pessoa física salva localmente');
            return { sucesso: true, mensagem: 'Dados de pessoa física registrados!' };
        }
    }

    /**
     * Adiciona dados de pessoa jurídica (com suporte a API)
     */
    async adicionarPessoaJuridica(dados) {
        if (this.usarBancoDados) {
            try {
                log('Salvando pessoa jurídica via API:', dados);
                
                const response = await fetch(`${this.apiUrl}/pessoas-juridicas.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });

                const resultado = await response.json();
                if (resultado.sucesso) {
                    log('Pessoa jurídica salva com sucesso. ID:', resultado.id);
                }
                return resultado;
            } catch (erro) {
                logErro('Erro ao salvar pessoa jurídica:', erro);
                return { sucesso: false, mensagem: 'Erro ao conectar ao servidor' };
            }
        } else {
            // Usa dados locais
            this.pessoasJuridicas.push(dados);
            this.saveToStorage();
            log('Pessoa jurídica salva localmente');
            return { sucesso: true, mensagem: 'Dados de pessoa jurídica registrados!' };
        }
    }

    /**
     * Obtém todas as pessoas físicas
     */
    obterPessoasFisicas() {
        return this.pessoasFisicas;
    }

    /**
     * Obtém todas as pessoas jurídicas
     */
    obterPessoasJuridicas() {
        return this.pessoasJuridicas;
    }

    /**
     * Salva dados no localStorage
     */
    saveToStorage() {
        const dados = {
            usuarios: this.usuarios,
            clientes: this.clientes,
            pedidos: this.pedidos,
            pessoasFisicas: this.pessoasFisicas,
            pessoasJuridicas: this.pessoasJuridicas
        };
        localStorage.setItem('sistema_vendas', JSON.stringify(dados));
    }

    /**
     * Carrega dados do localStorage
     */
    loadFromStorage() {
        const saved = localStorage.getItem('sistema_vendas');
        if (saved) {
            try {
                const dados = JSON.parse(saved);
                this.usuarios = dados.usuarios || this.usuarios;
                this.clientes = dados.clientes || [];
                this.pedidos = dados.pedidos || [];
                this.pessoasFisicas = dados.pessoasFisicas || [];
                this.pessoasJuridicas = dados.pessoasJuridicas || [];
                log('Dados carregados do localStorage');
            } catch (erro) {
                logErro('Erro ao carregar dados do localStorage:', erro);
            }
        }
    }
}

