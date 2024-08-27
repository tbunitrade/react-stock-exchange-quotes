<?php
// Включаем файл конфигурации базы данных
include 'db-config.php';

// Подключение к базе данных
$conn = new mysqli($servername, $username, $password, $dbname);

// Проверка соединения
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Проверка существования таблицы и её создание при отсутствии
$tableCheckQuery = "SHOW TABLES LIKE 'statistics'";
$result = $conn->query($tableCheckQuery);

if ($result->num_rows == 0) {
    // Таблица не существует, создаем её
    $createTableQuery = "
        CREATE TABLE statistics (
            id INT AUTO_INCREMENT PRIMARY KEY,
            mean DOUBLE,
            std_dev DOUBLE,
            mode DOUBLE,
            min DOUBLE,
            max DOUBLE,
            timestamp DATETIME
        )
    ";
    if ($conn->query($createTableQuery) === TRUE) {
        echo "Table 'statistics' created successfully.";
    } else {
        die("Error creating table: " . $conn->error);
    }
} else {
    echo "Table 'statistics' already exists.";
}

// Получение данных из запроса
$data = json_decode(file_get_contents('php://input'), true);

$mean = $data['mean'];
$stdDev = $data['stdDev'];
$mode = $data['mode'];
$min = $data['min'];
$max = $data['max'];
$timestamp = $data['timestamp'];

// SQL-запрос для вставки данных
$sql = "INSERT INTO statistics (mean, std_dev, mode, min, max, timestamp) VALUES ('$mean', '$stdDev', '$mode', '$min', '$max', '$timestamp')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "Statistics saved successfully"]);
} else {
    echo json_encode(["error" => "Error: " . $sql . "<br>" . $conn->error]);
}

// Закрытие соединения
$conn->close();
?>
