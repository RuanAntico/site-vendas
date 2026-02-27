# 🚀 Quick Start - Thamires Sistema

## ⚡ 30 segundos para testar localmente

### 1. Clonar/Baixar Projeto
```bash
cd c:\Users\Asus vivobook\OneDrive\Documentos\Projeto-Thamires
```

### 2. Iniciar Servidor Local
**Windows - PowerShell:**
```powershell
python -m http.server 8000
# Ou se não tiver Python:
#  Node.js + http-server:
#  npx http-server -p 8000
```

**macOS/Linux:**
```bash
python3 -m http.server 8000
```

### 3. Abrir no Navegador
```
http://localhost:8000
```

### 4. Login de Teste
```
Email: teste@example.com
Senha: 123456
Tipo: Cliente
```

---

## 📊 Estrutura do Projeto

```
📁 Projeto-Thamires/
├── 📄 index.html              ← Arquivo principal
├── 📄 CHANGELOG.md            ← O que foi alterado
├── 📄 README.md               ← Documentação completa
├── 📄 database.sql            ← Script SQL (MySQL)
├── 📄 INFINITYFREE_SETUP.md   ← Como hospedar
├── 📄 .htaccess               ← Config Apache
│
├── 📁 css/
│   └── style.css              ← Estilos
│
├── 📁 js/
│   ├── config.js              ← Configurações globais ⭐
│   ├── app.js                 ← Inicialização
│   │
│   ├── 📁 models/
│   │   └── Sistema.js         ← Lógica de dados
│   │
│   ├── 📁 views/
│   │   ├── BaseView.js
│   │   ├── LoginView.js
│   │   ├── ServicoView.js     ← Novo: seleção de serviço
│   │   ├── TipoPessoaView.js  ← Novo: PF ou PJ
│   │   ├── PessoaFisicaView.js   ← Novo: formulário PF
│   │   ├── PessoaJuridicaView.js ← Novo: formulário PJ
│   │   ├── AdminView.js
│   │   └── ClientView.js
│   │
│   └── 📁 controllers/
│       ├── AppController.js
│       ├── LoginController.js
│       ├── ServicoController.js   ← Novo
│       ├── TipoPessoaController.js ← Novo
│       ├── PessoaFisicaController.js ← Novo
│       ├── PessoaJuridicaController.js ← Novo
│       ├── AdminController.js
│       └── ClientController.js
│
└── 📁 api/                    ← Novo: APIs PHP
    ├── config.php             ← Conexão BD
    ├── login.php              ← Login API
    ├── pessoas-fisicas.php    ← Salva PF
    └── pessoas-juridicas.php  ← Salva PJ
```

---

## 🎯 Fluxo de Uso

### Cliente
```
1. Abre http://localhost:8000
2. Faz login
3. Seleciona um serviço:
   - Mailing
   - Enriquecimento
   - Tratamento e Higienização
   - Disparo de Whats App
   - Customizado
4. Escolhe: Pessoa Física ou Jurídica
5. Preenche o formulário
6. Envia (salvará em localStorage por enquanto)
```

### Admin
```
1. Faz login com tipo "Admin"
2. Vê painel administrativo
3. Lista todos os clientes
```

---

## 💾 Modos de Funcionamento

### 1️⃣ Desenvolvimento (localStorage)
```javascript
// Em js/config.js
USAR_BANCO_DADOS: false  // ← Ativa localStorage
```
✅ Funciona **muito** rápido
❌ Dados perdem ao limpar cache

### 2️⃣ Produção (MySQL)
```javascript
// Em js/config.js
USAR_BANCO_DADOS: true   // ← Ativa MySQL
```
✅ Dados persistem no banco
❌ Precisa de servidor configurado

---

## 🔧 Arquivo de Configuração (config.js)

```javascript
const CONFIG = {
    USAR_BANCO_DADOS: false,      // false = localStorage, true = API
    API_BASE_URL: '/api',          // URL das APIs
    DEBUG: true,                   // true = mostra logs
    TOAST_DURATION: 5000,          // Ms de mostra mensagem
    TRANSITION_DELAY: 1500         // Ms entre telas
};
```

---

## 📱 Serviços Disponíveis

| Serviço | Descrição |
|---------|-----------|
| 🎯 **Mailing** | Campanhas de email marketing |
| 📊 **Enriquecimento** | Adicionar dados aos contatos |
| 🧹 **Tratamento e Higienização** | Limpar e validar dados |
| 💬 **Disparo de Whats App** | Enviar mensagens WhatsApp |
| ⚙️ **Customizado** | Serviço sob medida |

---

## 🗂️ Campos Coletados

### Pessoa Física (17 campos)
- **Localização:** CEP, Bairro, Cidade, Estado, Região
- **Pessoais:** Faixa Etária, Gênero, Estado Civil, Escolaridade
- **Profissionais:** Profissão, Órgão, Servidor, Investidor, Empresário, Aposentado, Pensionista
- **Financeiros:** Banco, Margem, Poder Aquisitivo, Classe Social
- **Patrimônio:** Imóveis, Veículos, Espécie
- **Contato:** WhatsApp

### Pessoa Jurídica (13 campos)
- **Localização:** CEP, Bairro, Cidade, Estado, Região
- **Comerciais:** Tempo Mercado, Matriz/Filial, Natureza Jurídica, Porte
- **Fiscais:** Perfil Tributário, Dívida Ativa, CNAE
- **Operacionais:** Funcionários, Capital Social, Faturamento
- **Contato:** WhatsApp

---

## 🐛 Debug

### Ativar Logs
```javascript
// No console do navegador, digite:
localStorage.setItem('DEBUG', 'true');
location.reload();
```

### Ver dados salvos (localStorage)
```javascript
// No console:
console.log(localStorage);
```

### Limpar dados (localStorage)
```javascript
// No console:
localStorage.clear();
```

---

## 🌐 Para Publicar no InfinityFree

1. Seguir: **INFINITYFREE_SETUP.md**
2. Upload via FTP
3. Config do banco
4. Mudar `USAR_BANCO_DADOS = true`
5. Pronto!

---

## 📚 Documentação Detalhada

- **README.md** - Guia completo
- **CHANGELOG.md** - Histórico de mudanças
- **INFINITYFREE_SETUP.md** - Deploy step-by-step
- **database.sql** - Schema do banco

---

## 🆘 Problemas Comuns

### "Página branca"
→ Abrir DevTools (F12) → Console e procurar erro

### "localStorage não funciona"
→ Talvez em produção precise ser HTTPS

### "API não conecta"
→ Verificar `CONFIG.API_BASE_URL` em config.js

### "Botão não funciona"
→ Verificar console (F12 → Console)

---

**Boa sorte! 🚀**
