# 夜之城信号 // NIGHT CITY SIGNAL

赛博朋克 2077 × 边缘行者 同人风格全栈博客。

- **前端**：React 19 + TypeScript + Tailwind CSS（故障特效 / 扫描线 / 霓虹主题）
- **后端**：Hono + tRPC + Drizzle ORM + MySQL
- **功能**：文章发布 / 分类标签 / 搜索 / 评论 / 管理员后台 / 边缘行者角色档案
- **部署**：Docker + docker-compose 一键自托管

## 快速部署（自己的服务器）

```bash
docker compose up -d --build
```

详细步骤（域名绑定、HTTPS、改密码、备份）见 **[部署说明.md](./部署说明.md)**。

## 本地开发

```bash
npm install
npm run db:push   # 同步数据表
npx tsx db/seed.ts # 写入示例文章
npm run dev        # http://localhost:3000
```

后台入口 `/admin`，默认账号 `admin / admin123`（通过环境变量
`ADMIN_USERNAME` / `ADMIN_PASSWORD` 修改）。
