-- ==========================================
-- BANCO DE DADOS: if0_41259736_db_thamires
-- ==========================================

-- Tabela de Usuários
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('admin', 'client') NOT NULL,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    cpf VARCHAR(20),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE
);

-- Tabela de Clientes
CREATE TABLE clientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    cpf VARCHAR(20),
    data_cadastro DATE,
    FOREIGN KEY (email) REFERENCES usuarios(email)
);

-- Tabela de Pedidos
CREATE TABLE pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    cliente_nome VARCHAR(255) NOT NULL,
    produto VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    quantidade INT,
    preco_unitario DECIMAL(10,2),
    valor_total DECIMAL(10,2),
    observacoes TEXT,
    data DATETIME,
    status VARCHAR(50),
    FOREIGN KEY (email) REFERENCES usuarios(email)
);

-- Tabela de Pessoas Física
CREATE TABLE pessoas_fisicas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    servico_id VARCHAR(50) NOT NULL,
    nome_servico VARCHAR(255),
    
    -- Localização
    regiao VARCHAR(100),
    cep VARCHAR(10),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    
    -- Dados Pessoais
    faixa_etaria VARCHAR(20),
    genero VARCHAR(50),
    estado_civil VARCHAR(50),
    escolaridade VARCHAR(100),
    
    -- Dados Profissionais
    profissao VARCHAR(255),
    orgao VARCHAR(255),
    servidor VARCHAR(10),
    investidor VARCHAR(10),
    empresario VARCHAR(10),
    aposentado BOOLEAN DEFAULT FALSE,
    pensionista BOOLEAN DEFAULT FALSE,
    
    -- Dados Financeiros
    banco VARCHAR(255),
    margem_disponivel DECIMAL(15,2),
    poder_aquisitivo VARCHAR(50),
    classe_social VARCHAR(10),
    
    -- Patrimônio
    imoveis INT DEFAULT 0,
    veiculos INT DEFAULT 0,
    especie VARCHAR(255),
    
    -- Contato
    whatsapp VARCHAR(20),
    
    data_registro DATETIME,
    ip_origem VARCHAR(45),
    navegador TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pessoas Jurídica
CREATE TABLE pessoas_juridicas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    servico_id VARCHAR(50) NOT NULL,
    nome_servico VARCHAR(255),
    
    -- Localização
    regiao VARCHAR(100),
    cep VARCHAR(10),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    
    -- Dados Comerciais
    tempo_mercado VARCHAR(255),
    matriz_filial VARCHAR(50),
    natureza_juridica VARCHAR(255),
    porte VARCHAR(50),
    
    -- Dados Fiscais
    perfil_tributario VARCHAR(255),
    divida_ativa VARCHAR(10),
    cnae VARCHAR(20),
    
    -- Dados Operacionais
    quantidade_funcionarios INT DEFAULT 0,
    capital_social DECIMAL(15,2),
    faturamento DECIMAL(15,2),
    
    -- Contato
    whatsapp VARCHAR(20),
    
    data_registro DATETIME,
    ip_origem VARCHAR(45),
    navegador TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhorar performance
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_tipo ON usuarios(tipo);
CREATE INDEX idx_clientes_email ON clientes(email);
CREATE INDEX idx_pedidos_email ON pedidos(email);
CREATE INDEX idx_pf_servico ON pessoas_fisicas(servico_id);
CREATE INDEX idx_pj_servico ON pessoas_juridicas(servico_id);
CREATE INDEX idx_pf_cidade ON pessoas_fisicas(cidade, estado);
CREATE INDEX idx_pj_cidade ON pessoas_juridicas(cidade, estado);

-- Dados de Inicialização
INSERT INTO usuarios (email, senha, tipo, nome, telefone) VALUES
('admin@email.com', 'senha123', 'admin', 'Administrador', ''),
('cliente@email.com', 'senha123', 'client', 'Cliente Demo', '(11) 99999-8888');
