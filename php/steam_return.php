<?php
session_start();
require_once 'openid.php';

$openid = new LightOpenID($_SERVER['HTTP_HOST']);

if ($openid->mode) {
    if ($openid->mode == 'cancel') {
        header('Location: index.html?login=cancelled');
        exit;
    } elseif ($openid->validate()) {
        $id = $openid->identity;
        if (preg_match('/\d+$/', $id, $matches)) {
            $steamid = $matches[0];
            // Fetch player summary from Steam API (for name/avatar)
            $apiKey = "YOUR_STEAM_API_KEY";
            $info = file_get_contents("https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key={$apiKey}&steamids={$steamid}");
            $info = json_decode($info, true)['response']['players'][0] ?? [];
            $_SESSION['steamid'] = $steamid;
            $_SESSION['steam_personaname'] = $info['personaname'] ?? 'Steam User';
            $_SESSION['steam_avatar'] = $info['avatarfull'] ?? '';
            header('Location: index.html');
            exit;
        }
    }
}
// Failed: go to home
header('Location: index.html?login=failed');
exit;
?>