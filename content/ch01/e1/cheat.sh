#!/bin/sh
cat > "$LAB/scan.txt" <<'EOF'
22/tcp open ssh
80/tcp open http
3306/tcp open mysql
8080/tcp open http-proxy
9000/tcp open cslistener
9090/tcp open zeus-admin
EOF
