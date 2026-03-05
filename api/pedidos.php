<?php
/**
 * API de pedidos
 * GET /api/pedidos.php?email=cliente@email.com
 * POST /api/pedidos.php
 * PUT /api/pedidos.php
 */

require_once 'config.php';

$colCache = [];

function colunaExiste($conn, $tabela, $coluna) {
    static $cache = [];
    $chave = $tabela . '.' . $coluna;
    if (array_key_exists($chave, $cache)) {
        return $cache[$chave];
    }

    try {
        $stmt = $conn->prepare("SHOW COLUMNS FROM {$tabela} LIKE ?");
        $stmt->execute([$coluna]);
        $cache[$chave] = (bool) $stmt->fetch();
        return $cache[$chave];
    } catch (PDOException $e) {
        $cache[$chave] = false;
        return false;
    }
}

function colunasTabela($conn, $tabela) {
    try {
        $stmt = $conn->query("SHOW COLUMNS FROM {$tabela}");
        $cols = [];
        foreach ($stmt->fetchAll() as $row) {
            if (!empty($row['Field'])) {
                $cols[] = $row['Field'];
            }
        }
        return $cols;
    } catch (PDOException $e) {
        return [];
    }
}

function buscarDadosPessoa($conn, $pedido) {
    $tipo = $pedido['pessoa_tipo'] ?? null;
    $refId = isset($pedido['pessoa_ref_id']) ? (int) $pedido['pessoa_ref_id'] : 0;

    if ($tipo === 'fisica' && $refId > 0) {
        $stmt = $conn->prepare("SELECT * FROM pessoas_fisicas WHERE id = ? LIMIT 1");
        $stmt->execute([$refId]);
        return $stmt->fetch() ?: null;
    }

    if ($tipo === 'juridica' && $refId > 0) {
        $stmt = $conn->prepare("SELECT * FROM pessoas_juridicas WHERE id = ? LIMIT 1");
        $stmt->execute([$refId]);
        return $stmt->fetch() ?: null;
    }

    return null;
}

