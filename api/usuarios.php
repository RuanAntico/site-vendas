<?php
/**
 * API de usuarios
 * GET /api/usuarios.php?tipo=client
 * POST /api/usuarios.php
 */

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        if (!empty($_GET['tipo'])) {
            $tipo = sanitizar($_GET['tipo']);
            $sql = "SELECT id, email, tipo, nome, telefone, cpf FROM usuarios WHERE tipo = ? ORDER BY id DESC";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$tipo]);
        } else {
            $sql = "SELECT id, email, tipo, nome, telefone, cpf FROM usuarios ORDER BY id DESC";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
        }

        echo json_encode(['sucesso' => true, 'dados' => $stmt->fetchAll()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao listar usuarios']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Metodo nao permitido']);
    exit;
}

$dados = json_decode(file_get_contents('php://input'), true);

if (!$dados || empty($dados['email']) || empty($dados['senha']) || empty($dados['tipo']) || empty($dados['nome'])) {
    http_response_code(400);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Dados incompletos']);
    exit;
}

$email = normalizarEmail($dados['email']);
$senha = (string) $dados['senha'];
$tipo = sanitizar($dados['tipo']);
$nome = sanitizar($dados['nome']);
$telefone = isset($dados['telefone']) ? sanitizar($dados['telefone']) : null;
$cpf = isset($dados['cpf']) ? sanitizar($dados['cpf']) : null;

if (!$email || $senha === '') {
    http_response_code(400);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Credenciais invalidas']);
    exit;
}

// Por seguranca, este endpoint so cria cliente.
if ($tipo !== 'client') {
    http_response_code(403);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Operacao nao permitida']);
    exit;
}

try {
    $stmtExiste = $conn->prepare("SELECT id FROM usuarios WHERE email = ? LIMIT 1");
    $stmtExiste->execute([$email]);
    if ($stmtExiste->fetch()) {
        http_response_code(409);
        echo json_encode(['sucesso' => false, 'mensagem' => 'Este e-mail ja esta cadastrado']);
        exit;
    }

    $conn->beginTransaction();

    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);

    $sql = "INSERT INTO usuarios (email, senha, tipo, nome, telefone, cpf, data_criacao, ativo) VALUES (?, ?, ?, ?, ?, ?, NOW(), 1)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$email, $senhaHash, $tipo, $nome, $telefone, $cpf]);
    $novoId = (int) $conn->lastInsertId();

    $sql2 = "INSERT INTO clientes (email, nome, telefone, cpf, data_cadastro) VALUES (?, ?, ?, ?, CURDATE())";
    $stmt2 = $conn->prepare($sql2);
    $stmt2->execute([$email, $nome, $telefone, $cpf]);

    $conn->commit();

    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Usuario criado com sucesso',
        'id' => $novoId,
    ]);
} catch (PDOException $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }

    if ((int) $e->getCode() === 23000) {
        http_response_code(409);
        echo json_encode(['sucesso' => false, 'mensagem' => 'Este e-mail ja esta cadastrado']);
    } else {
        http_response_code(500);
        echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao criar usuario']);
    }
}
?>
