<?php
session_start();
require_once 'openid.php';

$openid = new LightOpenID($_SERVER['HTTP_HOST']);
$openid->identity = 'https://steamcommunity.com/openid';
header('Location: ' . $openid->authUrl());
exit;
?>