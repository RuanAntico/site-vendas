# 🎯 Sistema de Gestão de Serviços - Thamires

## 📋 Descrição
Sistema web moderno para gestão de serviços de **Mailing, Enriquecimento, Tratamento e Higienização, Disparo de Whats App** com suporte a Pessoa Física e Jurídica.

Implementado com padrão **MVC (Model-View-Controller)** e integrado com banco de dados **MySQL** para hospedagem no **InfinityFree**.

## 🚀 Características

✅ **Autenticação** - Login seguro para Admin e Cliente
✅ **Seleção de Serviço** - Interface intuitiva para escolher o serviço
✅ **Pessoa Física e Jurídica** - Formulários específicos para cada tipo
✅ **Banco de Dados** - Persistência com MySQL
✅ **Responsivo** - Funciona em desktop e mobile
✅ **Modo Desenvolvimento** - localStorage para testes locais
✅ **Modo Produção** - APIs para InfinityFree

## 📁 Estrutura do Projeto

```
projeto/
├── index.html                          # Página principal
├── .htaccess                          # Configurações Apache
├── database.sql                       # Script SQL do banco
├── INFINITYFREE_SETUP.md             # Guia de deployment
├── README.md                          # Este arquivo
├── css/
│   └── style.css                     # Estilos globais
├── js/
│   ├── models/
│   │   └── Sistema.js                # Model - lógica de dados
│   ├── views/
│   │   ├── BaseView.js               # View base com métodos comuns
│   │   ├── LoginView.js              # Interface de login
│   │   ├── ServicoView.js            # Seleção de serviço
│   │   ├── TipoPessoaView.js         # Seleção Pessoa Física/Jurídica
│   │   ├── PessoaFisicaView.js       # Formulário Pessoa Física
│   │   ├── PessoaJuridicaView.js     # Formulário Pessoa Jurídica
│   │   ├── AdminView.js              # Painel administrativo
│   │   └── ClientView.js             # Área do cliente
│   └── controllers/
│       ├── AppController.js          # Orquestra aplicação
│       ├── LoginController.js        # Controla login
│       ├── ServicoController.js      # Controla seleção de serviço
│       ├── TipoPessoaController.js   # Controla tipo de pessoa
│       ├── PessoaFisicaController.js # Controla formulário PF
│       ├── PessoaJuridicaController.js # Controla formulário PJ
│       ├── AdminController.js        # Controla painel admin
│       └── ClientController.js       # Controla área cliente
└── api/
    ├── config.php                    # Conexão banco de dados
    ├── login.php                     # API de login
    ├── pessoas-fisicas.php           # API para salvar PF
    └── pessoas-juridicas.php         # API para salvar PJ
```

## 🔐 Usuários de Teste

### Administrador
- **Email:** admin@email.com
- **Senha:** senha123
- **Tipo:** Administrador

### Cliente
- **Email:** cliente@email.com
- **Senha:** senha123
- **Tipo:** Cliente

> ⚠️ **IMPORTANTE:** Altere estas credenciais em produção!

## 🛠️ Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** PHP 7.4+
- **Banco de Dados:** MySQL 5.7+
- **Padrão:** MVC (Model-View-Controller)
- **API:** RESTful com JSON
- **Hospedagem:** InfinityFree (com suporte local)

## 🎯 Fluxo de Uso

```
1. Login (Cliente ou Admin)
   ↓
2. Cliente → Seleciona Serviço
   ↓
3. Escolhe Tipo (Pessoa Física ou Jurídica)
   ↓
4. Preenche Formulário Específico
   ↓
5. Salva no Banco de Dados
   ↓
6. Volta para Seleção de Serviço
```

## 📋 Serviços Disponíveis

1. **🎯 Mailing** - Campanhas de email marketing
2. **📊 Enriquecimento** - Enriquecimento de dados de clientes
3. **🧹 Tratamento e Higienização** - Limpeza e validação de dados
4. **💬 Disparo de Whats App** - Envio de mensagens via WhatsApp
5. **⚙️ Serviço Customizado** - Serviço personalizado

