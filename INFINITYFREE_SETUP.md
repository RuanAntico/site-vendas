# 📚 INSTRUÇÕES DE DEPLOYMENT NO INFINITYFREE

## 1️⃣ CONFIGURAÇÃO DO BANCO DE DADOS

### Passo 1: Acessar o InfinityFree
- Faça login em [infinityfree.net](https://www.infinityfree.net)
- Acesse "Control Panel" ou "Painel de Controle"

### Passo 2: Criar o Banco de Dados
1. Vá para **"MySQL Databases"**
2. Crie um novo banco com o nome: `if0_41259736_db_thamires`
3. Note o usuário do banco (geralmente começa com `if0_41259736_`)
4. Copie a senha gerada

### Passo 3: Executar o Script SQL
1. Acesse **"phpMyAdmin"** no Control Panel
2. Selecione seu novo banco: `if0_41259736_db_thamires`
3. Vá para a aba **"SQL"**
4. Copie todo o conteúdo do arquivo `database.sql`
5. Cole no campo SQL do phpMyAdmin
6. Clique em **"Executar"** (Go)

## 2️⃣ UPLOAD DOS ARQUIVOS

### Estrutura esperada:
```
public_html/
├── index.html
├── .htaccess
├── css/
│   └── style.css
├── js/
│   ├── models/
│   │   └── Sistema.js
│   ├── views/
│   │   ├── BaseView.js
│   │   ├── LoginView.js
│   │   ├── ServicoView.js
│   │   ├── TipoPessoaView.js
│   │   ├── PessoaFisicaView.js
│   │   ├── PessoaJuridicaView.js
│   │   ├── AdminView.js
│   │   └── ClientView.js
│   └── controllers/
│       ├── AppController.js
│       ├── LoginController.js
│       ├── ServicoController.js
│       ├── TipoPessoaController.js
│       ├── PessoaFisicaController.js
│       ├── PessoaJuridicaController.js
│       ├── AdminController.js
│       └── ClientController.js
└── api/
    ├── config.php
    ├── login.php
    ├── pessoas-fisicas.php
    └── pessoas-juridicas.php
```

### Via FTP:
1. Use um cliente FTP (FileZilla, WinSCP, etc)
2. Conecte-se com as credenciais FTP do InfinityFree
3. Navegue até o diretório `public_html`
4. Faça upload de todos os arquivos mantendo a estrutura

### Via cPanel File Manager:
1. Acesse "File Manager" no Control Panel
2. Navegue até `public_html`
3. Use "Upload" para enviar arquivos
4. Crie as pastas (api, js, css) conforme necessário

## 3️⃣ CONFIGURAR O ARQUIVO `api/config.php`

Abra o arquivo `api/config.php` e atualize com suas credenciais:

```php
$host = 'localhost';
$usuario = 'if0_41259736_user';  // Substitua com seu usuário do banco
$senha = '';  // Adicione a senha se houver
$banco = 'if0_41259736_db_thamires';
```

## 4️⃣ ATIVAR O MODO DE BANCO DE DADOS

No arquivo `js/models/Sistema.js`, procure pela linha:

```javascript
this.usarBancoDados = false; // Mude para true quando estiver no InfinityFree
```

Mude para:

```javascript
this.usarBancoDados = true;
```

## 5️⃣ VERIFICAR A INSTALAÇÃO

1. Acesse seu site: `https://seu-dominio.infinityfree.app`
2. Teste o login com:
   - Email: `admin@email.com`
   - Senha: `senha123`
   - Tipo: `Administrador`

3. Ou como cliente:
   - Email: `cliente@email.com`
   - Senha: `senha123`

## ⚠️ PROBLEMAS COMUNS

### Erro 500 ao salvar dados:
- Verifique as credenciais do banco em `api/config.php`
- Verifique se o arquivo `api/config.php` foi enviado corretamente
- Verifique as permissões dos arquivos no FTP

### Arquivo não encontrado (404):
- Certifique-se de que o arquivo `.htaccess` foi enviado para `public_html`
- O arquivo deve estar na raiz do site, não dentro de uma pasta

### Banco de dados não encontrado:
- Verifique se o nome do banco está correto em `api/config.php`
- Verifique se o banco foi criado no phpMyAdmin
- Verifique se o script SQL foi executado com sucesso

### WhatsApp icon não aparece:
- Adicione a biblioteca Font Awesome (já está no projeto)
- Se não funcionar, adicione no `<head>`:
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

## 🔐 SEGURANÇA

1. **Altere as senhas padrão** após o primeiro acesso
2. **Proteja seus dados** com HTTPS (InfinityFree fornece SSL gratuito)
3. Adicione validações de entrada no backend
4. Use CORS com cuidado em produção

## 📞 SUPORTE

Se tiver problemas:
1. Verifique o console do navegador (F12 > Console)
2. Verifique os logs no phpMyAdmin
3. Entre em contato com o suporte InfinityFree

---

**Boa sorte! 🚀**
