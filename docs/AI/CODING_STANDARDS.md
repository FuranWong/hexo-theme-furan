# 编码规范

## Pug 规范

### 格式

- 缩进：**2 空格**（与 Pug 官方一致）
- 属性顺序：`id` → `class` → `data-*` → 其他属性
- 每个 partial 只做一件事，单一职责
- Mixin 文件与模板分离，放在 `layout/mixin/` 下

### 原则

- 模板文件**只包含结构**，不写内联样式
- 不写 `<style>` 标签，不写 `style=""` 属性
- 所有样式通过 class 引用原子 CSS
- 数据展示使用 Hexo 提供的变量，不硬编码

```pug
//- ✅ 正确
article.post-card(data-post-id=post._id)
  h2.post-card__title= post.title

//- ❌ 错误
article(style="margin: 16px; color: #333")
  h2= post.title
```

### 结构约定

```
layout/
├── layout.pug              # 根布局骨架
├── mixin/                  # 可复用 Mixin
│   └── post-card.pug       # 文章卡片 Mixin
├── partial/
│   ├── head.pug            # <head> 元数据
│   ├── header.pug          # 固定顶栏
│   ├── sidebar.pug         # 左侧个人信息区
│   ├── sidebar/
│   │   ├── profile.pug     # 头像 + 姓名 + 简介卡片
│   │   ├── social.pug      # 社交链接卡片
│   │   └── taxonomy.pug    # 分类/标签云卡片
│   ├── pagination.pug      # 分页导航卡片
│   ├── giscus.pug          # Giscus 评论区卡片
│   └── footer.pug          # 版权信息
├── index.pug               # 首页
├── post.pug                # 文章详情页
├── page.pug                # 独立页面
├── archive.pug             # 归档页
├── category.pug            # 分类页
└── tag.pug                 # 标签页
```

---

## PostCSS / CSS 规范

### 层级架构

| 层级 | 文件位置 | 职责 | 能否产生 CSS 规则 |
|---|---|---|---|
| tokens | `css/tokens/` | 纯 CSS 变量定义 | ✅ 只定义变量 |
| atoms | `css/atoms/` | 基础原子规则（单一属性） | ✅ 单一规则 |
| components | `css/components/` | 组合原子形成组件 | ✅ 组合规则 |
| layout | `css/layout/` | 页面级大布局 | ✅ 网格/响应式 |

### 规则

- 使用 `@import` 组织文件，入口为 `main.css`
- 命名：全小写 + 连字符（BEM 风格）
- **所有颜色必须引用 CSS 变量，绝不硬编码色值**
- 原子文件不产生组件级样式，只定义可复用的基础规则
- 禁止跨模块样式引用（`header.css` 不操作 `.sidebar` 的样式）

```css
/* ✅ 正确 */
.post-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
}

/* ❌ 错误 */
.post-card {
  background: #1e1e2e;
  border: 1px solid #6c7086;
}
```

### 文件结构

```
source/css/
├── tokens/
│   ├── latte.css           # Catppuccin Latte CSS 变量
│   ├── frappe.css          # Catppuccin Frappé
│   ├── macchiato.css       # Catppuccin Macchiato
│   └── mocha.css           # Catppuccin Mocha
├── atoms/
│   ├── reset.css           # 基础重置
│   ├── typography.css      # 排版原子
│   ├── spacing.css         # 间距原子
│   ├── card.css            # 卡片容器原子
│   ├── button.css          # 按钮原子
│   └── link.css            # 链接原子
├── components/
│   ├── header.css          # 顶栏布局
│   ├── sidebar.css         # 侧边栏布局
│   ├── post-list.css       # 文章列表
│   ├── post-detail.css     # 文章详情
│   ├── giscus.css          # 评论卡片
│   └── pagination.css      # 分页
├── layout/
│   ├── grid.css            # 主网格布局
│   └── responsive.css      # 响应式断点
└── main.css                # @import 聚合入口
```

---

## JavaScript 规范

### 原则

- **原生 JS**，不引入任何框架
- 无 jQuery 依赖
- 每个功能独立为一个模块文件
- DOM 操作通过 `data-*` 属性选择，不依赖 class

### 模块划分

| 文件 | 职责 |
|---|---|
| `theme-switcher.js` | 主题切换（flavor + accent） |
| `mobile-nav.js` | 移动端汉堡菜单交互 |
| `main.js` | 入口，组合各模块 |

```js
// ✅ 正确：通过 data 属性选择
document.querySelector('[data-theme-toggle]')

// ❌ 错误：通过 class 选择（class 可能因样式重构而改变）
document.querySelector('.theme-toggle-btn')
```

---

## i18n 规范

### 原则

- 所有可见文案必须通过 i18n 变量渲染
- 新增文案时**同步更新所有语言文件**
- 语言文件位置：`languages/zh-CN.yml` `languages/en.yml` 等

### Pug 中使用

```pug
span= __('title.home')
```

---

## 资源引用规范

### 静态资源

- 主题静态资源放在 `source/` 下
- 用户自定义资源（头像、favicon 等）通过 `_config.yml` 配置路径
- 不引入大型第三方库 CDN，优先使用内联或轻量方案

### 图片格式

- 图标优先 SVG（内联或文件）
- 位图使用 WebP，提供 PNG 降级