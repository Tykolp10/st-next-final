<?php
/**
 * ST Sehat Tentrem - Mini Admin Panel (No-Database)
 * Untuk Indonesia Raya
 */

session_start();

// ==========================================
// KONFIGURASI KEAMANAN (UBAH DI SINI)
// ==========================================
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', '12354321'); 

$eventsFile = __DIR__ . '/events.json';
$uploadDir = __DIR__ . '/assets/images/inspiration/';

// Pastikan file JSON ada
if (!file_exists($eventsFile)) {
    $defaultData = [
        [
            "category" => "Musik & Budaya",
            "title" => "Jazzy Friday with Indro Hardjodikoro",
            "desc" => "Intimate Jazz Night bersama ambassador ST, Indro Hardjodikoro di Ruang Putih Bandung.",
            "image" => "assets/images/inspiration/event-jazz-bandung.jpg",
            "link" => "https://www.instagram.com/p/DW3c5mqkcPz/"
        ],
        [
            "category" => "Event Ramadhan",
            "title" => "Ramadhan Kampoeng Majapahit",
            "desc" => "Berbagi inspirasi, cerita, dan suasana hangat Ramadhan bersama Sehat Tentrem di Mojokerto.",
            "image" => "assets/images/inspiration/event-ramadan-mojokerto.jpg",
            "link" => "https://www.instagram.com/p/DVP5914EQIc/"
        ],
        [
            "category" => "Religi & Budaya",
            "title" => "Pengajian Tasyakkuran Isro' Mi'roj",
            "desc" => "ST memeriahkan Pengajian Tasyakkuran Isro' Mi'roj Nabi Muhammad SAW dan Hari Shiddiqiyyah 1447 H.",
            "image" => "assets/images/inspiration/event-isra-miraj.jpg",
            "link" => "https://www.instagram.com/p/DTfHX-eEV7p/"
        ]
    ];
    file_put_contents($eventsFile, json_encode($defaultData, JSON_PRETTY_PRINT));
}

// Logika Logout
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    unset($_SESSION['st_logged_in']);
    session_destroy();
    header('Location: admin.php');
    exit;
}

// Logika Login
$loginError = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    if ($username === ADMIN_USERNAME && $password === ADMIN_PASSWORD) {
        $_SESSION['st_logged_in'] = true;
        header('Location: admin.php');
        exit;
    } else {
        $loginError = 'Username atau password salah!';
    }
}

// Cek Status Login
$isLoggedIn = isset($_SESSION['st_logged_in']) && $_SESSION['st_logged_in'] === true;

// Baca data event saat ini
$events = json_decode(file_get_contents($eventsFile), true);

// Logika Simpan Event
$saveSuccess = false;
$saveError = '';
if ($isLoggedIn && $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_events'])) {
    $updatedEvents = [];
    
    for ($i = 0; $i < 3; $i++) {
        $category = trim($_POST["category_$i"] ?? '');
        $title = trim($_POST["title_$i"] ?? '');
        $desc = trim($_POST["desc_$i"] ?? '');
        $link = trim($_POST["link_$i"] ?? '');
        $currentImage = $_POST["current_image_$i"] ?? '';
        
        $imagePath = $currentImage;
        
        // Handle Upload Gambar jika ada file baru
        if (isset($_FILES["image_$i"]) && $_FILES["image_$i"]['error'] === UPLOAD_ERR_OK) {
            $fileTmpPath = $_FILES["image_$i"]['tmp_name'];
            $fileName = $_FILES["image_$i"]['name'];
            $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
            
            // Validasi tipe file
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
            if (in_array($fileExtension, $allowedExtensions)) {
                // Beri nama aman agar tidak bentrok
                $newFileName = 'event_uploaded_' . $i . '_' . time() . '.' . $fileExtension;
                
                // Buat folder upload jika belum ada
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0755, true);
                }
                
                $destPath = $uploadDir . $newFileName;
                if (move_uploaded_path($fileTmpPath, $destPath)) {
                    $imagePath = 'assets/images/inspiration/' . $newFileName;
                } else {
                    $saveError = "Gagal mengunggah file untuk Event " . ($i + 1);
                }
            } else {
                $saveError = "Format file Event " . ($i + 1) . " tidak didukung. Gunakan JPG, PNG, atau WEBP.";
            }
        }
        
        $updatedEvents[] = [
            'category' => $category,
            'title' => $title,
            'desc' => $desc,
            'image' => $imagePath,
            'link' => $link
        ];
    }
    
    if (empty($saveError)) {
        if (file_put_contents($eventsFile, json_encode($updatedEvents, JSON_PRETTY_PRINT))) {
            $events = $updatedEvents;
            $saveSuccess = true;
        } else {
            $saveError = "Gagal menyimpan data ke berkas JSON.";
        }
    }
}

