#!/bin/sh
kill "$(cat /run/cyber-lab/store.pid)" 2>/dev/null || true
