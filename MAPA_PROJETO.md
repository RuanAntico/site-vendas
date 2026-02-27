# 📂 Mapa do Projeto - Thamires Sistema v2.0

## Estrutura Completa

```
c:\Users\Asus vivobook\OneDrive\Documentos\Projeto-Thamires/
│
├─ 📄 **index.html**
│  └─ Layout HTML principal com todas as páginas
│     - loginPage: Tela de login
│     - servicoPage: Seleção de serviço
│     - tipoPessoaPage: Escolher PF ou PJ
│     - pessoaFisicaPage: Formulário completo PF
│     - pessoaJuridicaPage: Formulário completo PJ
│     - adminPage: Painel admin
│     - clientPage: Área do cliente
│
├─ 📄 **database.sql** ⭐ [NOVO]
│  └─ Script SQL completo para MySQL
│     - 7 tabelas (usuarios, clientes, pedidos, etc)
│     - 8 índices para performance
│     - Cria banco IF0_41259736_db_thamires
│
├─ 📄 **.htaccess** ⭐ [NOVO]
│  └─ Configurações Apache
│     - Reescreve URLs para SPA
│     - Headers de segurança
│     - Cache e compressão GZIP
│
├─ 📄 **INFINITYFREE_SETUP.md** ⭐ [NOVO]
│  └─ Guia passo-a-passo para hospedagem
│     - Criar conta e banco
│     - Upload via FTP
│     - Configurar API
│     - Testar sistema
│
├─ 📄 **README.md**
│  └─ Documentação geral do projeto
│     - Descrição
│     - Tecnologias
│     - Configuração
│     - Troubleshooting
│
├─ 📄 **CHANGELOG.md** ⭐ [NOVO]
│  └─ Resumo de tudo que foi alterado
│
├─ 📄 **QUICK_START.md** ⭐ [NOVO]
│  └─ Início rápido em 30 segundos
│
│
├─ 📁 **css/**
│  ├─ style.css
│  │  └─ Todos os estilos do sistema
│  │     - Responsive design
│  │     - Temas cores
│  │     - Animações
│  │
│  └─ (fonts se necessário)
│
│
├─ 📁 **js/**
│  │
│  ├─ 📄 **config.js** ⭐ [NOVO]
│  │  └─ Configurações globais
│  │     - USAR_BANCO_DADOS: false (dev) / true (prod)
│  │     - API_BASE_URL: '/api'
│  │     - DEBUG: true/false
│  │     - TOAST_DURATION, TRANSITION_DELAY
│  │
│  ├─ 📄 app.js
│  │  └─ Inicialização do app
│  │     - Cria AppController
│  │     - Inicia navegação
│  │
│  │
│  ├─ 📁 **models/** (Camada de Dados)
│  │  │
│  │  ├─ 📄 Sistema.js ⭐ [MODIFICADO]
│  │  │  └─ Classe central de gestão de dados
│  │  │     Métodos:
│  │  │     - constructor(dbMode)
│  │  │     - login(email, senha, tipo)
│  │  │     - logout()
│  │  │     - adicionarPessoaFisica(dados)
│  │  │     - adicionarPessoaJuridica(dados)
│  │  │     - obterClientes()
│  │  │     - Suporta localStorage E API
│  │  │
│  │  └─ (outros modelos se necessários)
│  │
│  │
│  ├─ 📁 **views/** (Camada de Apresentação)
│  │  │
│  │  ├─ 📄 BaseView.js
│  │  │  └─ Classe base para todas as views
│  │  │     Métodos:
│  │  │     - criar(id)
│  │  │     - mostrar()
│  │  │     - esconder()
│  │  │     - limpar()
│  │  │     - obterElemento(seletor)
│  │  │     - addEventListener(elemento, evento, handler)
│  │  │
│  │  ├─ 📄 LoginView.js
│  │  │  └─ Tela de login
│  │  │     Campos:
│  │  │     - Email
│  │  │     - Senha
│  │  │     - Tipo (Cliente/Admin)
│  │  │
│  │  ├─ 📄 ServicoView.js ⭐ [NOVO]
│  │  │  └─ Seleção de serviços
│  │  │     Serviços:
│  │  │     - Mailing
│  │  │     - Enriquecimento
│  │  │     - Tratamento e Higienização
│  │  │     - Disparo de Whats App
│  │  │     - Customizado
│  │  │
│  │  ├─ 📄 TipoPessoaView.js ⭐ [NOVO]
│  │  │  └─ Escolher tipo de pessoa
│  │  │     Opções:
│  │  │     - Pessoa Física
│  │  │     - Pessoa Jurídica
│  │  │
│  │  ├─ 📄 PessoaFisicaView.js ⭐ [NOVO]
│  │  │  └─ Formulário Pessoa Física (17 campos)
│  │  │     Seções:
│  │  │     1. Localização
│  │  │     2. Dados Pessoais
│  │  │     3. Dados Profissionais
│  │  │     4. Dados Financeiros
│  │  │     5. Patrimônio
│  │  │     6. Contato
│  │  │
│  │  ├─ 📄 PessoaJuridicaView.js ⭐ [NOVO]
│  │  │  └─ Formulário Pessoa Jurídica (13 campos)
│  │  │     Seções:
│  │  │     1. Localização
│  │  │     2. Dados Comerciais
│  │  │     3. Dados Fiscais
│  │  │     4. Dados Operacionais
│  │  │     5. Contato
│  │  │
│  │  ├─ 📄 AdminView.js
│  │  │  └─ Painel administrativo
│  │  │     Funcionalidades:
│  │  │     - Listar clientes
│  │  │     - Ver dados
│  │  │     - Editar/Deletar
│  │  │
│  │  └─ 📄 ClientView.js
│  │     └─ Área do cliente
│  │        Funcionalidades:
│  │        - Ver seus dados
│  │        - Histórico
│  │
│  │
│  └─ 📁 **controllers/** (Camada de Lógica)
│     │
│     ├─ 📄 AppController.js
│     │  └─ Controlador principal
│     │     Responsáveis:
│     │     - Orquestrar navegação
│     │     - Gerenciar stack de páginas
│     │     - Despachar eventos CustomEvent
│     │
│     ├─ 📄 LoginController.js ⭐ [MODIFICADO]
│     │  └─ Lógica de autenticação
│     │     Métodos:
│     │     - async autenticarUsuario()
│     │     - redirecionarPosLogin()
│     │
│     ├─ 📄 ServicoController.js ⭐ [NOVO]
│     │  └─ Controle de seleção de serviço
│     │     Métodos:
│     │     - selecionarServico(id)
│     │     - obterServicos()
│     │
│     ├─ 📄 TipoPessoaController.js ⭐ [NOVO]
│     │  └─ Controle de tipo de pessoa
│     │     Métodos:
│     │     - selecionarTipoPessoa(tipo)
│     │
│     ├─ 📄 PessoaFisicaController.js ⭐ [NOVO]
│     │  └─ Controle de formulário PF
│     │     Métodos:
│     │     - async salvarPessoaFisica(dados)
│     │     - validar(dados)
│     │
│     ├─ 📄 PessoaJuridicaController.js ⭐ [NOVO]
│     │  └─ Controle de formulário PJ
│     │     Métodos:
│     │     - async salvarPessoaJuridica(dados)
│     │     - validar(dados)
│     │
│     ├─ 📄 AdminController.js
│     │  └─ Controle do painel admin
│     │
│     └─ 📄 ClientController.js
│        └─ Controle da área cliente
│
│
└─ 📁 **api/** ⭐ [NOVO]
   │
   ├─ 📄 config.php
   │  └─ Configuração de conexão
   │     - Conecta ao banco MySQL
   │     - Define headers CORS
   │     - Trata erros
   │
   ├─ 📄 login.php
   │  └─ API de autenticação
   │     - Recebe: {email, senha, tipo}
   │     - Retorna: {sucesso, usuario, mensagem}
   │
   ├─ 📄 pessoas-fisicas.php
   │  └─ API para salvar Pessoa Física
   │     - Recebe: todos os 17 campos
   │     - Retorna: {sucesso, id, mensagem}
   │     - Insere também metadata (IP, navegador)
   │
   └─ 📄 pessoas-juridicas.php
      └─ API para salvar Pessoa Jurídica
         - Recebe: todos os 13 campos
         - Retorna: {sucesso, id, mensagem}
         - Insere também metadata
```

