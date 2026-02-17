## SchooLSys 简要

一个用于学校管理的轻量后端（Node.js + Express + Prisma）。本项目包含用户认证与会话管理（支持刷新令牌轮换）、角色授权、课程与关系（学生/家长/教师/课程/选课）示例数据与脚本。

快速上手
1. 在根目录新建或复制 `.env`，设置 `DATABASE_URL` 和 `JWT_SECRET`。
2. 安装依赖：

```powershell
npm install
```

3. 运行 Prisma 迁移并生成 client：

```powershell
npx prisma migrate dev --name init
npx prisma generate
```

4. 填充示例数据：

```powershell
node .\scripts\seed.js
```

常用命令与脚本
- `node scripts/seed.js` — 使用 `USERS`、`COURSES`、`STUDENT_TEACHERS`、`STUDENT_PARENTS`、`ENROLMENTS` 数组填充数据库。
- `node scripts/add_student_parent.js --student <email|id> --parent <email|id>` — 通过 email 或 id 添加学生-家长关系。

模型要点
- `courses.teacher_id` 指向 `users.id`。
- 新增 `enrolments` 模型用于学生与课程的多对多关系，另有 `student_parents` 与 `student_teachers`。

我可以把 README 翻译得更详细或加入 Docker / 部署说明；告诉我你想要的侧重点即可。
