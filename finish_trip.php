<?php
require_once 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$data = get_json_input();
$user_id = $data['user_id'] ?? null;
$title = $data['title'] ?? null;
$start = $data['start_date'] ?? null;
$end = $data['end_date'] ?? null;
$budget = $data['budget'] ?? null;
$spent = $data['spent'] ?? null;

if (!$user_id || !$title || !$start || !$end || !isset($budget) || !isset($spent)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing trip details required for saving history']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO completed_trips (user_id, title, start_date, end_date, budget, spent) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$user_id, $title, $start, $end, $budget, $spent]);
    
    echo json_encode(['success' => true, 'message' => 'Trip mapped to history archive']);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to log trip into history']);
}
?>
