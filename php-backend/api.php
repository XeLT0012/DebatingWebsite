<?php
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:4200");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    http_response_code(200);
    exit();
}

header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}


include 'db.php';

$action = $_GET['action'] ?? '';

// Debug logs for tracking requests
file_put_contents("debug_log.txt", "Action: $action\n", FILE_APPEND);

// ✅ Send Confirmation Email Using PHPMailer
    require '../vendor/autoload.php';
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

// 🔹 Register User
if ($action == "register") {
    $data = $_POST;

    file_put_contents("debug_log_1.txt", "Received Data: " . json_encode($data) . "\n", FILE_APPEND);

    $username = $data['username'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    $fullName = $data['fullName'] ?? null;
    $bio = $data['bio'] ?? null;
    $dateOfBirth = $data['dateOfBirth'] ?? null;
    $location = $data['location'] ?? null;

    if (!empty($username) && !empty($email) && !empty($password)) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $profilePicturePath = null;

        if (isset($_FILES['profile_picture']) && $_FILES['profile_picture']['error'] === UPLOAD_ERR_OK) {
        $targetDir = __DIR__ . "/../uploads/profile_pictures/";

            if (!is_dir($targetDir)) {
                mkdir($targetDir, 0777, true);
            }

            $imageName = uniqid() . "." . pathinfo($_FILES['profile_picture']['name'], PATHINFO_EXTENSION);
            $imagePath = $targetDir . $imageName;

            if (move_uploaded_file($_FILES['profile_picture']['tmp_name'], $imagePath)) {
                // Adjust the path stored in the database to be relative to the project root
                $profilePicturePath = "uploads/profile_pictures/" . $imageName;
                file_put_contents("debug_log.txt", "Profile Picture Stored at: " . $imagePath . "\n", FILE_APPEND);
            } else {
                file_put_contents("debug_log.txt", "Failed to Move Uploaded File.\n", FILE_APPEND);
                echo json_encode(["error" => "File upload failed"]);
                exit;
            }
        }

        $stmt = $conn->prepare("INSERT INTO users (username, email, password, full_name, bio, profile_picture, date_of_birth, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssssss", 
            $username, 
            $email, 
            $hashedPassword, 
            $fullName, 
            $bio, 
            $profilePicturePath, 
            $dateOfBirth, 
            $location
        );

        if ($stmt->execute()) {
    file_put_contents("debug_log.txt", "Registration success for: {$username}\n", FILE_APPEND);

    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; // Replace with your SMTP server
        $mail->SMTPAuth = true;
        $mail->Username = 'chakrabortysmit0012@gmail.com'; // Replace with your email
        $mail->Password = 'juvkkvnztsuntzht';   // Use App Password if using Gmail
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Recipients
        $mail->setFrom('your-email@gmail.com', 'Your App Name');
        $mail->addAddress($email, $username);

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Welcome to Our Platform!';
        $mail->Body    = "Hi <strong>$username</strong>,<br><br>Thanks for registering with us!<br><br>Cheers,<br>Team";

        $mail->send();
        file_put_contents("debug_log.txt", "Confirmation email sent to: {$email}\n", FILE_APPEND);
    } catch (Exception $e) {
        file_put_contents("debug_log.txt", "Email failed: {$mail->ErrorInfo}\n", FILE_APPEND);
    }

    echo json_encode(["message" => "Registration successful"]);
    } else {
            echo json_encode(["error" => "User registration failed"]);
        }

        $stmt->close();
    } else {
        echo json_encode(["error" => "All required fields must be filled"]);
    }
}

