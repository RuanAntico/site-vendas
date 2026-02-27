<?php
/**
 * Configuração de Banco de Dados
 * Para InfinityFree
 */

// === DADOS DE CONEXÃO DO INFINITYFREE ===
// Substitua com os dados reais do seu servidor
$host = 'localhost';  // Geralmente 'localhost' para InfinityFree
$usuario = 'if0_41259736_user';  // Usuário do banco (ajuste conforme necessário)
$senha = '';  // Senha do banco (deixe vazio se não houver)
$banco = 'if0_41259736_db_thamires';  // Nome do banco

// Configurações gerais
$charset = 'utf8mb4';

try {
    // Criar conexão com PDO
    $dsn = "mysql:host=$host;dbname=$banco;charset=$charset";
    $conn = new PDO($dsn, $usuario, $senha, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    // Erro de conexão
    http_response_code(500);
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro ao conectar ao banco de dados',
        'erro' => $e->getMessage()
    ]);
    exit;
}

/**
 * Headers para requisições AJAX
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Tratamento de preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
?>