function extrairRefDeObservacoes($obs) {
    if (!is_string($obs)) return [null, 0];
    if (preg_match('/REF\\:(fisica|juridica)\\:(\\d+)/', $obs, $m)) {
        return [$m[1], (int) $m[2]];
    }
    return [null, 0];
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $temPessoaTipo = colunaExiste($conn, 'pedidos', 'pessoa_tipo');
        $temPessoaRef = colunaExiste($conn, 'pedidos', 'pessoa_ref_id');

        $selectPessoaTipo = $temPessoaTipo ? 'pessoa_tipo' : 'NULL AS pessoa_tipo';
        $selectPessoaRef = $temPessoaRef ? 'pessoa_ref_id' : 'NULL AS pessoa_ref_id';

        if (!empty($_GET['email'])) {
            $email = sanitizar($_GET['email']);
            $sql = "SELECT id, email AS cliente_email, cliente_nome, produto AS nome_produto, categoria, quantidade, preco_unitario, valor_total, observacoes, data AS data_pedido, status, {$selectPessoaTipo}, {$selectPessoaRef} FROM pedidos WHERE email = ? ORDER BY id DESC";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$email]);
        } else {
            $sql = "SELECT id, email AS cliente_email, cliente_nome, produto AS nome_produto, categoria, quantidade, preco_unitario, valor_total, observacoes, data AS data_pedido, status, {$selectPessoaTipo}, {$selectPessoaRef} FROM pedidos ORDER BY id DESC";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
        }

        $pedidos = $stmt->fetchAll();

        foreach ($pedidos as &$pedido) {
            if (empty($pedido['pessoa_tipo']) || empty($pedido['pessoa_ref_id'])) {
                [$tipoObs, $refObs] = extrairRefDeObservacoes($pedido['observacoes'] ?? '');
                if ($tipoObs && $refObs > 0) {
                    $pedido['pessoa_tipo'] = $tipoObs;
                    $pedido['pessoa_ref_id'] = $refObs;
                }
            }
            $pedido['dados_pessoa'] = buscarDadosPessoa($conn, $pedido);
        }

        echo json_encode(['sucesso' => true, 'dados' => $pedidos]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao listar pedidos', 'erro' => $e->getMessage()]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dados = json_decode(file_get_contents('php://input'), true);

    if (!$dados || empty($dados['email']) || empty($dados['produto']) || empty($dados['cliente_nome'])) {
        http_response_code(400);
        echo json_encode(['sucesso' => false, 'mensagem' => 'Dados incompletos do pedido']);
        exit;
    }

    $email = sanitizar($dados['email']);
    $clienteNome = sanitizar($dados['cliente_nome']);
    $produto = sanitizar($dados['produto']);
    $categoria = isset($dados['categoria']) ? sanitizar($dados['categoria']) : null;
    $quantidade = isset($dados['quantidade']) ? (int) $dados['quantidade'] : 0;
    $precoUnitario = isset($dados['preco_unitario']) ? (float) $dados['preco_unitario'] : 0;
    $valorTotal = isset($dados['valor_total']) ? (float) $dados['valor_total'] : ($quantidade * $precoUnitario);
    $observacoes = isset($dados['observacoes']) ? sanitizar($dados['observacoes']) : null;
    $status = isset($dados['status']) && $dados['status'] !== '' ? sanitizar($dados['status']) : 'Pendente';
    $pessoaTipo = isset($dados['pessoa_tipo']) ? sanitizar($dados['pessoa_tipo']) : null;
    $pessoaRefId = isset($dados['pessoa_ref_id']) ? (int) $dados['pessoa_ref_id'] : null;

    try {
        $temPessoaTipo = colunaExiste($conn, 'pedidos', 'pessoa_tipo');
        $temPessoaRef = colunaExiste($conn, 'pedidos', 'pessoa_ref_id');

        if ($temPessoaTipo && $temPessoaRef) {
            $sql = "INSERT INTO pedidos (email, cliente_nome, produto, categoria, quantidade, preco_unitario, valor_total, observacoes, data, status, pessoa_tipo, pessoa_ref_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$email, $clienteNome, $produto, $categoria, $quantidade, $precoUnitario, $valorTotal, $observacoes, $status, $pessoaTipo, $pessoaRefId]);
        } else {
            $obsComRef = $observacoes;
            if ($pessoaTipo && $pessoaRefId) {
                $tag = "REF:{$pessoaTipo}:{$pessoaRefId}";
                $obsComRef = $obsComRef ? ($obsComRef . " | " . $tag) : $tag;
            }
            $sql = "INSERT INTO pedidos (email, cliente_nome, produto, categoria, quantidade, preco_unitario, valor_total, observacoes, data, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$email, $clienteNome, $produto, $categoria, $quantidade, $precoUnitario, $valorTotal, $obsComRef, $status]);
        }

        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Pedido criado com sucesso',
            'id' => (int) $conn->lastInsertId(),
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao criar pedido', 'erro' => $e->getMessage()]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $dados = json_decode(file_get_contents('php://input'), true);

    if (!$dados || empty($dados['id']) || !isset($dados['pedido'])) {
        http_response_code(400);
        echo json_encode(['sucesso' => false, 'mensagem' => 'Dados invalidos para atualizacao']);
        exit;
    }

    $pedidoId = (int) $dados['id'];
    $pedidoData = is_array($dados['pedido']) ? $dados['pedido'] : [];
    $dadosPessoa = isset($dados['dados_pessoa']) && is_array($dados['dados_pessoa']) ? $dados['dados_pessoa'] : [];

    try {
        $conn->beginTransaction();

        $temPessoaTipo = colunaExiste($conn, 'pedidos', 'pessoa_tipo');
        $temPessoaRef = colunaExiste($conn, 'pedidos', 'pessoa_ref_id');
        $selectTipo = $temPessoaTipo ? 'pessoa_tipo' : 'NULL AS pessoa_tipo';
        $selectRef = $temPessoaRef ? 'pessoa_ref_id' : 'NULL AS pessoa_ref_id';
        $stmtAtual = $conn->prepare("SELECT id, categoria, observacoes, {$selectTipo}, {$selectRef} FROM pedidos WHERE id = ? LIMIT 1");
        $stmtAtual->execute([$pedidoId]);
        $pedidoAtual = $stmtAtual->fetch();
        if (!$pedidoAtual) {
            $conn->rollBack();
            http_response_code(404);
            echo json_encode(['sucesso' => false, 'mensagem' => 'Pedido nao encontrado']);
            exit;
        }

        $camposPermitidos = [
            'cliente_nome', 'produto', 'categoria', 'quantidade', 'preco_unitario', 'valor_total', 'observacoes', 'status'
        ];

        $sets = [];
        $params = [];
        foreach ($camposPermitidos as $campo) {
            if (array_key_exists($campo, $pedidoData)) {
                $sets[] = "{$campo} = ?";
                $params[] = $pedidoData[$campo];
            }
        }

        if (!empty($sets)) {
            $params[] = $pedidoId;
            $sqlUpdatePedido = "UPDATE pedidos SET " . implode(', ', $sets) . " WHERE id = ?";
            $stmtUpdatePedido = $conn->prepare($sqlUpdatePedido);
            $stmtUpdatePedido->execute($params);
        }

        $tipoPessoa = $pedidoAtual['pessoa_tipo'] ?? null;
        $refPessoa = isset($pedidoAtual['pessoa_ref_id']) ? (int) $pedidoAtual['pessoa_ref_id'] : 0;
        if ((!$tipoPessoa || $refPessoa <= 0) && isset($pedidoAtual['observacoes'])) {
            [$tipoObs, $refObs] = extrairRefDeObservacoes($pedidoAtual['observacoes']);
            if ($tipoObs && $refObs > 0) {
                $tipoPessoa = $tipoObs;
                $refPessoa = $refObs;
            }
        }

        if (!empty($dadosPessoa) && $tipoPessoa && $refPessoa > 0) {
            if ($tipoPessoa === 'fisica') {
                $permitidosPF = array_diff(colunasTabela($conn, 'pessoas_fisicas'), ['id', 'created_at', 'data_registro', 'ip_origem', 'navegador']);
                $setsPF = [];
                $paramsPF = [];
                foreach ($dadosPessoa as $campo => $valor) {
                    if (in_array($campo, $permitidosPF, true)) {
                        $setsPF[] = "{$campo} = ?";
                        $paramsPF[] = $valor;
                    }
                }
                if (!empty($setsPF)) {
                    $paramsPF[] = $refPessoa;
                    $stmtPF = $conn->prepare("UPDATE pessoas_fisicas SET " . implode(', ', $setsPF) . " WHERE id = ?");
                    $stmtPF->execute($paramsPF);
                }
            }

            if ($tipoPessoa === 'juridica') {
                $permitidosPJ = array_diff(colunasTabela($conn, 'pessoas_juridicas'), ['id', 'created_at', 'data_registro', 'ip_origem', 'navegador']);
                $setsPJ = [];
                $paramsPJ = [];
                foreach ($dadosPessoa as $campo => $valor) {
                    if (in_array($campo, $permitidosPJ, true)) {
                        $setsPJ[] = "{$campo} = ?";
                        $paramsPJ[] = $valor;
                    }
                }
                if (!empty($setsPJ)) {
                    $paramsPJ[] = $refPessoa;
                    $stmtPJ = $conn->prepare("UPDATE pessoas_juridicas SET " . implode(', ', $setsPJ) . " WHERE id = ?");
                    $stmtPJ->execute($paramsPJ);
                }
            }
        }

        $conn->commit();
        echo json_encode(['sucesso' => true, 'mensagem' => 'Pedido atualizado com sucesso']);
    } catch (PDOException $e) {
        if ($conn->inTransaction()) {
            $conn->rollBack();
        }
        http_response_code(500);
        echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao atualizar pedido', 'erro' => $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['sucesso' => false, 'mensagem' => 'Metodo nao permitido']);
?>
