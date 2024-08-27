<?php
// Разрешаем запросы с любых источников (для разработки)
header("Access-Control-Allow-Origin: *");

// Разрешаем методы запроса, которые будут использоваться
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// Разрешаем заголовки, которые могут быть отправлены
header("Access-Control-Allow-Headers: Content-Type");

// Обработка preflight-запроса (метод OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0); // Выход, чтобы не обрабатывать остальные части кода
}

// Включаем вывод ошибок для отладки
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Включаем файл конфигурации базы данных
include 'db-connect.php';

// Подключение к базе данных
$conn = new mysqli($servername, $username, $password, $dbname);

// Проверка соединения
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Проверка существования таблицы и её создание при отсутствии
$tableCheckQuery = "SHOW TABLES LIKE 'statistics'";
$result = $conn->query($tableCheckQuery);

if ($result->num_rows == 0) {
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
    if ($conn->query($createTableQuery) !== TRUE) {
        die(json_encode(["error" => "Error creating table: " . $conn->error]));
    }
}

// Получение данных из запроса
$data = json_decode(file_get_contents('php://input'), true);

// Проверка данных
if (isset($data['mean'], $data['stdDev'], $data['mode'], $data['min'], $data['max'], $data['timestamp'])) {
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
        echo json_encode(["error" => "Error executing query: " . $conn->error]);
    }
} else {
    echo json_encode(["error" => "Invalid or missing data"]);
}

// Закрытие соединения
$conn->close();
?>
