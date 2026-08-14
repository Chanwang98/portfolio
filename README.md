# 个人主页 · Personal Portfolio

王耀琛（Chan）的**结构研发工程师**个人主页，中英双语、现代简约风格，用于投递简历时展示给 HR。

> 站点已上线：**<https://chanwang98.github.io/portfolio/>**，由 GitHub Pages 自动构建（推送 `main` 分支后 1~2 分钟生效）。

## 功能特点

- 🌏 **中英文一键切换**，浏览器会记住你的选择（localStorage）
- 📷 **作品图库**：整图缩略图（等比缩放、不裁剪）+ 点击查看大图（灯箱），每张只保留标题
- 📐 教育背景 / 工作经历 / 项目经历 三段式展示
- 📱 响应式布局，手机也能正常看；移动端导航随滚动自动定位当前版块，语言按钮只显示当前语言
- ♿ 支持系统「减少动效」偏好，语义化标签

## 目录结构

```
portfolio/
├── index.html            # 页面主体（改这里的内容）
├── README.md             # 本文件
└── assets/
    ├── css/style.css     # 全部样式
    ├── js/main.js        # 交互逻辑（一般不用改）
    └── images/           # 图片资源
        ├── avatar.jpg               # 头像
        ├── work-1.jpg ~ work-6.jpg  # 作品图
        ├── avatar-placeholder.svg   # 头像兜底占位（缺失时自动显示）
        └── placeholder.svg          # 作品兜底占位（缺失时自动显示）
```

## 🛠 作品区怎么改

作品区在 `index.html` 的 `<section id="portfolio">` 里，每张作品是一个 `<figure class="work">`，编号 `work-N` 即展示顺序：

```html
<figure class="work reveal" data-caption-zh="DLP 智能大灯设计 #1" data-caption-en="DLP Smart Headlamp Design #1">
  <div class="work-thumb">
    <img src="assets/images/work-1.jpg" alt="DLP 智能大灯设计 #1" loading="lazy"
         onerror="this.onerror=null;this.src='assets/images/placeholder.svg'" />
    <div class="work-overlay"><span data-zh="点击查看" data-en="Click to view"></span></div>
  </div>
  <figcaption>
    <h3 data-zh="DLP 智能大灯设计 #1" data-en="DLP Smart Headlamp Design #1"></h3>
  </figcaption>
</figure>
```

| 想改什么 | 怎么改 |
| --- | --- |
| 换图片 | 直接替换 `assets/images/work-N.jpg`，命名保持不变即可 |
| 改顺序 | 重新编号图片（work-N）并同步调整 `<figure>` 顺序，编号即展示顺序 |
| 改标题 | 改 `<figcaption>` 里的 `<h3>`，中英文分别在 `data-zh` / `data-en` |
| 改点击大图时的说明 | 改 `<figure>` 上的 `data-caption-zh` / `data-caption-en` |
| 加作品 | 整段复制一个 `<figure>…</figure>` 贴到最后一个后面，编号（work-N、标题）顺延 |
| 删作品 | 删掉对应的一段 `<figure>…</figure>`，并删除对应图片 |
| 改行列布局 | `assets/css/style.css` 的 `.work-grid`，改 `grid-template-columns: repeat(3, 1fr)` 里的数字：`2`=两列、`3`=三列、`4`=四列 |
| 改占位框比例 | 同一文件 `.work-thumb` 的 `aspect-ratio: 4 / 3`（如 `1 / 1` 正方形） |
| 改占位底色 | `.work-thumb` 的 `background`，默认纯白 `#fff` |

> 缩略图用 `object-fit: contain`，图片**等比缩放、整图显示**，不会裁剪；长宽比与占位框不一致时，多出的边距会显示占位底色（白）。
>
> 所有面向用户的文字都同时维护 `data-zh`（中文）和 `data-en`（英文）两个属性，**记得两处都改**（包括时间里的「至今」→ Present）。

## 📱 移动端交互

- 顶部导航在窄屏下可**横向滑动**，滚动页面时高亮项会自动滚到居中位置（`main.js` 的 `scrollActiveIntoView`），始终能看到当前所在版块。
- 语言切换按钮在窄屏下只显示**当前语言**（中文「中」/ 英文「EN」），靠 CSS 用 `.active` 类控制显隐。改按钮结构时保持 `lang-zh` / `lang-en` / `lang-sep` 三个 span 和 JS 的 `active` 高亮逻辑不变。

## 🚀 部署 / 更新

本文件夹是一个 git 仓库，远端为 `https://github.com/Chanwang98/portfolio.git`。GitHub Pages 已配置为自动部署 `main` 分支根目录，站点地址 `https://chanwang98.github.io/portfolio/`。

```bash
git add .
git commit -m "…"
git push
```

- 推送后 1~2 分钟生效，刷新即可。
- 本机直连 `github.com` 网络时好时坏（随机超时）。推送失败就重试一次，一般会成功。`api.github.com`（`gh` 工具用）通常稳定，不要改网络/代理设置。

## 📊 访问数据后台

- 后台地址：`https://chanwang98.github.io/portfolio/admin/`
- 管理员邮箱：`wangyaochen963@126.com`
- 首次使用：在后台点击“首次使用，创建账号”，设置至少 8 位密码，并完成邮箱验证。
- 忘记密码：在登录页点击“忘记密码”，邮件验证后可在后台页面设置新密码。
- 数据范围：实时在线人数、今日/区间浏览量、独立访客、平均浏览时长、日期与时段分布、国家/城市、设备以及最近访问记录。
- 隐私：数据库只保存脱敏 IP（如 `116.23.xxx.xxx`）和按日生成的不可逆访客摘要，不保存完整 IP。

访问采集通过 Supabase Edge Functions 完成，数据库表默认拒绝浏览器直接访问；统计接口仅向授权管理员返回数据。数据库结构保存在 `supabase/migrations/`。

Supabase Auth 的 Site URL 与允许跳转地址应设置为 `https://chanwang98.github.io/portfolio/admin/`，确保注册验证与密码重置邮件返回线上后台，而不是本地开发地址。

## ❓ 常见问题

**问：GitHub Pages 一直打不开或更新很慢？**
答：首次部署或更新后通常需要等待 1~5 分钟，刷新即可。

**问：想换主题色 / 字体？**
答：打开 `assets/css/style.css` 顶部的 `:root` 变量，改 `--accent`（主题色）和字体栈即可。

---

MIT License · 手写 HTML/CSS/JS，无任何依赖。
