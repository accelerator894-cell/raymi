#!/bin/sh
set -e

echo "[夜之城信号] 正在初始化数据库（迁移 + 种子数据）..."
npx tsx db/prod-setup.ts

echo "[夜之城信号] 数据库就绪，启动服务器..."
exec node dist/boot.js