## 🏃 Início Rápido (Desenvolvimento Local)

### Pré-requisitos
- Python 3.6+
- Navegador moderno

### Passo 1: Clonar/Baixar o Projeto
```bash
cd Projeto-Thamires
```

### Passo 2: Iniciar Servidor Local
```bash
python -m http.server 8000
```

### Passo 3: Acessar no Navegador
```
http://localhost:8000
```

### Passo 4: Testar Login
- Use as credenciais de teste acima
- Os dados serão salvos no localStorage (não perde com F5)

## 🌐 Deployment no InfinityFree

Veja [INFINITYFREE_SETUP.md](INFINITYFREE_SETUP.md) para instruções detalhadas.

**Resumo:**
1. Criar banco de dados `if0_41259736_db_thamires`
2. Executar `database.sql` no phpMyAdmin
3. Fazer upload dos arquivos via FTP
4. Configurar `api/config.php` com credenciais
5. Mudar `usarBancoDados = true` em `Sistema.js`

## 🔄 Fluxo MVC

```
Usuario → View → Controller → Model → API/BD
              ↑                         ↓
              └─────────────────────────┘
```

**View:** Apresentação (HTML, CSS, interação do usuário)
**Controller:** Lógica de aplicação (orquestra View e Model)
**Model:** Lógica de negócio e acesso a dados (BD, API)

## 🎨 Customização

### Adicionar novo serviço:
1. Edite `ServicoController.js`
2. Adicione na array `servicosSelecionaveis`
3. Adicione ícone no HTML

### Adicionar novo campo no formulário:
1. Edite a View correspondente (`PessoaFisicaView.js` ou `PessoaJuridicaView.js`)
2. Adicione input no HTML
3. Adicione campo no método `obterDados()`
4. Atualize o banco com nova coluna em `database.sql`

### Alterar validações:
1. Edite o método `validarDados()` na View
2. Adicione lógica no Controller

## 📊 Banco de Dados

### Tabelas principais:
- `usuarios` - Dados de login
- `pessoas_fisicas` - Dados de pessoas físicas
- `pessoas_juridicas` - Dados de pessoas jurídicas

Cada registro inclui:
- IP de origem
- User-Agent do navegador
- Data/hora de registro
- Serviço relacionado

## 🔒 Segurança

- ✅ Senhas com validação básica
- ✅ CORS configurado na API
- ⚠️ **TODO:** Hash de senha (bcrypt)
- ⚠️ **TODO:** Validação de entrada no backend
- ⚠️ **TODO:** Proteção CSRF
- ⚠️ **TODO:** Rate limiting

## 📈 Próximos Passos

- [ ] Hash de senhas com bcrypt
- [ ] Validação avançada de entrada
- [ ] Painel de relatórios
- [ ] Exportação de dados (CSV, Excel)
- [ ] Sistema de permissões avançado
- [ ] Logs de auditoria
- [ ] Notificações por email
- [ ] Integração com APIs externas

## 🆘 Troubleshooting

### Problema: "Cannot GET /index.html"
**Solução:** Certifique-se que `.htaccess` foi enviado para a raiz

### Problema: "Erro ao conectar ao banco de dados"
**Solução:** Verifique credenciais em `api/config.php`

### Problema: "Dados não salvam"
**Solução:** Verifique `Sistema.js` - `usarBancoDados` deve ser `true`

### Problema: "Falta um campo no formulário"
**Solução:** Atualize o SQL e o arquivo `database.sql`

## 📞 Contato & Suporte

- Documentação: Veja os comentários nos arquivos JS/PHP
- Issues: Descreva o problema detalhadamente
- Melhorias: Sugira via pull request

## 📄 Licença

Projeto desenvolvido para fins de demonstração e aprendizado.

---

**Desenvolvido com ❤️ usando MVC Pattern**

Última atualização: Fevereiro 2026