// 🔹 Login User
elseif ($action == "login") {
    $data = json_decode(file_get_contents("php://input"), true);

    // ✅ Define admin credentials
    $adminUsername = "admin";
    $adminPassword = "admin123";

    // ✅ Check if user is an admin
    if (!empty($data['username']) && !empty($data['password'])) {
        if ($data['username'] === $adminUsername && $data['password'] === $adminPassword) {
            $_SESSION['user_id'] = "admin"; // ✅ Store admin identifier in session
            $_SESSION['user'] = "admin";

            echo json_encode([
                "message" => "Admin login successful",
                "user" => ["id" => "admin", "username" => "admin"],
                "redirect" => "admin" // ✅ Redirect to Admin Component
            ]);
            exit;
        }

        // ✅ Check database for normal users
        $sql = "SELECT id, username, password, is_blocked FROM users WHERE username=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $data['username']);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows == 1) {
            $user = $result->fetch_assoc();

            if ($user['is_blocked']) {
                echo json_encode(["error" => "Your account has been blocked"]);
                exit;
            }

            // ✅ Verify hashed password
            if (password_verify($data['password'], $user['password'])) {
                $_SESSION['user_id'] = $user['id']; // ✅ Store user ID in session
                $_SESSION['user'] = $user['username']; // ✅ Store username in session

                // ✅ Debug log for session tracking
                file_put_contents("debug_log.txt", "Session after login: " . print_r($_SESSION, true) . "\n", FILE_APPEND);

                echo json_encode([
                    "message" => "Login successful",
                    "user" => ["id" => $user['id'], "username" => $user['username']],
                    "redirect" => "hello" // ✅ Redirect normal users to Hello Component
                ]);
            } else {
                echo json_encode(["error" => "Invalid password"]);
            }
        } else {
            echo json_encode(["error" => "User not found"]);
        }
    } else {
        echo json_encode(["error" => "Username and password required"]);
    }
}


// 🔹 Logout User
elseif ($action == "logout") {
    session_destroy();
    file_put_contents("debug_log.txt", "User logged out\n", FILE_APPEND);
    echo json_encode(["message" => "Logged out successfully"]);
}

// 🔹 Get User Session (Check if User is Logged In)
elseif ($action == "getUserSession") {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    header("Content-Type: application/json");

    file_put_contents("debug_log.txt", "Session check: " . print_r($_SESSION, true) . "\n", FILE_APPEND);

    if (!empty($_SESSION['user'])) {
        echo json_encode(["user" => $_SESSION['user']]);
    } else {
        echo json_encode(["error" => "No active session"]);
    }
}

