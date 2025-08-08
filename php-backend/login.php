<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['username']) && !empty($data['password'])) {
    $sql = "SELECT * FROM users WHERE username='{$data['username']}'";
    $result = $conn->query($sql);

    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();
        if (password_verify($data['password'], $user['password'])) {
            $_SESSION['user'] = $user['username'];
            echo json_encode(["message" => "Login successful", "redirect" => "hello.php"]);
        } else {
            echo json_encode(["error" => "Invalid password"]);
        }
    } else {
        echo json_encode(["error" => "User not found"]);
    }
} else {
    echo json_encode(["error" => "Username and password required"]);
}

$conn->close();
?>