<?php
/**
 * API para dados de pessoa juridica
 * GET /api/pessoas-juridicas.php?action=listar
 * POST /api/pessoas-juridicas.php
 */

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['action']) && $_GET['action'] === 'listar') {
        try {
            $sql = "SELECT * FROM pessoas_juridicas ORDER BY id DESC";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            echo json_encode(['sucesso' => true, 'dados' => $stmt->fetchAll()]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao listar dados PJ', 'erro' => $e->getMessage()]);
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
    $sql = "INSERT INTO pessoas_juridicas (
        servico_id, nome_servico, regiao, cep, bairro, cidade, estado,
        tempo_mercado, matriz_filial, natureza_juridica, porte,
        perfil_tributario, divida_ativa, cnae,
        quantidade_funcionarios, capital_social, faturamento,
        whatsapp, data_registro, ip_origem, navegador
    ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?
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
        $dados['tempoMercado'] ?? null,
        $dados['matrizFilial'] ?? null,
        $dados['naturezaJuridica'] ?? null,
        $dados['porte'] ?? null,
        $dados['perfilTributario'] ?? null,
        $dados['dividaAtiva'] ?? null,
        $dados['cnae'] ?? null,
        $dados['quantidadeFuncionarios'] ?? 0,
        $dados['capitalSocial'] ?? null,
        $dados['faturamento'] ?? null,
        $dados['whatsapp'] ?? null,
        date('Y-m-d H:i:s'),
        $_SERVER['REMOTE_ADDR'] ?? null,
        $_SERVER['HTTP_USER_AGENT'] ?? null
    ]);

    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Dados de pessoa juridica salvos com sucesso!',
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
