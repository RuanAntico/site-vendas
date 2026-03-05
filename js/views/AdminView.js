/**
 * AdminView - Gerencia a visualizacao do painel administrativo
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

        const pedidosBody = document.getElementById('pedidosList');
        if (pedidosBody) {
            pedidosBody.addEventListener('click', (event) => {
                const row = event.target.closest('tr[data-pedido-id]');
                if (!row || !this.callbackEditarPedido) return;
                this.callbackEditarPedido(row.dataset.pedidoId);
            });
        }

        const filtroStatus = document.getElementById('filterStatusPedido');
        if (filtroStatus) {
            filtroStatus.addEventListener('change', () => {
                if (this.callbackFiltroStatus) {
                    this.callbackFiltroStatus(filtroStatus.value);
                }
            });
        }

        const formEdit = document.getElementById('pedidoEditForm');
        if (formEdit) {
            formEdit.addEventListener('submit', (event) => {
                event.preventDefault();
                if (this.callbackSalvarPedido) {
                    const payload = this.obterPayloadEdicaoPedido();
                    if (payload) {
                        this.callbackSalvarPedido(payload);
                    }
                }
            });
        }

        const btnFechar = document.getElementById('fecharPedidoModal');
        const btnCancelar = document.getElementById('cancelarPedidoModal');
        [btnFechar, btnCancelar].forEach((btn) => {
            if (btn) {
                btn.addEventListener('click', () => this.fecharModalPedido());
            }
        });
    }

    /**
     * Retorna os dados do formulario de cadastro de cliente
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

        if (!clientes || clientes.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Nenhum cliente cadastrado</td></tr>';
            return;
        }

        tableBody.innerHTML = clientes.map((cliente) => `
            <tr>
                <td>${cliente.nome || '-'}</td>
                <td>${cliente.email || '-'}</td>
                <td>${cliente.telefone || 'Nao informado'}</td>
                <td>${cliente.cpf || 'Nao informado'}</td>
            </tr>
        `).join('');
    }

    /**
     * Atualiza a tabela de pedidos
     */
    atualizarTabelaPedidos(pedidos) {
        const tableBody = document.getElementById('pedidosList');
        if (!tableBody) return;

        if (!pedidos || pedidos.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="10" style="text-align:center;">Nenhum pedido encontrado</td></tr>';
            return;
        }

        tableBody.innerHTML = pedidos.map((pedido, idx) => {
            const preco = Number(pedido.preco_unitario || 0);
            const quantidade = Number(pedido.quantidade || 0);
            const total = Number(pedido.valor_total || (preco * quantidade));
            const dataBruta = pedido.data_pedido || pedido.data;
            const dataFormatada = dataBruta ? new Date(dataBruta).toLocaleString('pt-BR') : '-';
            const dadosPessoa = pedido.dados_pessoa || {};
            const resumoPessoa = Object.keys(dadosPessoa).length
                ? [
                    dadosPessoa.nome_servico ? `Servico: ${dadosPessoa.nome_servico}` : null,
                    dadosPessoa.cidade ? `Cidade: ${dadosPessoa.cidade}` : null,
                    dadosPessoa.estado ? `UF: ${dadosPessoa.estado}` : null,
                    dadosPessoa.whatsapp ? `WhatsApp: ${dadosPessoa.whatsapp}` : null,
                    dadosPessoa.cnae ? `CNAE: ${dadosPessoa.cnae}` : null
                ].filter(Boolean).join(' | ')
                : '-';

            return `
                <tr data-pedido-id="${pedido.id}" style="cursor:pointer;">
                    <td>${idx + 1}</td>
                    <td>${pedido.cliente_email || pedido.email || '-'}</td>
                    <td>${pedido.nome_produto || pedido.produto || '-'}</td>
                    <td>${pedido.categoria || '-'}</td>
                    <td>${quantidade}</td>
                    <td>R$ ${preco.toFixed(2)}</td>
                    <td>R$ ${total.toFixed(2)}</td>
                    <td>${dataFormatada}</td>
                    <td>${pedido.status || 'Pendente'}</td>
                    <td>${resumoPessoa}</td>
                </tr>
            `;
        }).join('');
    }

    /**
     * Define callback para clique/edicao de pedidos
     */
    defineCallbackEditarPedido(callback) {
        this.callbackEditarPedido = callback;
    }

    /**
     * Define callback para filtro de status
     */
    defineCallbackFiltroStatus(callback) {
        this.callbackFiltroStatus = callback;
    }

    /**
     * Define callback para salvar edicao
     */
    defineCallbackSalvarPedido(callback) {
        this.callbackSalvarPedido = callback;
    }

    /**
     * Abre modal de edicao do pedido
     */
    abrirModalPedido(pedido) {
        this.pedidoAtualEdicao = pedido;

        const dadosPessoa = pedido.dados_pessoa || {};
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = val ?? '';
        };

        setVal('editPedidoId', pedido.id);
        setVal('editClienteNome', pedido.cliente_nome || '');
        setVal('editProduto', pedido.nome_produto || pedido.produto || '');
        setVal('editCategoria', pedido.categoria || '');
        setVal('editQuantidade', Number(pedido.quantidade || 0));
        setVal('editPrecoUnitario', Number(pedido.preco_unitario || 0));
        setVal('editValorTotal', Number(pedido.valor_total || 0));
        setVal('editObservacoes', pedido.observacoes || '');
        setVal('editStatus', pedido.status || 'Pendente');

        this.renderizarCamposPessoa(dadosPessoa);

        const modal = document.getElementById('pedidoModal');
        if (modal) {
            modal.classList.add('ativo');
        }
    }

    /**
     * Fecha modal de edicao
     */
    fecharModalPedido() {
        const modal = document.getElementById('pedidoModal');
        if (modal) {
            modal.classList.remove('ativo');
        }
        this.pedidoAtualEdicao = null;
    }

    /**
     * Monta payload de edicao baseado no formulario
     */
    obterPayloadEdicaoPedido() {
        if (!this.pedidoAtualEdicao) {
            this.mostrarMensagem('Nenhum pedido selecionado para edicao.', 'error');
            return null;
        }

        const getVal = (id) => {
            const el = document.getElementById(id);
            return el ? el.value : '';
        };

        const camposPessoa = Array.from(document.querySelectorAll('[data-pessoa-field]'));
        const dadosPessoa = {};
        camposPessoa.forEach((el) => {
            const chave = el.getAttribute('data-pessoa-field');
            if (chave) {
                dadosPessoa[chave] = el.value;
            }
        });

        const payload = {
            id: Number(getVal('editPedidoId')),
            pedido: {
                cliente_nome: getVal('editClienteNome'),
                produto: getVal('editProduto'),
                categoria: getVal('editCategoria'),
                quantidade: Number(getVal('editQuantidade') || 0),
                preco_unitario: Number(getVal('editPrecoUnitario') || 0),
                valor_total: Number(getVal('editValorTotal') || 0),
                observacoes: getVal('editObservacoes'),
                status: getVal('editStatus') || 'Pendente'
            },
            dados_pessoa: dadosPessoa
        };

        return payload;
    }

    /**
     * Renderiza dinamicamente todos os campos de pessoa vinculada
     */
    renderizarCamposPessoa(dadosPessoa) {
        const container = document.getElementById('editPessoaCamposContainer');
        if (!container) return;

        const escapeHtml = (value) => String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

        const ignorar = new Set(['id', 'created_at', 'data_registro', 'ip_origem', 'navegador']);
        const entradas = Object.entries(dadosPessoa || {}).filter(([chave]) => !ignorar.has(chave));

        if (entradas.length === 0) {
            container.innerHTML = '<p style="color:#666;">Sem dados vinculados PF/PJ para este pedido.</p>';
            return;
        }

        container.innerHTML = entradas.map(([chave, valor]) => {
            const rotulo = chave.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
            return `
                <div class="form-group">
                    <label>${escapeHtml(rotulo)}</label>
                    <input type="text" class="form-control" data-pessoa-field="${escapeHtml(chave)}" value="${escapeHtml(valor)}">
                </div>
            `;
        }).join('');
    }

    /**
     * Exibe a pagina de admin
     */
    exibir() {
        this.mostrarPagina('adminPage');
    }

    /**
     * Define o callback de submit do formulario
     */
    defineCallbackSubmit(callback) {
        this.callbackSubmeter = callback;
    }

    /**
     * Limpa o formulario
     */
    limpar() {
        this.limparFormulario('adminForm');
    }

    /**
     * Valida os dados obrigatorios
     */
    validarDados(dados) {
        if (!dados.nome || !dados.email || !dados.senha) {
            return { valido: false, mensagem: 'Preencha todos os campos obrigatorios!' };
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
