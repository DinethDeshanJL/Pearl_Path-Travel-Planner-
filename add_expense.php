<?php
require_once 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$data = get_json_input();
$user_id = $data['user_id'] ?? null;
$name = $data['name'] ?? null;
$category = $data['category'] ?? null;
$amount = $data['amount'] ?? null;
$expense_date = $data['date'] ?? null;

if (!$user_id || !$name || !$category || !isset($amount) || !$expense_date) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields for saving expense']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO expenses (user_id, name, category, amount, expense_date) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$user_id, $name, $category, $amount, $expense_date]);
    
    echo json_encode(['success' => true, 'message' => 'Expense securely saved']);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save expense']);
}
?>
