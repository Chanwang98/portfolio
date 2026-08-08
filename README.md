# 个人主页 · Personal Portfolio

一个中英双语、现代简约风格的**结构研发工程师个人主页**，用于投递简历时展示给 HR。

> 姓名（王耀琛 / Chan）已填入，但**学校、公司、项目等仍是示例内容**，替换后部署到 GitHub Pages，即可生成一个公开的链接（`https://你的用户名.github.io/`）放进简历里。

## 功能特点

- 🌏 **中英文一键切换**，浏览器会记住你的选择（localStorage）
- 📷 **作品图库**：图片为主、一句轻量介绍，点击看大图（灯箱）
- 📐 教育背景 / 工作经历 / 项目经历 三段式展示
- 📱 响应式布局，手机也能正常看
- ♿ 支持系统「减少动效」偏好，语义化标签

## 目录结构

```
portfolio/
├── index.html            # 页面主体（改这里的内容）
├── README.md             # 本文件
└── assets/
    ├── css/style.css     # 全部样式
    ├── js/main.js        # 交互逻辑（一般不用改）
    └── images/           # 图片资源放这里
        ├── avatar.jpg               # 你的头像（圆形展示，可选）
        ├── avatar-placeholder.svg   # 头像兜底占位（缺省自动显示）
        ├── work-1.jpg ~ work-6.jpg  # 你的作品图
        └── placeholder.svg          # 作品兜底占位（缺失时自动显示）
```

---

## ✏️ 第 1 步：替换个人信息

用任意文本编辑器打开 `index.html`，全文搜索标注了 **`✏️ 替换`** 的位置，逐项改成你的真实信息。需要替换的地方：

| 位置 | 说明 |
| --- | --- |
| `<title>` 和品牌栏 `C` | 品牌栏用姓名缩写，已经是 `C` |
| Hero 姓名「王耀琛」 | 中英文切换时分别显示 王耀琛 / Chan，页脚 `© 2026` 同步改 |
| 头像 `assets/images/avatar.jpg` | 你的照片，建议 1:1 正方形、≥ 600px；可省（缺省显示字母占位） |
| Hero 三个数字（6+/20+/12+） | 你的真实年限、项目数、量产数 |
| 「关于我」段落 | 2~4 句话介绍自己 |
| 教育背景两条 | 学校、专业、时间，可增删 `<article>` |
| 工作经历两条 | 公司、职位、时间，可增删 `<article>` |
| 项目经历三张卡片 | 项目名、说明、要点，可增删 `<article>` |
| 联系方式 | 邮箱、电话、城市 |

> 中英文文案分别在 `data-zh="…"` 和 `data-en="…"` 两个属性里，**记得两处都改**。

## 📷 第 2 步：添加作品图片

1. 把作品图命名成 `work-1.jpg`、`work-2.jpg` ……（支持 `.jpg` / `.png` / `.webp`）
2. 放进 `assets/images/` 文件夹
3. 页面会自动显示。**没放图的图片会显示灰色占位图，不影响页面**，但上线前请全部替换
4. 图多就继续加 `work-7`……，并在 `index.html` 的作品区复制一个 `<figure class="work">` 结构

**图片建议**：宽边 ≥ 1200px、4:3 比例（如 1200×900），单张 < 1MB，人眼最舒服。每张作品配一句文字说明（作品区每个 `<figure>` 里的标题和一句话）。

## 🛠 作品区怎么自己改

作品区在 `index.html` 里，每张作品是一个 `<figure class="work">`，结构如下：

```html
<figure class="work" data-caption-zh="作品 01 · 一句话介绍" data-caption-en="Work 01 · one-line intro">
  <div class="work-thumb">
    <img src="assets/images/work-1.jpg" alt="作品 01" loading="lazy"
         onerror="this.onerror=null;this.src='assets/images/placeholder.svg'" />
    <div class="work-overlay"><span data-zh="点击查看" data-en="Click to view"></span></div>
  </div>
  <figcaption>
    <h3 data-zh="作品 01" data-en="Work 01"></h3>
    <p data-zh="一句话介绍这件作品" data-en="One-line introduction for this work"></p>
  </figcaption>
</figure>
```

| 想改什么 | 怎么改 |
| --- | --- |
| 换图片 | 改 `<img>` 的 `src` 路径；或直接把图片命名为 `work-1.jpg`…放进 `assets/images/` |
| 改标题 | 改 `<figcaption>` 里的 `<h3>`，中英文在 `data-zh` / `data-en` |
| 改一句话介绍 | 改 `<figcaption>` 里的 `<p>`，中英文在 `data-zh` / `data-en` |
| 改点击大图时的说明 | 改 `<figure>` 上的 `data-caption-zh` / `data-caption-en` |
| 加作品 | 整段复制一个 `<figure>…</figure>` 贴到最后一个后面，编号（work-N、作品 N）顺延 |
| 删作品 | 删掉对应的一段 `<figure>…</figure>` |
| 改行列布局 | 打开 `assets/css/style.css`，找 `.work-grid`，改 `grid-template-columns: repeat(3, 1fr)` 里的数字：`2`=两列、`3`=三列、`4`=四列 |
| 改图片比例 | 同一个 `.work-thumb` 里，改 `aspect-ratio: 4 / 3`（如 `1 / 1` 正方形、`3 / 4` 竖图） |

## ▶️ 第 3 步：本地预览

双击 `index.html` 即可在浏览器打开预览（不需要安装任何东西）。

## 🚀 第 4 步：部署到 GitHub Pages

1. 在 GitHub 上新建一个仓库，名字必须是 **`你的用户名.github.io`**（例如 `zhangsan.github.io`）
2. 把本文件夹里所有文件上传（Git 方式或网页端上传均可），确保根目录下有 `index.html`
3. 进入仓库 **Settings → Pages**
4. **Build and deployment → Source** 选择 **Deploy from a branch**
5. Branch 选择 `main`，目录选 `/ (root)`，点 **Save**
6. 等 1~2 分钟，访问 `https://你的用户名.github.io/` 即可看到你的主页

> 每次修改后重新 push 到 `main` 分支，页面会自动更新（一般 1~2 分钟内生效）。

## ❓ 常见问题

**问：GitHub Pages 一直打不开或更新很慢？**
答：首次部署或更新后通常需要等待 1~5 分钟，刷新即可。仍不行就检查仓库名是否严格等于 `用户名.github.io`。

**问：我想用自己的域名？**
答：Settings → Pages → Custom domain 填你的域名，再在 DNS 加一条 CNAME 指向 `你的用户名.github.io`。

**问：想换主题色 / 字体？**
答：打开 `assets/css/style.css` 顶部的 `:root` 变量，改 `--accent`（主题色）和字体栈即可。

---

MIT License · 手写 HTML/CSS/JS，无任何依赖。
