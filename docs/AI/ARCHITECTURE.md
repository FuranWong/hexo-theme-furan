# 架构说明

## 技术栈

| 层 | 技术 |
|---|---|
| 模板引擎 | Pug（`hexo-renderer-pug`） |
| CSS 处理 | PostCSS（`postcss-import` + `postcss-nesting` + `autoprefixer` + `cssnano`） |
| 主题切换 | `data-theme` 属性 + localStorage |
| 评论系统 | Giscus（GitHub Discussions 驱动） |
| 语法高亮 | Prism.js |
| 灯箱 | Fancybox |
| 图标 | 内联 SVG |

---

## 页面布局

```
┌──────────────────────────────────────────────┐
│  fixed header（标题栏 + 导航 + 主题切换按钮）   │
├──────────────┬───────────────────────────────┤
│              │                               │
│  左侧个人信息  │       右侧内容区               │
│              │                               │
│  ┌────────┐  │  ┌─────────────────────────┐  │
│  │ 头像卡片│  │  │  文章卡片 × N            │  │
│  │ 姓名   │  │  │  （首页列表 / 文章详情）   │  │
│  │ 简介   │  │  │                         │  │
│  └────────┘  │  └─────────────────────────┘  │
│  ┌────────┐  │  ┌─────────────────────────┐  │
│  │ 社交链接│  │  │  分页卡片                │  │
│  └────────┘  │  └─────────────────────────┘  │
│  ┌────────┐  │                               │
│  │ 分类/标签│  │                               │
│  └────────┘  │                               │
│              │                               │
├──────────────┴───────────────────────────────┤
│               Giscus 评论卡片                 │
│          （仅文章详情页显示）                   │
└──────────────────────────────────────────────┘
```

### 响应式策略

- 桌面端：左侧个人信息栏 + 右侧内容区，双栏布局
- 移动端（<768px）：个人信息缩入汉堡菜单，内容区全宽

---

## 目录结构

```
themes/furan/
├── _config.yml              # 主题配置
├── languages/               # i18n 翻译文件
│   ├── zh-CN.yml
│   └── en.yml
├── layout/                  # Pug 模板层
│   ├── layout.pug
│   ├── mixin/
│   ├── partial/
│   │   ├── head.pug
│   │   ├── header.pug
│   │   ├── sidebar.pug
│   │   ├── sidebar/
│   │   ├── pagination.pug
│   │   ├── giscus.pug
│   │   └── footer.pug
│   ├── index.pug
│   ├── post.pug
│   ├── page.pug
│   ├── archive.pug
│   ├── category.pug
│   └── tag.pug
├── source/                  # 静态资源
│   ├── css/
│   │   ├── tokens/          # Catppuccin 颜色变量
│   │   ├── atoms/           # 原子样式
│   │   ├── components/      # 组件样式
│   │   ├── layout/          # 页面布局
│   │   └── main.css         # 入口
│   └── js/
│       ├── theme-switcher.js
│       ├── mobile-nav.js
│       └── main.js
├── scripts/                 # Hexo 辅助脚本
├── docs/                    # 开发文档（被 gitignore）
└── package.json
```

---

## 数据流

```
_config.yml (用户配置)
     │
     ▼
Hexo 生成器
     │
     ▼
Pug 模板 ←── languages/*.yml (i18n)
     │
     ▼
HTML 输出（含 data-theme 属性 + class 原子）
     │
     ▼
CSS (PostCSS → 根据 data-theme 切换变量)
     │
     ▼
浏览器渲染 ←── JS (主题切换 / 移动端菜单 / Giscus)
```

---

## 模块依赖关系

```
tokens (CSS 变量层)
  ↑ 被引用
atoms (原子样式层)
  ↑ 被引用
components (组件样式层)
  ↑ 被引用
layout (页面布局层)
```

**核心约束**：依赖方向只能**自下而上**，不可反向引用。

- `atoms` 可引用 `tokens`
- `components` 可引用 `atoms` + `tokens`
- `layout` 可引用所有下层
- 同级之间不可相互引用

---

## 主题配置 (_config.yml) 设计

```yaml
# 外观
appearance:
  default_flavor: latte       # latte | frappe | macchiato | mocha
  default_accent: mauve       # rosewater | flamingo | pink | mauve | red | maroon | peach | yellow | green | teal | sky | sapphire | blue | lavender

# 个人信息
profile:
  avatar: /images/avatar.webp
  name: Your Name
  bio: A short bio
  social:
    github: https://github.com/xxx
    twitter: https://twitter.com/xxx

# 导航
menu:
  Home: /
  Archives: /archives
  About: /about

# 评论
giscus:
  enable: true
  repo: user/repo
  repo_id: xxx
  category: Announcements
  category_id: xxx
  mapping: pathname

# 文章
post:
  fancybox: true
  prismjs:
    theme: default

# 页脚
footer:
  copyright: © 2024 Your Name
  since: 2024
```