// ✅ Auto-update debate state & result based on votes
function updateDebateResults($conn) {
    // ✅ First, update debate state based on deadline
    $stmt = $conn->prepare("
        UPDATE debates 
        SET state = 
        CASE 
            WHEN deadline < NOW() THEN 'Finished'
            ELSE 'Ongoing'
        END
    ");
    $stmt->execute();
    $stmt->close();

    // ✅ Now, calculate results for finished debates
    $stmt = $conn->prepare("
        UPDATE debates 
        SET result = 
        CASE 
            WHEN (SELECT COUNT(*) FROM debate_votes WHERE debate_id=debates.id AND side='For') > 
                 (SELECT COUNT(*) FROM debate_votes WHERE debate_id=debates.id AND side='Against') THEN 'For'
            WHEN (SELECT COUNT(*) FROM debate_votes WHERE debate_id=debates.id AND side='Against') > 
                 (SELECT COUNT(*) FROM debate_votes WHERE debate_id=debates.id AND side='For') THEN 'Against'
            ELSE 'Tie'
        END
        WHERE state = 'Finished' AND result = 'Pending'
    ");
    $stmt->execute();
    $stmt->close();
}

// ✅ Update debate states before executing actions
updateDebateResults($conn);


if ($action == "createDebate") {
    $data = json_decode(file_get_contents("php://input"), true);

    // ✅ Debugging Log
    error_log("Received debate data: " . json_encode($data));

    // ✅ Validate required fields
    if (empty($data['title']) || empty($data['description']) || empty($data['created_by']) || empty($data['deadline']) || empty($data['category']) || empty($data['debate_type'])) {
        echo json_encode(["error" => "All fields including title, description, category, debate type, and deadline are required"]);
        exit;
    }

    // ✅ Validate ENUM values before inserting
    $allowedTypes = ['Public', 'Private'];
    if (!in_array($data['debate_type'], $allowedTypes, true)) {
        echo json_encode(["error" => "Invalid debate type. Allowed values: Public or Private"]);
        exit;
    }

    // ✅ Ensure deadline is properly formatted
    $deadline = date('Y-m-d H:i:s', strtotime($data['deadline']));
    if (!$deadline || strtotime($deadline) <= time()) {
        echo json_encode(["error" => "Invalid or past deadline"]);
        exit;
    }

    // ✅ Check if a debate with the same title already exists
    $duplicateCheck = $conn->prepare("SELECT COUNT(*) FROM debates WHERE title = ? AND created_by = ?");
    $duplicateCheck->bind_param("si", $data['title'], $data['created_by']);
    $duplicateCheck->execute();
    $duplicateCheck->bind_result($existingDebates);
    $duplicateCheck->fetch();
    $duplicateCheck->close();

    if ($existingDebates > 0) {
        echo json_encode(["error" => "Duplicate debate title found. Try a different title."]);
        exit;
    }


    // ✅ Insert debate with default `"Ongoing"` state
    $stmt = $conn->prepare("INSERT INTO debates (title, description, created_by, category, debate_type, deadline, state) VALUES (?, ?, ?, ?, ?, ?, 'Ongoing')");
    $stmt->bind_param("ssisss", $data['title'], $data['description'], $data['created_by'], $data['category'], $data['debate_type'], $deadline);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Debate created successfully"]);
    } else {
        echo json_encode(["error" => "Failed to create debate"]);
    }

    $stmt->close();
}

elseif ($action == "listDebates") {
    header("Content-Type: application/json");

    $searchQuery = isset($_GET['search']) ? $_GET['search'] : "";
    $sql = "SELECT debates.*, users.username FROM debates JOIN users ON debates.created_by = users.id";

    if (!empty($searchQuery)) {
        $sql .= " WHERE title LIKE '%" . $conn->real_escape_string($searchQuery) . "%'";
    }

    $result = $conn->query($sql);

    $debates = [];
    while ($row = $result->fetch_assoc()) {
        $debates[] = $row;
    }

    echo json_encode($debates);
}

elseif ($action == "getDebateDetails") {
    $debateId = $_GET['debate_id'];

    $stmt = $conn->prepare("SELECT * FROM debates WHERE id=?");
    $stmt->bind_param("i", $debateId);
    $stmt->execute();
    $result = $stmt->get_result();
    $debate = $result->fetch_assoc();

    echo json_encode($debate);
}

elseif ($action == "voteDebate") {
    $data = json_decode(file_get_contents("php://input"), true);

    error_log("Received vote request: " . json_encode($data)); // ✅ Debugging log

    if (!empty($data['debate_id']) && !empty($data['user_id']) && !empty($data['side'])) {
        // ✅ Validate user
        $userCheck = $conn->prepare("SELECT id FROM users WHERE id = ?");
        $userCheck->bind_param("i", $data['user_id']);
        $userCheck->execute();
        $userCheck->store_result();

        if ($userCheck->num_rows === 0) {
            error_log("Invalid User ID: " . $data['user_id']);
            echo json_encode(["error" => "Invalid user ID"]);
            exit();
        }

        // ✅ Validate debate
        $debateCheck = $conn->prepare("SELECT state FROM debates WHERE id = ?");
        $debateCheck->bind_param("i", $data['debate_id']);
        $debateCheck->execute();
        $result = $debateCheck->get_result();
        $debate = $result->fetch_assoc();

        if (!$debate) {
            error_log("Invalid Debate ID: " . $data['debate_id']);
            echo json_encode(["error" => "Invalid debate ID"]);
            exit();
        }

        // ✅ Prevent voting if debate is finished
        if ($debate['state'] === 'Finished') {
            echo json_encode(["error" => "Voting is closed for this debate"]);
            exit();
        }

        // ✅ Check if user already voted for the same side
        $voteCheck = $conn->prepare("SELECT COUNT(*) FROM debate_votes WHERE debate_id = ? AND user_id = ? AND side = ?");
        $voteCheck->bind_param("iis", $data['debate_id'], $data['user_id'], $data['side']);
        $voteCheck->execute();
        $voteCheck->bind_result($voteCount);
        $voteCheck->fetch();
        $voteCheck->close();

        if ($voteCount > 0) {
            echo json_encode(["error" => "You have already voted for this side"]);
            exit();
        }

        // ✅ Remove previous vote if switching sides
        $removePreviousVote = $conn->prepare("DELETE FROM debate_votes WHERE debate_id = ? AND user_id = ?");
        $removePreviousVote->bind_param("ii", $data['debate_id'], $data['user_id']);
        $removePreviousVote->execute();
        $removePreviousVote->close();

        // ✅ Insert new vote
        $stmt = $conn->prepare("INSERT INTO debate_votes (debate_id, user_id, side) VALUES (?, ?, ?)");
        $stmt->bind_param("iis", $data['debate_id'], $data['user_id'], $data['side']);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Vote registered successfully"]);
        } else {
            error_log("Database error while voting: " . $stmt->error);
            echo json_encode(["error" => "Failed to vote"]);
        }

        $stmt->close();
        $userCheck->close();
        $debateCheck->close();
    } else {
        error_log("Debugging: Missing required fields - " . json_encode($data));
        echo json_encode(["error" => "Debate ID, user ID, and vote side required"]);
    }
}