---

## 🎯 Fluxo de Dados (Visualmente)

```
┌─────────────────────────────────────────────────────────────┐
│                    NAVEGADOR                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ index.html (UI)                                        │ │
│  │ - Define todas as páginas                              │ │
│  │ - Carrega CSS e JS                                     │ │
│  └──────────────────────────┬─────────────────────────────┘ │
│                             │                                │
│  ┌──────────────────────────▼─────────────────────────────┐ │
│  │ js/config.js (Configurações Globais)                  │ │
│  │ - USAR_BANCO_DADOS                                     │ │
│  │ - API_BASE_URL                                         │ │
│  │ - DEBUG                                                │ │
│  └──────────────────────────┬─────────────────────────────┘ │
│                             │                                │
│  ┌──────────────────────────▼─────────────────────────────┐ │
│  │ js/app.js (Inicialização)                              │ │
│  │ Cria AppController                                      │ │
│  └──────────────────────────┬─────────────────────────────┘ │
│                             │                                │
┌────────────────────────────▼──────────────────────────────┐  │
│ AppController (Orquestração)                             │  │
│ - Dispatcha eventos CustomEvent                          │  │
│ - Controla navegação entre páginas                       │  │
└────────┬──────────────┬───────────────┬──────────────────┘  │
         │              │               │                    │
    ┌────▼──┐  ┌───────▼──┐  ┌────────▼───┐               │
    │LoginC │  │ServicoC  │  │TipoPessoaC │     ...        │
    │on     │  │ontrol    │  │ontroller   │               │
    │troll  │  │ler       │  │            │               │
    └────┬──┘  └─────┬────┘  └────┬───────┘               │
         │           │            │                       │
         │      ┌────▼────────────▼──────┐                │
         │      │PessoaFisica/Juridica   │                │
         │      │Controller              │                │
         │      └────┬───────────────────┘                │
         │           │                                    │
         │      ┌────▼──────────────────┐                │
    ┌────▼──┐   │Sistema Model           │                │
    │View   │   │(Models/Sistema.js)     │                │
    │s      │   │                        │                │
    │       │   │- localStorage (dev)    │                │
    │       │   │- API calls (prod)      │                │
    │       │   └────┬──────────────┬───┘                │
    │       │        │              │                    │
    └───────┘        │              │                    │
                ┌────▼────────┐  ┌──▼────────┐          │
                │ localStorage│  │  /api/... │          │
                │ (Dev)       │  │  (Prod)   │          │
                └─────────────┘  └────┬──────┘          │
                                      │                 │
└──────────────────────────────────────▼─────────────────┘
                                       │
                    ┌──────────────────▼──────────────────┐
                    │         SERVIDOR REMOTELY          │
                    │      (InfinityFree/PHP/MySQL)      │
                    │                                     │
                    │  /api/config.php                   │
                    │  /api/login.php                    │
                    │  /api/pessoas-fisicas.php          │
                    │  /api/pessoas-juridicas.php        │
                    │         ↓                           │
                    │     MySQL Database                 │
                    │  if0_41259736_db_thamires          │
                    └─────────────────────────────────────┘
```

