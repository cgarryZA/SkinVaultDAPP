<?php
require_once('php/steamauth.php');
if(isset($_SESSION['steamid'])) {
    require_once('php/userInfo.php');
}
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SkinVault - CS2 Skin ETF</title>
    <link rel="stylesheet" href="css/style.css" />
    <link rel="stylesheet" href="css/vault-card.css" />
    <style>
      .item-card { background: #23272E; color: #fff; border-radius: 8px; padding: 1em; min-width: 160px; box-shadow: 0 2px 8px #0003; margin-bottom: 1em;}
      .item-card img { width: 80px; height: 80px; object-fit: contain; display: block; margin-bottom: 0.5em; }
    </style>
  </head>
  <body>
    <div id="header-placeholder"></div>

    <div class="vault-heading" style="background: #1f2937; border-bottom: 1px solid #374151;">
      <h1>Your Inventory</h1>
      <button onclick="sendTradeOffer()">Send Trade</button>
    </div>

    <!-- Profile/Login -->
    <div style="margin:1rem 0;">
      <?php if(isset($_SESSION['steamid'])): ?>
        <img src="<?=$steamprofile['avatarfull']?>" style="width:64px; border-radius:50%; vertical-align:middle;">
        <span style="font-size:1.2em; color:#faf;">Welcome, <?=$steamprofile['personaname']?></span>
        <a href="?logout" style="margin-left:1.5em; color:#aaa;">Logout</a>
      <?php else: ?>
        <?php loginbutton(); ?>
      <?php endif; ?>
    </div>

    <section style="padding-bottom:2rem; pointer-events:all;">
      <h2>Steam Inventory</h2>
      <?php
        if(isset($_SESSION['steamid'])) {
            $invurl = 'https://steamcommunity.com/inventory/'.$_SESSION['steamid'].'/730/2?l=english&count=2000';
            $json = file_get_contents($invurl);
            $inv = json_decode($json, true);

            if($inv && isset($inv['descriptions']) && isset($inv['assets'])) {
                $descmap = [];
                foreach($inv['descriptions'] as $d) {
                    $descmap[$d['classid'].'_'.$d['instanceid']] = $d;
                }
                echo '<div id="inventory" style="display:flex; flex-wrap:wrap; gap:1em;">';
                foreach($inv['assets'] as $asset) {
                    $key = $asset['classid'].'_'.$asset['instanceid'];
                    if(isset($descmap[$key])) {
                        $d = $descmap[$key];
                        $name = htmlspecialchars($d['market_hash_name']);
                        $icon = 'https://steamcommunity-a.akamaihd.net/economy/image/'.$d['icon_url'];
                        echo '<div class="item-card">
                                <img src="'.$icon.'" alt="">
                                <div>'.$name.'</div>
                              </div>';
                    }
                }
                echo '</div>';
            } else {
                echo '<div style="color:#f55;">Could not fetch inventory (profile may be private or empty).</div>';
            }
        }
      ?>
    </section>

    <div id="footer-placeholder"></div>
  </body>
</html>
