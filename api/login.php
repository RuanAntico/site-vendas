<?php
/**
 * API de Login
 * POST /api/login.php
 */

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Método não permitido']);
    exit;
}

$dados = json_decode(file_get_contents('php://input'), true);

if (!isset($dados['email']) || !isset($dados['senha']) || !isset($dados['tipo'])) {
    http_response_code(400);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Dados incompletos']);
    exit;
}

$email = sanitizar($dados['email']);
$senha = $dados['senha'];
$tipo = sanitizar($dados['tipo']);

try {
    $sql = "SELECT * FROM usuarios WHERE email = ? AND tipo = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$email, $tipo]);
    
    $usuario = $stmt->fetch();
    
    if ($usuario && $senha === $usuario['senha']) {
        // Login bem-sucedido
        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Login realizado com sucesso!',
            'usuario' => [
                'id' => $usuario['id'],
                'email' => $usuario['email'],
                'tipo' => $usuario['tipo'],
                'nome' => $usuario['nome']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'Credenciais inválidas!'
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro ao processar login',
        'erro' => $e->getMessage()
    ]);
}

/**
 * Função para sanitizar entrada
 */
function sanitizar($valor) {
    return htmlspecialchars(strip_tags(trim($valor)), ENT_QUOTES, 'UTF-8');
}
?>