---

## 📌 Atalhos Importantes

| O que preciso | Arquivo |
|---|---|
| Mudar de frontend para backend | `js/config.js` , coloque `USAR_BANCO_DADOS: true` |
| Ver estrutura do banco | `database.sql` |
| Adicionar novo serviço | `index.html` (botões) + `js/controllers/ServicoController.js` (lógica) |
| Adicionar novo campo em PF | `index.html` + `js/views/PessoaFisicaView.js` + `database.sql` |
| Adicionar novo campo em PJ | `index.html` + `js/views/PessoaJuridicaView.js` + `database.sql` |
| Ver formulário de PF | `index.html` (ID: pessoaFisicaPage) |
| Ver formulário de PJ | `index.html` (ID: pessoaJuridicaPage) |
| Modificar estilos | `css/style.css` |
| Publicar no web | `INFINITYFREE_SETUP.md` |
| Começar rápido | `QUICK_START.md` |

---

## 🔄 Importações e Dependências

```
app.js
├─ config.js
├─ AppController.js
│  ├─ LoginController.js
│  ├─ ServicoController.js
│  ├─ TipoPessoaController.js
│  ├─ PessoaFisicaController.js
│  ├─ PessoaJuridicaController.js
│  ├─ AdminController.js
│  └─ ClientController.js
│
└─ Sistema.js (Model)
   ├─ config.js (para API_BASE_URL)
   └─ Login/Views para renderização
```

---

## 🚀 Como Localizar Algo

| Precisar fazer | Procurar em |
|---|---|
| Mudar cores | `css/style.css` |
| Adicionar novo botão | `index.html` + correspondente `View.js` |
| Mudar lógica de login | `js/controllers/LoginController.js` |
| Adicionar campo novo | `index.html` → `View.js` → `database.sql` |
| Mudar mensagens de erro | `js/controllers/*.js` ou `js/models/Sistema.js` |
| Conectar ao banco real | `js/config.js` (USAR_BANCO_DADOS) + `api/config.php` |

---

**📝 Nota:** Arquivos marcados com ⭐ [NOVO] ou ⭐ [MODIFICADO] foram alterados nesta sessão.
