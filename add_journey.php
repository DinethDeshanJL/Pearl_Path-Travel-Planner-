<?php
require_once 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$data = get_json_input();
$user_id = $data['user_id'] ?? null;
$destination = $data['destination'] ?? null;
$start_date = $data['start_date'] ?? null;
$end_date = $data['end_date'] ?? null;
$activities = $data['activities'] ?? '';

if (!$user_id || !$destination || !$start_date || !$end_date) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields for journey planning']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO journeys (user_id, destination, start_date, end_date, activities) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$user_id, $destination, $start_date, $end_date, $activities]);
    
    echo json_encode([
        'success' => true, 
        'message' => 'Journey added successfully',
        'journey_id' => $pdo->lastInsertId()
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save journey']);
}
?>
