# 锅边笔记 · 网页与 Android

网页：https://chanwang98.github.io/portfolio/recipes/

## 使用与同步

食材、备菜、全部烹饪步骤直接展开；支持菜谱搜索分类、火候/时间/锅内状态、今日菜单、菜品自适应配色、步骤排序、计时、常亮和 JSON 备份。

点「同步」注册或登录。新账号按邮件完成验证；网页版和 App 使用同一个邮箱密码。在原来保存菜谱的浏览器中点一次「迁移到此账号」，迁移已有本地记录。迁移入口仅针对未登录时原有数据，导入备份也可用于迁移。

登录后，菜谱、配色、每日菜单成员、勾选状态和草稿自动同步。修改后上传、前台约10秒轮询、恢复网络及返回前台时同步。App 内置页面资源，离线可查看编辑。网页仍需要网络加载页面。未登录可本机使用；清理数据前应备份。

同时修改时以云端最后接收版本为准，已上传的历史版本保留，可在「历史版本」恢复最近100条中的菜谱为副本。常亮、计时进度、滚动位置为设备本地行为。

## 实现

- recipes/index.html：共用 UI、离线缓存与功能。
- recipes/cloud.js：由 kitchen-android/cloud-entry.js 打包的 Supabase/Capacitor 集成。
- recipes/kitchen-schema.sql：数据库结构参考；已通过 Supabase migration 应用，不应重复直接运行。
- kitchen-android/：Capacitor 8.6 Android 工程、固定依赖及锁文件。
- .github/workflows/kitchen-android.yml：编译未签名 release APK，签名在私有环境完成，密钥不放 GitHub。

云端使用恢复后的 duwwzswqlgocohowmybb 项目中的 kitchen_events（不可变事件）和 kitchen_latest（security_invoker 视图）。每个事件有用户ID和幂等操作ID，RLS仅允许该用户读写，禁止客户端修改或删除既有历史。前端只用 publishable key。

## 验证与限制

已通过安卓 release 构建、APK签名校验、打包资源一致性校验、浏览器同步入口检查、离线队列及双客户端逻辑模拟测试、数据库本人读写/幂等重试/跨账号隔离事务测试。

尚未进行真实Android设备运行及用户真实账号的双设备登录验证。保持页面/App打开时同步；后台运行和锁屏计时不作保证。Supabase 免费项目若因不活跃暂停，需恢复后继续同步。

数据库顾问未发现新增表RLS问题；项目既有密码泄露检测未开启，说明见 [Supabase 密码保护](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)。本次未改动项目级身份验证策略。
