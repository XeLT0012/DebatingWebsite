<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['username']) && !empty($data['email']) && !empty($data['password'])) {
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

    $sql = "INSERT INTO users (username, email, password) VALUES ('{$data['username']}', '{$data['email']}', '{$hashedPassword}')";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Registration successful"]);
    } else {
        echo json_encode(["error" => "User registration failed"]);
    }
} else {
    echo json_encode(["error" => "All fields are required"]);
}

$conn->close();
?>