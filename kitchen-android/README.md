# 锅边笔记 Android

Capacitor 8.6.0 自用 Android 安装包，最低 Android 7（API 24）。网页资源随包离线安装，无远程页面加载。页面与网页共享 recipes/index.html 和 recipes/cloud.js。

## 构建

Node 22、Java 21、Android SDK 36、Gradle 8.14.3。

```
npm ci
npx esbuild cloud-entry.js --bundle --minify --format=iife --outfile=../recipes/cloud.js
npx cap sync android
gradle -p android assembleRelease
```

GitHub Actions 生成未签名 APK。私有签名密钥不提交仓库；下载后使用持久化密钥签名。后续版本必须使用相同密钥和更高 versionCode，避免卸载重装导致本地未同步记录丢失。

## 功能与限制

- 底部导航、180ms 轻过渡、按钮反馈；遵循减少动态效果设置。
- 原生 FLAG_KEEP_SCREEN_ON 常亮；切后台由系统管理。
- 安卓返回键关闭弹窗、返回菜谱；首页返回最小化。
- 原生文件分享导出 JSON；系统文件选择器导入。
- Supabase 邮箱密码登录。登录后迁移原本机数据需要在同步弹窗中点一次确认；此后自动同步。
- 菜谱、配色、每日菜单成员、清单勾选和草稿同步。前台每10秒及修改/重新联网时同步；关闭 App 不保证后台同步。
- 保存事件使用 UUID 幂等标识，按服务端接收顺序应用。所有已上传菜谱版本不可变，冲突可从最近100条历史恢复为副本。
- 账号数据有 RLS 隔离；前端仅含 publishable key。账号令牌与离线缓存留在设备应用私有空间；安卓系统备份关闭。
- 修改历史会持续增长；自用规模可接受，不自动删除历史。
- 不支持自定义服务端地址、任意导航或后台通知。
- 尚未完成真实 Android 设备运行测试；构建、签名、网页操作及数据库隔离分别验证。
