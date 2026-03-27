<?php
// Secure PDO Database Connection configuration
$host = "localhost";
$dbname = "pearl_path";
$user = "root";       // Update with your actual MySQL username
$password = "";       // Update with your actual MySQL password

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    // Set PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Fetch objects automatically
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    die(json_encode(["error" => "Database connection failed", "details" => $e->getMessage()]));
}

// Helper to grab JSON body safely
function get_json_input() {
    return json_decode(file_get_contents('php://input'), true);
}
?>
