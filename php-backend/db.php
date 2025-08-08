<?php
$servername = "localhost";
$username = "root"; 
$password = ""; // Password is empty by default in XAMPP
$dbname = "crud_app";

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed!"]));
}
?>