// Submit an argument
elseif ($action == "submitArgument") {
    $data = json_decode(file_get_contents("php://input"), true);

    error_log("Received argument data: " . json_encode($data)); // ✅ Debugging log

    if (!empty($data['debate_id']) && !empty($data['user_id']) && !empty($data['argument'])) {
        // ✅ Validate user
        $userCheck = $conn->prepare("SELECT id FROM users WHERE id = ?");
        $userCheck->bind_param("i", $data['user_id']);
        $userCheck->execute();
        $userCheck->store_result();

        if ($userCheck->num_rows === 0) {
            error_log("Invalid User ID: " . $data['user_id']); // ✅ Debug invalid ID
            echo json_encode(["error" => "Invalid user ID"]);
            exit();
        }

        // ✅ Insert argument with correct `user_id`
        $stmt = $conn->prepare("INSERT INTO debate_arguments (debate_id, user_id, argument) VALUES (?, ?, ?)");
        $stmt->bind_param("iis", $data['debate_id'], $data['user_id'], $data['argument']);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Argument submitted successfully"]);
        } else {
            error_log("Database error while submitting argument: " . $stmt->error); // ✅ Log DB error
            echo json_encode(["error" => "Failed to submit argument"]);
        }

        $stmt->close();
        $userCheck->close();
    } else {
        error_log("Debugging: Missing required fields - " . json_encode($data)); // ✅ Log missing fields
        echo json_encode(["error" => "Debate ID, user ID, and argument text required"]);
    }
}

// Fetch vote counts for a debate
elseif ($action == "listVotes") {
    $debate_id = $_GET['debate_id'];

    $resultFor = $conn->query("SELECT COUNT(*) AS total FROM debate_votes WHERE debate_id = $debate_id AND side = 'For'");
    $resultAgainst = $conn->query("SELECT COUNT(*) AS total FROM debate_votes WHERE debate_id = $debate_id AND side = 'Against'");

    echo json_encode([
        "for" => $resultFor->fetch_assoc()['total'],
        "against" => $resultAgainst->fetch_assoc()['total']
    ]);
}

// Fetch all arguments for a debate
elseif ($action == "listArguments") {
    $debateId = $_GET['debate_id'];

    $stmt = $conn->prepare("
        SELECT da.argument, u.username 
        FROM debate_arguments da 
        JOIN users u ON da.user_id = u.id 
        WHERE da.debate_id = ?
    ");
    $stmt->bind_param("i", $debateId);
    $stmt->execute();
    $result = $stmt->get_result();

    $arguments = [];
    while ($row = $result->fetch_assoc()) {
        $arguments[] = $row;
    }

    echo json_encode($arguments);
    $stmt->close();
}

//Display profile details
elseif ($action == "profile") {
    // Set header to return JSON
    header('Content-Type: application/json');

    // Get user ID from session
    $userId = $_SESSION['user_id'] ?? null;

    if (!$userId) {
        echo json_encode(["error" => "User not logged in"]);
        exit;
    }

    // Query the database (excluding password for security)
    $query = "SELECT username, email, full_name, bio, date_of_birth, location, profile_picture FROM users WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $userData = $result->fetch_assoc();

    if ($userData) {
        // Append the base URL to the profile picture path
        $baseUrl = "http://localhost/crud-app/";
        if (!empty($userData['profile_picture'])) {
            $userData['profile_picture'] = $baseUrl . $userData['profile_picture'];
        }
        echo json_encode($userData); // ✅ Ensure valid JSON output
    } else {
        echo json_encode(["error" => "User not found"]);
    }
}

//Editing the profile details
elseif ($action == "updateProfile") {
    header('Content-Type: application/json');

    $userId = $_SESSION['user_id'] ?? null;
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$userId || empty($data)) {
        echo json_encode(["error" => "Invalid request"]);
        exit;
    }

    // Update user profile (excluding password)
    $query = "UPDATE users SET username=?, email=?, full_name=?, bio=?, date_of_birth=?, location=? WHERE id=?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ssssssi", $data['username'], $data['email'], $data['full_name'], $data['bio'], $data['date_of_birth'], $data['location'], $userId);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["message" => "Profile updated successfully", "user" => $data]);
    } else {
        echo json_encode(["error" => "No rows affected—check database or input data"]);
    }

    // Debugging SQL errors
    if ($stmt->error) {
        file_put_contents("debug_log.txt", "SQL Error: " . $stmt->error . "\n", FILE_APPEND);
    }

    $stmt->close();
}

