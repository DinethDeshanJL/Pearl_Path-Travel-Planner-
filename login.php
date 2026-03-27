<?php
require_once 'db_config.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

$data = get_json_input();
$email = $data['email'] ?? null;

if (!$email) {
    http_response_code(400);
    echo json_encode(['error' => 'Email is required']);
    exit;
}

// Generate a fallback name from the email
$namePart = explode('@', $email)[0];
$name = ucfirst($namePart);

try {
    // Check if user exists
    $stmt = $pdo->prepare("SELECT id, email, name FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        // Log in returning user
        echo json_encode(['success' => true, 'message' => 'Login successful', 'user' => $user]);
    } else {
        // Automatically register new user 
        $insert = $pdo->prepare("INSERT INTO users (email, name) VALUES (?, ?)");
        $insert->execute([$email, $name]);
        $newUserId = $pdo->lastInsertId();
        
        $newUser = [
            'id' => $newUserId,
            'email' => $email,
            'name' => $name
        ];
        echo json_encode(['success' => true, 'message' => 'Registration successful', 'user' => $newUser]);
    }

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
}
?>
