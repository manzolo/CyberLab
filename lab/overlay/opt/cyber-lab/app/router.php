<?php
// Un bersaglio volutamente piccolo e leggibile. Non parla mai fuori dalla LAN
// 10.10.0.0/24: i due server PHP vengono legati solo a 10.10.0.2.
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$now = date('M d H:i:s');

function audit(string $line): void {
    file_put_contents('/var/log/cyber-lab/audit.log', $line . "\n", FILE_APPEND | LOCK_EX);
}
function forbidden(string $reason): never {
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    echo "DENIED: $reason\n";
    exit;
}
function hardened(string $name): bool {
    return is_file('/etc/cyber-lab/hardened-' . $name);
}

if ($path === '/health' || $path === '/') {
    audit("$now HEALTH ip=$ip");
    header('Content-Type: text/plain; charset=utf-8');
    echo "cyber-lab web\n";
    echo (hardened('xss') && hardened('traversal') && hardened('rce')) ? "HARDENED\n" : "VULNERABLE\n";
    exit;
}

if ($path === '/store') {
    $value = file_get_contents('php://input');
    file_put_contents('/var/lib/cyber-lab/store.txt', $value . "\n", FILE_APPEND | LOCK_EX);
    audit("$now STORE ip=$ip value=" . base64_encode($value));
    header('Content-Type: text/plain; charset=utf-8');
    echo "STORED\n";
    exit;
}

if ($path === '/login') {
    $token = preg_replace('/[^a-zA-Z0-9_-]/', '', (string)($_GET['token'] ?? 'none'));
    audit("$now Failed login from $ip token=$token");
    http_response_code(401);
    header('Content-Type: text/plain; charset=utf-8');
    echo "LOGIN FAILED\n";
    exit;
}

if ($path === '/echo') {
    $msg = (string)($_GET['msg'] ?? '');
    audit("$now XSS ip=$ip payload=" . base64_encode($msg));
    header('Content-Type: text/html; charset=utf-8');
    echo hardened('xss') ? htmlspecialchars($msg, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') : $msg;
    exit;
}

if ($path === '/file') {
    $name = (string)($_GET['name'] ?? '');
    audit("$now FILE ip=$ip path=" . base64_encode($name));
    if (hardened('traversal')) forbidden('path traversal');
    header('Content-Type: text/plain; charset=utf-8');
    $data = @file_get_contents($name);
    if ($data === false) { http_response_code(404); echo "NOT FOUND\n"; }
    else echo $data;
    exit;
}

if ($path === '/exec') {
    $cmd = (string)($_GET['cmd'] ?? '');
    audit("$now EXEC ip=$ip command=" . base64_encode($cmd));
    if (hardened('rce')) forbidden('command execution');
    header('Content-Type: text/plain; charset=utf-8');
    echo shell_exec($cmd . ' 2>&1') ?? '';
    exit;
}

if ($path === '/witness') {
    $marker = preg_replace('/[^a-zA-Z0-9_-]/', '', (string)($_GET['marker'] ?? 'none'));
    audit("$now WITNESS ip=$ip marker=$marker");
    header('Content-Type: text/plain; charset=utf-8');
    echo "SEEN $marker\n";
    exit;
}

http_response_code(404);
echo "NOT FOUND\n";
