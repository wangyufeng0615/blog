# 小球移动重置版

by GPT-5.6 Sol

博客内置纯前端应用，发布地址：`https://wangyufeng.org/ball-moving/`。

“小球移动”的现代网页复刻。保留原版添加、点选、删除、计分、暂停、速度调节与两种精确胜利条件，并使用 Three.js 和 Rapier 3D 重建视觉与物理表现。

## 技术栈

- TypeScript 7
- React 19
- Vite 8
- Three.js
- Rapier 3D

## 本地运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

## 规则

- 添加物体后开始计时；分值、尺寸、形状和速度随机。
- 点中目标后再删除，目标分值累加到总分。
- 没有显式选中时，删除最早生成的物体且不计分。
- 点击空白区域随机扣 1–3 分，分数不会低于 0。
- 分数正好达到 50，或等于剩余物体数量的 20 倍时获胜。

## 实现说明

- Rapier 以固定 60 Hz 步长运行，避免原版速度随帧率变化。
- 物体只和四面墙碰撞，物体之间允许重叠穿过，保持原版行为。
- React 只管理 HUD 和操作界面；逐帧物理、渲染和粒子效果由 `GameEngine` 独立管理。
- 存档采用带版本号的 JSON 写入 `localStorage`，读取失败时停止恢复，不覆盖当前状态。
