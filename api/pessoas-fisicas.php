<?php
/**
 * API para dados de pessoa fisica
 * GET /api/pessoas-fisicas.php?action=listar
 * POST /api/pessoas-fisicas.php
 */

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['action']) && $_GET['action'] === 'listar') {
        try {
            $sql = "SELECT * FROM pessoas_fisicas ORDER BY id DESC";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            echo json_encode(['sucesso' => true, 'dados' => $stmt->fetchAll()]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao listar dados PF', 'erro' => $e->getMessage()]);
        }
        exit;
    }

    http_response_code(400);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Acao GET invalida']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Metodo nao permitido']);
    exit;
}

$dados = json_decode(file_get_contents('php://input'), true);

if (!isset($dados['cep']) || !isset($dados['cidade']) || !isset($dados['estado'])) {
    http_response_code(400);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Dados obrigatorios faltando']);
    exit;
}

try {
    $sql = "INSERT INTO pessoas_fisicas (
        servico_id, nome_servico, regiao, cep, bairro, cidade, estado,
        faixa_etaria, genero, estado_civil, escolaridade,
        profissao, orgao, servidor, investidor, empresario, aposentado, pensionista,
        banco, margem_disponivel, poder_aquisitivo, classe_social,
        imoveis, veiculos, especie, whatsapp,
        data_registro, ip_origem, navegador
    ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?
    )";

    $stmt = $conn->prepare($sql);

    $stmt->execute([
        $dados['servicoId'] ?? null,
        $dados['nomeServico'] ?? null,
        $dados['regiao'] ?? null,
        $dados['cep'] ?? null,
        $dados['bairro'] ?? null,
        $dados['cidade'] ?? null,
        $dados['estado'] ?? null,
        $dados['faixaEtaria'] ?? null,
        $dados['genero'] ?? null,
        $dados['estadoCivil'] ?? null,
        $dados['escolaridade'] ?? null,
        $dados['profissao'] ?? null,
        $dados['orgao'] ?? null,
        $dados['servidor'] ?? null,
        $dados['investidor'] ?? null,
        $dados['empresario'] ?? null,
        !empty($dados['aposentado']) ? 1 : 0,
        !empty($dados['pensionista']) ? 1 : 0,
        $dados['banco'] ?? null,
        $dados['margemDisponivel'] ?? null,
        $dados['poderAquisitivo'] ?? null,
        $dados['classesSocial'] ?? null,
        $dados['imoveis'] ?? 0,
        $dados['veiculos'] ?? 0,
        $dados['especie'] ?? null,
        $dados['whatsapp'] ?? null,
        date('Y-m-d H:i:s'),
        $_SERVER['REMOTE_ADDR'] ?? null,
        $_SERVER['HTTP_USER_AGENT'] ?? null
    ]);

    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Dados de pessoa fisica salvos com sucesso!',
        'id' => (int) $conn->lastInsertId()
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro ao salvar dados',
        'erro' => $e->getMessage()
    ]);
}
?>
