<?php
require_once 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$data = get_json_input();
$user_id = $data['user_id'] ?? null;
$destination_name = $data['destination_name'] ?? null;

if (!$user_id || !$destination_name) {
    http_response_code(400);
    echo json_encode(['error' => 'Destination Name and User ID are required']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO explore_plans (user_id, destination_name) VALUES (?, ?)");
    $stmt->execute([$user_id, $destination_name]);
    
    echo json_encode(['success' => true, 'message' => 'Added to My Plan successfully']);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to add to Explore Plan']);
}
?>
