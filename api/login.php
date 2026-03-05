<?php
/**
 * API de login
 * POST /api/login.php
 */

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Metodo nao permitido']);
    exit;
}

$dados = json_decode(file_get_contents('php://input'), true);

if (!isset($dados['email']) || !isset($dados['senha'])) {
    http_response_code(400);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Dados incompletos']);
    exit;
}

$email = normalizarEmail($dados['email']);
$senha = (string) $dados['senha'];

if (!$email || $senha === '') {
    http_response_code(400);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Credenciais invalidas']);
    exit;
}

try {
    $sql = "SELECT id, email, senha, tipo, nome, telefone, cpf FROM usuarios WHERE email = ? AND ativo = 1 LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$email]);
    $usuario = $stmt->fetch();

    if (!$usuario) {
        http_response_code(401);
        echo json_encode(['sucesso' => false, 'mensagem' => 'Email ou senha invalidos']);
        exit;
    }

    $senhaBanco = (string) $usuario['senha'];
    $senhaOk = false;

    if (password_get_info($senhaBanco)['algo'] !== null) {
        $senhaOk = password_verify($senha, $senhaBanco);
    } else {
        // Compatibilidade com usuarios antigos sem hash.
        $senhaOk = hash_equals($senhaBanco, $senha);
        if ($senhaOk) {
            $novoHash = password_hash($senha, PASSWORD_DEFAULT);
            $up = $conn->prepare("UPDATE usuarios SET senha = ? WHERE id = ?");
            $up->execute([$novoHash, (int) $usuario['id']]);
        }
    }

    if (!$senhaOk) {
        http_response_code(401);
        echo json_encode(['sucesso' => false, 'mensagem' => 'Email ou senha invalidos']);
        exit;
    }

    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Login realizado com sucesso',
        'usuario' => [
            'id' => (int) $usuario['id'],
            'email' => $usuario['email'],
            'tipo' => $usuario['tipo'],
            'nome' => $usuario['nome'],
            'telefone' => $usuario['telefone'],
            'cpf' => $usuario['cpf'],
        ],
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro ao processar login'
    ]);
}
?>