//Changing password
elseif ($action == "changePassword") {
    header('Content-Type: application/json');

    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['username']) || empty($data['current_password']) || empty($data['new_password'])) {
        echo json_encode(["error" => "Invalid request"]);
        exit;
    }

    // Fetch current password from the database using username
    $query = "SELECT id, password FROM users WHERE username=?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $data['username']);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if (!$user || !password_verify($data['current_password'], $user['password'])) {
        echo json_encode(["error" => "Incorrect current password"]);
        exit;
    }

    // Hash the new password
    $hashedPassword = password_hash($data['new_password'], PASSWORD_DEFAULT);

    // Update password in the database
    $updateQuery = "UPDATE users SET password=? WHERE id=?";
    $updateStmt = $conn->prepare($updateQuery);
    $updateStmt->bind_param("si", $hashedPassword, $user['id']);
    $updateStmt->execute();

    if ($updateStmt->affected_rows > 0) {
        echo json_encode(["message" => "Password updated successfully"]);
    } else {
        echo json_encode(["error" => "Failed to update password"]);
    }
}

// Displaying debates created by me (with optional search)
elseif ($action == "listMyDebates") {
    $userId = $_GET['user_id'];
    $search = isset($_GET['search']) ? '%' . $_GET['search'] . '%' : null;

    if ($search) {
        $stmt = $conn->prepare("
            SELECT d.*, 
                (SELECT COUNT(*) FROM debate_votes WHERE debate_id = d.id AND side = 'For') AS votes_for,
                (SELECT COUNT(*) FROM debate_votes WHERE debate_id = d.id AND side = 'Against') AS votes_against,
                (SELECT COUNT(*) FROM debate_arguments WHERE debate_id = d.id) AS argument_count
            FROM debates d 
            WHERE d.created_by = ? 
              AND (d.title LIKE ? OR d.description LIKE ? OR d.category LIKE ?)
        ");
        $stmt->bind_param("isss", $userId, $search, $search, $search);
    } else {
        $stmt = $conn->prepare("
            SELECT d.*, 
                (SELECT COUNT(*) FROM debate_votes WHERE debate_id = d.id AND side = 'For') AS votes_for,
                (SELECT COUNT(*) FROM debate_votes WHERE debate_id = d.id AND side = 'Against') AS votes_against,
                (SELECT COUNT(*) FROM debate_arguments WHERE debate_id = d.id) AS argument_count
            FROM debates d 
            WHERE d.created_by = ?
        ");
        $stmt->bind_param("i", $userId);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $debates = [];
    while ($row = $result->fetch_assoc()) {
        $debates[] = $row;
    }

    echo json_encode($debates);
    $stmt->close();
}


// ✅ Fetching debates the user participated in
elseif ($action == "listParticipatedDebates") {
    $userId = $_GET['user_id'];

    $stmt = $conn->prepare("
        SELECT d.*, u.username AS creator_name, 
            (SELECT COUNT(*) FROM debate_votes WHERE debate_id = d.id AND user_id = ?) AS user_vote_count,
            (SELECT side FROM debate_votes WHERE debate_id = d.id AND user_id = ?) AS user_vote,
            (SELECT COUNT(*) FROM debate_arguments WHERE debate_id = d.id AND user_id = ?) AS user_argument_count,
            (SELECT argument FROM debate_arguments WHERE debate_id = d.id AND user_id = ? LIMIT 1) AS user_argument
        FROM debates d
        JOIN users u ON d.created_by = u.id
        WHERE d.id IN (
            SELECT DISTINCT debate_id FROM debate_votes WHERE user_id = ?
            UNION 
            SELECT DISTINCT debate_id FROM debate_arguments WHERE user_id = ?
        )
    ");
    $stmt->bind_param("iiiiii", $userId, $userId, $userId, $userId, $userId, $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    $debates = [];
    while ($row = $result->fetch_assoc()) {
        $debates[] = $row;
    }

    echo json_encode($debates);
    $stmt->close();
}

elseif ($action == "getPlatformStats") {
    $stmt = $conn->prepare("
        SELECT 
            (SELECT COUNT(*) FROM debates) AS totalDebates,
            (SELECT COUNT(*) FROM users) AS totalUsers
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    $stats = $result->fetch_assoc();

    echo json_encode($stats);
    $stmt->close();
}

// ✅ Leaderboard - Top Users by Participation
elseif ($action == "getLeaderboard") {
    $stmt = $conn->prepare("
        SELECT u.username, COUNT(DISTINCT dv.debate_id) AS debatesParticipated
        FROM users u
        JOIN debate_votes dv ON u.id = dv.user_id
        GROUP BY u.username
        ORDER BY debatesParticipated DESC
        LIMIT 5
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    $leaderboard = [];
    while ($row = $result->fetch_assoc()) {
        $leaderboard[] = $row;
    }
    echo json_encode($leaderboard);
}

// ✅ Most Controversial Debates (Highest Votes + Arguments)
elseif ($action == "getMostControversialDebates") {
    $stmt = $conn->prepare("
        SELECT d.title, (SELECT COUNT(*) FROM debate_votes WHERE debate_id = d.id) +
            (SELECT COUNT(*) FROM debate_arguments WHERE debate_id = d.id) AS totalVotes
        FROM debates d
        ORDER BY totalVotes DESC
        LIMIT 5
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    $debates = [];
    while ($row = $result->fetch_assoc()) {
        $debates[] = $row;
    }
    echo json_encode($debates);
}

// ✅ Popular Debate Topics (Most Debates Per Category)
elseif ($action == "getPopularTopics") {
    $stmt = $conn->prepare("
        SELECT category AS name, COUNT(*) AS debateCount
        FROM debates
        GROUP BY category
        ORDER BY debateCount DESC
        LIMIT 5
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    $topics = [];
    while ($row = $result->fetch_assoc()) {
        $topics[] = $row;
    }
    echo json_encode($topics);
}

// ✅ Recent Activity (Last User Actions in Debates)
elseif ($action == "getRecentActivity") {
    $stmt = $conn->prepare("
        SELECT u.username, 'voted' AS action, d.title AS debateTitle
        FROM debate_votes dv
        JOIN users u ON dv.user_id = u.id
        JOIN debates d ON dv.debate_id = d.id
        ORDER BY dv.vote_date DESC
        LIMIT 5
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    $activity = [];
    while ($row = $result->fetch_assoc()) {
        $activity[] = $row;
    }
    echo json_encode($activity);
}

elseif ($action == "submitFeedback") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['subject']) || empty(trim($data['description']))) { // ✅ Prevent blank feedback
        echo json_encode(["error" => "Feedback cannot be empty"]);
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO feedback (user_id, subject, description) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $data['user_id'], $data['subject'], $data['description']);
    $stmt->execute();

    echo json_encode(["message" => "Feedback submitted successfully"]);
}

elseif ($action == "getDebateArguments") {
    if (isset($_GET['debate_id'])) {
        $debate_id = intval($_GET['debate_id']); // sanitize input

        $result = $conn->query("
            SELECT da.id, u.username, da.argument, da.created_at 
            FROM debate_arguments da
            JOIN users u ON da.user_id = u.id
            WHERE da.debate_id = $debate_id AND da.is_archived = 0
        ");

        echo json_encode($result->fetch_all(MYSQLI_ASSOC));
    } else {
        echo json_encode(["error" => "Missing debate_id parameter"]);
    }
}


//ADMIN *****************************************************************************************************************************

// ✅ Fetch all users
elseif ($action == "getAllUsers") {
    $stmt = $conn->prepare("
        SELECT id, username, email, full_name, bio, date_of_birth, location, is_blocked 
        FROM users ORDER BY created_at DESC
    ");
    $stmt->execute();
    $result = $stmt->get_result();

    $users = [];
    while ($row = $result->fetch_assoc()) {
        $row['is_blocked'] = (bool) $row['is_blocked']; // ✅ Convert 1/0 to Boolean
        $users[] = $row;
    }

    echo json_encode($users);
}

// ✅ Update user details
elseif ($action == "updateUser") {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $stmt = $conn->prepare("
        UPDATE users SET 
        username = ?, email = ?, full_name = ?, bio = ?, date_of_birth = ?, location = ? 
        WHERE id = ?
    ");
    $stmt->bind_param("ssssssi", 
        $data['username'], $data['email'], $data['full_name'], 
        $data['bio'], $data['date_of_birth'], $data['location'], $data['id']
    );
    $stmt->execute();

    echo json_encode(["message" => "User details updated successfully"]);
}

// ✅ Block/Unblock User
elseif ($action == "blockUser") {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("UPDATE users SET is_blocked = ? WHERE id = ?");
    $stmt->bind_param("ii", $data['block'], $data['user_id']);
    $stmt->execute();

    echo json_encode([
        "message" => $data['block'] ? "User blocked successfully" : "User unblocked successfully"
    ]);
}

// ✅ Fetch all debates
elseif ($action == "getAllDebates") {
    $stmt = $conn->prepare("SELECT id, title, category, debate_type, deadline, is_locked, state FROM debates ORDER BY created_at DESC");
    $stmt->execute();
    $result = $stmt->get_result();

    $debates = [];
    while ($row = $result->fetch_assoc()) {
        $row['is_locked'] = (bool) $row['is_locked']; // ✅ Convert 1/0 to Boolean
        $row['state'] = $row['state'] ?? 'Ongoing'; // ✅ Ensure state is set correctly
        $debates[] = $row;
    }

    echo json_encode($debates);
}

// ✅ Update Debate Deadline & State
elseif ($action == "updateDebate") {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("UPDATE debates SET deadline = ?, state = ? WHERE id = ?");
    $stmt->bind_param("ssi", $data['deadline'], $data['state'], $data['debate_id']);
    $stmt->execute();

    echo json_encode(["message" => "Debate deadline updated"]);
}

// ✅ Lock/Unlock Debate
elseif ($action == "lockDebate") {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("UPDATE debates SET is_locked = ? WHERE id = ?");
    $stmt->bind_param("ii", $data['is_locked'], $data['debate_id']);
    $stmt->execute();

    echo json_encode(["message" => "Debate lock status updated"]);
}

// ✅ Restrict Users from Viewing Locked Debates
elseif ($action == "getDebateDetails") {
    $debateId = $_GET['debate_id'];
    $stmt = $conn->prepare("SELECT * FROM debates WHERE id = ?");
    $stmt->bind_param("i", $debateId);
    $stmt->execute();
    $debate = $stmt->get_result()->fetch_assoc();

    if ($debate['is_locked']) {
        echo json_encode(["error" => "This debate has been locked by an admin"]);
        exit();
    }

    echo json_encode($debate);
}

elseif ($action == "getFeedback") {
    $stmt = $conn->prepare("SELECT f.*, u.username FROM feedback f JOIN users u ON f.user_id = u.id ORDER BY f.created_at DESC");
    $stmt->execute();
    $result = $stmt->get_result();
    $feedbackList = [];

    while ($row = $result->fetch_assoc()) {
        $feedbackList[] = $row;
    }

    echo json_encode($feedbackList);
}

// ✅ Mark Feedback as Resolved
elseif ($action == "resolveFeedback") {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("UPDATE feedback SET status = 'Resolved' WHERE id = ?");
    $stmt->bind_param("i", $data['feedback_id']);
    $stmt->execute();

    echo json_encode(["message" => "Feedback marked as resolved"]);
}

elseif ($action == "getAdminStats") {
    $stats = [];

    // ✅ Total Registered Users
    $result = $conn->query("SELECT COUNT(*) AS totalUsers FROM users");
    $stats['totalUsers'] = $result->fetch_assoc()['totalUsers'];

    // ✅ New Signups This Week
    $result = $conn->query("SELECT COUNT(*) AS newUsers FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
    $stats['newUsers'] = $result->fetch_assoc()['newUsers'];

    // ✅ Most Active Users (Calculated based on debates, votes, and arguments)
    $result = $conn->query("
        SELECT u.username, COUNT(DISTINCT d.id) AS debates_created, COUNT(DISTINCT dv.user_id) AS votes_cast,
               COUNT(DISTINCT da.id) AS arguments_posted,
               (COUNT(DISTINCT d.id) + COUNT(DISTINCT dv.user_id) + COUNT(DISTINCT da.id)) AS activity_score
        FROM users u
        LEFT JOIN debates d ON u.id = d.created_by
        LEFT JOIN debate_votes dv ON u.id = dv.user_id
        LEFT JOIN debate_arguments da ON u.id = da.user_id
        GROUP BY u.id
        ORDER BY activity_score DESC
        LIMIT 5
    ");
    $stats['topActiveUsers'] = $result->fetch_all(MYSQLI_ASSOC);

    // ✅ Total Debates Created
    $result = $conn->query("SELECT COUNT(*) AS totalDebates FROM debates");
    $stats['totalDebates'] = $result->fetch_assoc()['totalDebates'];

    // ✅ Trending Debate Topics
    $result = $conn->query("SELECT category FROM debates GROUP BY category ORDER BY COUNT(*) DESC LIMIT 5");
    $stats['popularTopics'] = $result->fetch_all(MYSQLI_ASSOC);

    // ✅ Top Contributors (Users who created the most debates)
    $result = $conn->query("SELECT username FROM users JOIN debates ON users.id = debates.created_by GROUP BY users.id ORDER BY COUNT(debates.id) DESC LIMIT 5");
    $stats['topContributors'] = $result->fetch_all(MYSQLI_ASSOC);

    // ✅ Total Votes in Debates
    $result = $conn->query("SELECT COUNT(*) AS totalVotes FROM debate_votes");
    $stats['totalVotes'] = $result->fetch_assoc()['totalVotes'];

    // ✅ Most Supported Debates (Highest votes count)
    $result = $conn->query("SELECT debate_id, COUNT(*) AS votes FROM debate_votes GROUP BY debate_id ORDER BY votes DESC LIMIT 5");
    $stats['popularDebates'] = $result->fetch_all(MYSQLI_ASSOC);

    // ✅ Total Arguments Submitted
    $result = $conn->query("SELECT COUNT(*) AS totalArguments FROM debate_arguments");
    $stats['totalArguments'] = $result->fetch_assoc()['totalArguments'];

    // ✅ Feedback Status
    $result = $conn->query("SELECT COUNT(*) AS pendingFeedback FROM feedback WHERE status = 'Pending'");
    $stats['pendingFeedback'] = $result->fetch_assoc()['pendingFeedback'];

    $result = $conn->query("SELECT COUNT(*) AS resolvedFeedback FROM feedback WHERE status = 'Resolved'");
    $stats['resolvedFeedback'] = $result->fetch_assoc()['resolvedFeedback'];

    echo json_encode($stats);
}

// ✅ Get all arguments (including archived)
elseif ($action == "getArguments") {
    $result = $conn->query("
        SELECT da.id, u.username, d.title AS debate_title, da.argument, da.created_at, da.is_archived
        FROM debate_arguments da
        JOIN users u ON da.user_id = u.id
        JOIN debates d ON da.debate_id = d.id
    ");

    $arguments = $result->fetch_all(MYSQLI_ASSOC);

    // ✅ Convert 0/1 to true/false
    foreach ($arguments as &$arg) {
        $arg['is_archived'] = ($arg['is_archived'] == 1);
    }

    echo json_encode($arguments);
}

// ✅ Archive an argument
elseif ($action == "archiveArgument") {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("UPDATE debate_arguments SET is_archived = 1 WHERE id = ?");
    $stmt->bind_param("i", $data['argumentId']);
    $stmt->execute();
    echo json_encode(["message" => "Argument archived successfully"]);
}

// 🔹 Function to Check Session on Protected Routes
function checkSession() {
    if (!isset($_SESSION['user'])) {
        echo json_encode(["error" => "User not logged in"]);
        exit();
    }
}

$conn->close();
?>