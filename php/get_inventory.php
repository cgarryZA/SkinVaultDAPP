<?php
session_start();
if (!isset($_SESSION['steamid'])) {
    http_response_code(401);
    echo json_encode(['error'=>'Not logged in']);
    exit;
}
$steamid = $_SESSION['steamid'];
$url = "https://steamcommunity.com/inventory/{$steamid}/730/2?l=english&count=1000";
$inv = @file_get_contents($url);
if (!$inv) {
    http_response_code(500);
    echo json_encode(['error'=>'Could not fetch inventory']);
    exit;
}
header('Content-Type: application/json');
echo $inv;
exit;
?>