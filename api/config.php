<?php
/**
 * Configuracao de banco de dados para InfinityFree
 * Usa secrets.local.php (nao versionado) como fonte principal.
 */

$secretsPath = __DIR__ . '/secrets.local.php';
$secrets = [];
if (file_exists($secretsPath)) {
    $carregado = require $secretsPath;
    if (is_array($carregado)) {
        $secrets = $carregado;
    }
}

$ambiente = $secrets['APP_ENV'] ?? 'production';
$debug = $ambiente !== 'production';

$host = $secrets['DB_HOST'] ?? 'sql208.infinityfree.com';
$port = (int) ($secrets['DB_PORT'] ?? 3306);
$usuario = $secrets['DB_USER'] ?? 'if0_41259736';
$senha = $secrets['DB_PASS'] ?? '';

$bancoPrincipal = $secrets['DB_NAME'] ?? 'if0_41259736_db_thamires';
$bancosCandidatos = array_values(array_unique([
    $bancoPrincipal,
    'if0_41259736_db_thamires',
    'f0_41259736_db_thamires'
]));

$corsPermitidas = $secrets['CORS_ALLOWED_ORIGINS'] ?? [
    'https://thamiresanacleto.42web.io',
    'https://www.thamiresanacleto.42web.io'
];

$charset = 'utf8mb4';
$conn = null;
$conexao_erro = null;

function enviarHeadersCors($permitidas) {
    $origem = $_SERVER['HTTP_ORIGIN'] ?? '';

    header('Content-Type: application/json; charset=utf-8');

    if ($origem && in_array($origem, $permitidas, true)) {
        header("Access-Control-Allow-Origin: {$origem}");
        header('Vary: Origin');
    }

    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}

if (php_sapi_name() !== 'cli') {
    enviarHeadersCors($corsPermitidas);

    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

$dsnCandidatos = [];
foreach ($bancosCandidatos as $banco) {
    $dsnCandidatos[] = "mysql:host=$host;port=$port;dbname=$banco;charset=$charset";
    $dsnCandidatos[] = "mysql:host=$host;dbname=$banco;charset=$charset";
}

foreach ($dsnCandidatos as $dsn) {
    try {
        $conn = new PDO($dsn, $usuario, $senha, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_TIMEOUT => 8,
        ]);
        $conexao_erro = null;
        break;
    } catch (PDOException $e) {
        $conexao_erro = $e->getMessage();
        $conn = null;
    }
}

if (!$conn) {
    http_response_code(500);
    $resposta = [
        'sucesso' => false,
        'mensagem' => 'Erro ao conectar ao banco de dados'
    ];

    if ($debug) {
        $resposta['erro'] = $conexao_erro;
    }

    echo json_encode($resposta);
    exit;
}

if (!function_exists('sanitizar')) {
    function sanitizar($valor) {
        return htmlspecialchars(strip_tags(trim((string) $valor)), ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('normalizarEmail')) {
    function normalizarEmail($email) {
        $limpo = trim(strtolower((string) $email));
        return filter_var($limpo, FILTER_VALIDATE_EMAIL) ? $limpo : null;
    }
}
?>