// Custom move_uploaded_file wrapper to ensure correct path formatting on Windows/Linux
function move_uploaded_path($tmp, $dest) {
    return move_uploaded_file($tmp, $dest);
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ST Sehat Tentrem - Panel Admin Event</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
  <style>
    :root {
      --gold: #c9a84c;
      --gold-hover: #e8c97a;
      --dark: #08080a;
      --dark-2: #0e0e12;
      --dark-3: #161619;
      --border: rgba(201,168,76,0.15);
      --text: #e8e8e0;
      --text-muted: #8c8c88;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--dark);
      color: var(--text);
      font-family: 'Roboto', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      background-color: var(--dark-2);
      border-bottom: 1px solid var(--border);
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--gold);
      letter-spacing: 0.05em;
    }
    .logout-btn {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.3s;
    }
    .logout-btn:hover { color: var(--gold); }
    
    .container {
      max-width: 900px;
      margin: 40px auto;
      padding: 0 24px;
      width: 100%;
      flex-grow: 1;
    }
    
    /* Login Form Styles */
    .login-card {
      background-color: var(--dark-2);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 40px;
      max-width: 400px;
      margin: 100px auto;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    .login-card h2 {
      color: var(--gold);
      margin-bottom: 24px;
      font-size: 1.5rem;
    }
    .form-group {
      margin-bottom: 20px;
      text-align: left;
    }
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-size: 0.875rem;
      color: var(--text-muted);
    }
    .form-control {
      width: 100%;
      background: rgba(0,0,0,0.3);
      border: 1px solid var(--border);
      padding: 12px 16px;
      color: var(--text);
      border-radius: 6px;
      outline: none;
      font-family: inherit;
      transition: border-color 0.3s;
    }
    .form-control:focus {
      border-color: var(--gold);
    }
    .btn {
      background: var(--gold);
      color: #000;
      border: none;
      padding: 12px 24px;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.3s;
      width: 100%;
      font-family: inherit;
    }
    .btn:hover {
      background: var(--gold-hover);
    }
    .alert {
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 20px;
      font-size: 0.875rem;
    }
    .alert-danger {
      background: rgba(220, 53, 69, 0.1);
      border: 1px solid rgba(220, 53, 69, 0.3);
      color: #ea868f;
    }
    .alert-success {
      background: rgba(40, 167, 69, 0.1);
      border: 1px solid rgba(40, 167, 69, 0.3);
      color: #75b798;
    }

    /* Admin Panel Styles */
    .panel-title {
      font-size: 1.75rem;
      margin-bottom: 8px;
      color: var(--text);
    }
    .panel-subtitle {
      color: var(--text-muted);
      font-size: 0.95rem;
      margin-bottom: 32px;
    }
    .event-card {
      background-color: var(--dark-2);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 24px;
      margin-bottom: 24px;
    }
    .event-card h3 {
      color: var(--gold);
      font-size: 1.15rem;
      margin-bottom: 20px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      padding-bottom: 8px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    textarea.form-control {
      resize: vertical;
      height: 80px;
    }
    .preview-img-wrap {
      margin-top: 10px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .preview-img {
      width: 100px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid var(--border);
    }
    .preview-text {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    footer {
      text-align: center;
      padding: 30px;
      color: var(--text-muted);
      font-size: 0.8rem;
      border-top: 1px solid rgba(255,255,255,0.03);
    }
    
    @media (max-width: 768px) {
      .grid-2 { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

  <?php if ($isLoggedIn): ?>
    <header>
      <div class="logo">ST SEHAT TENTREM</div>
      <a href="admin.php?action=logout" class="logout-btn">Keluar Panel (Logout)</a>
    </header>

    <main class="container">
      <h1 class="panel-title">Kelola Event Terkini</h1>
      <p class="panel-subtitle">Silakan isi teks dan unggah gambar poster baru untuk 3 slot kartu event di halaman beranda.</p>

      <?php if ($saveSuccess): ?>
        <div class="alert alert-success">✓ Perubahan event berhasil disimpan dan langsung tayang di website!</div>
      <?php endif; ?>

      <?php if (!empty($saveError)): ?>
        <div class="alert alert-danger">⚠ <?php echo htmlspecialchars($saveError); ?></div>
      <?php endif; ?>

      <form action="admin.php" method="POST" enctype="multipart/form-data">
        <input type="hidden" name="save_events" value="1">

        <?php for ($i = 0; $i < 3; $i++): $ev = $events[$i]; ?>
          <div class="event-card">
            <h3>Slot Event #<?php echo ($i + 1); ?></h3>
            
            <div class="grid-2">
              <div class="form-group">
                <label>Kategori</label>
                <input type="text" name="category_<?php echo $i; ?>" class="form-control" value="<?php echo htmlspecialchars($ev['category'] ?? ''); ?>" required placeholder="Contoh: Musik & Budaya">
              </div>
              <div class="form-group">
                <label>Tautan Link Instagram</label>
                <input type="url" name="link_<?php echo $i; ?>" class="form-control" value="<?php echo htmlspecialchars($ev['link'] ?? ''); ?>" required placeholder="Contoh: https://www.instagram.com/p/.../">
              </div>
            </div>

            <div class="form-group">
              <label>Judul Event</label>
              <input type="text" name="title_<?php echo $i; ?>" class="form-control" value="<?php echo htmlspecialchars($ev['title'] ?? ''); ?>" required placeholder="Masukkan judul event">
            </div>

            <div class="form-group">
              <label>Deskripsi Ringkas</label>
              <textarea name="desc_<?php echo $i; ?>" class="form-control" required placeholder="Jelaskan secara singkat mengenai event ini..."><?php echo htmlspecialchars($ev['desc'] ?? ''); ?></textarea>
            </div>

            <div class="form-group">
              <label>Ganti Gambar Poster (Format: JPG/PNG/WEBP)</label>
              <input type="file" name="image_<?php echo $i; ?>" class="form-control" accept="image/*">
              <input type="hidden" name="current_image_<?php echo $i; ?>" value="<?php echo htmlspecialchars($ev['image'] ?? ''); ?>">
              
              <?php if (!empty($ev['image'])): ?>
                <div class="preview-img-wrap">
                  <img src="<?php echo htmlspecialchars($ev['image']); ?>" class="preview-img" alt="Poster">
                  <div>
                    <span class="preview-text">Poster Aktif saat ini:<br><code><?php echo htmlspecialchars($ev['image']); ?></code></span>
                  </div>
                </div>
              <?php endif; ?>
            </div>
          </div>
        <?php endfor; ?>

        <button type="submit" class="btn" style="padding: 16px; font-size: 1rem; margin-top: 10px;">Simpan Semua Perubahan Event</button>
      </form>
    </main>

  <?php else: ?>
    <!-- Halaman Login -->
    <main class="container" style="display:flex; align-items:center; justify-content:center; flex-grow:1;">
      <div class="login-card">
        <h2>Panel Admin Event</h2>
        
        <?php if (!empty($loginError)): ?>
          <div class="alert alert-danger"><?php echo htmlspecialchars($loginError); ?></div>
        <?php endif; ?>

        <form action="admin.php" method="POST">
          <input type="hidden" name="login" value="1">
          <div class="form-group">
            <label for="username">Nama Pengguna (Username)</label>
            <input type="text" id="username" name="username" class="form-control" required autofocus placeholder="Username">
          </div>
          <div class="form-group">
            <label for="password">Kata Sandi (Password)</label>
            <input type="password" id="password" name="password" class="form-control" required placeholder="Password">
          </div>
          <button type="submit" class="btn">Masuk Panel</button>
        </form>
        <p style="margin-top:20px; font-size:0.75rem; color:var(--text-muted)">Default: <code>admin</code> / <code>12354321</code></p>
      </div>
    </main>
  <?php endif; ?>

  <footer>
    <p>© 2026 PT Sehat Tentrem Jaya Lestari · Untuk Indonesia Raya</p>
  </footer>

</body>
</html>
