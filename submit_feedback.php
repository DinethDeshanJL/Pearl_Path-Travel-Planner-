<?php
require_once 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$data = get_json_input();
$user_id = $data['user_id'] ?? null;
$rating = $data['rating'] ?? null;
$comments = $data['comments'] ?? '';

if (!$user_id || !$rating) {
    http_response_code(400);
    echo json_encode(['error' => 'Rating and User ID are required']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO feedback (user_id, rating, comments) VALUES (?, ?, ?)");
    $stmt->execute([$user_id, $rating, $comments]);
    
    echo json_encode(['success' => true, 'message' => 'Feedback submitted successfully']);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save feedback']);
}
?>
