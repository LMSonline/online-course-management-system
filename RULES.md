# RULES.md

## 1. ScrumBan Rules

- **Board**: To Do → In Progress → In Review → Done (Trello/Notion).
- **WIP Limit**: mỗi thành viên tối đa **2 task** ở trạng thái In Progress.
- **Daily update (async)**: mỗi thành viên cập nhật ngắn gọn trong Zalo/Trello (Yesterday / Today / Blockers).
- **Weekly meeting**: Chủ Nhật tối (30–45 phút) — review tiến độ + planning tuần tới.
- **Sprint demo**: Cuối mỗi sprint (~2 tuần) — demo chức năng hoàn thành cho cả nhóm.
- **Retro**: Sau demo → Start/Stop/Continue.

---

## 2. Definition of Done (DoD)

Một task được mark **Done** khi:

- Code pushed lên **feature branch** → mở **Pull Request** → merge vào `develop` (hoặc `main` nếu đã stable).
- Có ít nhất **1 review approve**.
- Test chạy pass (unit/integration nếu có).
- README/Notion được cập nhật nếu thay đổi ảnh hưởng tới setup.
- Service chạy được trên local/docker (hoặc staging) theo Runbook.
- Không có secret hardcode (được quản lý bằng `.env` hoặc GitHub Secrets).

---

## 3. Coding Rules

- **Branch convention**:
  - `main` → stable, production-ready.
  - `develop` → code tích hợp.
  - `feature/<name>` → tính năng mới.
  - `fix/<name>` → bug fix.
  - `hotfix/<name>` → sửa lỗi gấp.
  - `release/sprint-x` → nhánh chuẩn bị release.
- **Commit convention** (theo [Conventional Commits](https://www.conventionalcommits.org/)):
  - `feat: ...` (chức năng mới)
  - `fix: ...` (sửa bug)
  - `docs: ...` (cập nhật docs)
  - `chore: ...` (công việc vặt, config, build…)
  - `refactor: ...` (cải thiện code, không đổi behavior)
  - `test: ...` (bổ sung test)
- **PR convention**:
  - Mô tả: mục tiêu, cách test, ảnh chụp/clip demo (nếu UI).
  - Tối thiểu 1 reviewer approve trước khi merge.
- **Code style**:
  - Theo linter của ngôn ngữ (Prettier/ESLint cho JS, Checkstyle cho Java, Flake8/Black cho Python).
  - Tuân thủ rule chung: dễ đọc, dễ debug, có comment ở phần logic khó.

---

## 4. Meeting Rules

- **Daily (async)**: update trên Zalo/Trello (Yesterday / Today / Blockers).
- **Weekly (live)**: Chủ Nhật tối, 30–45 phút (review + planning).
- **Sprint Review**: Demo chức năng hoàn thành.
- **Sprint Retro**: Start/Stop/Continue.

---

## 5. Communication

- **Zalo**: cập nhật nhanh, thông báo khẩn.
- **Notion**: docs chính, runbooks, backlog (detailed).
- **Trello**: quản lý task day-to-day (board).
- **GitHub**: code, issues, PR.
- **Email**: liên lạc chính thức với giảng viên/mentor.

---

## 6. PR Checklist (tối thiểu)

- [ ]  PR link issue / story.
- [ ]  Tests added / updated (nếu có).
- [ ]  Linter passed.
- [ ]  1 reviewer approved.
- [ ]  Docs updated (nếu cần).
- [ ]  Runbook update (nếu ảnh hưởng setup).

---


## 7. Infrastructure Rules

- **Env variables**:
  - Luôn có file `.env.example` để các dev dễ setup.
  - Secret lưu trong GitHub Secrets, không commit vào repo.
- **CI/CD**:
  - Push vào feature branch → chạy CI (lint, build, test).
  - Merge vào `develop` → chạy test integration.
  - Merge vào `main` → trigger CD (build Docker + deploy).
- **Docker/Kafka**:
  - Dùng `docker-compose.yml` trong thư mục `infra/` để dev setup nhanh.
  - Runbook ghi rõ: cách start/stop cluster, check logs, reset data.

---

## 8. Documentation Rules

- **README.md**: mô tả setup nhanh cho từng service.
- **ARCHITECTURE.md**: kiến trúc tổng quan.
- **RUNBOOK.md**: hướng dẫn chi tiết dev setup, deploy, debug.
- **RULES.md**: file này — quy định làm việc nhóm.
