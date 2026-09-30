# Catppuccin 色彩体系

## 概述

本项目使用 Catppuccin 配色方案，包含 **4 种风味 (flavors)** × **14 种强调色 (accents)**。

---

## 四种风味

| Flavor | 风格 | 适用场景 |
|---|---|---|
| **Latte** | 浅色暖调 | 日间/亮色模式 |
| **Frappé** | 中暗冷调 | 过渡/柔和暗色 |
| **Macchiato** | 暗色暖调 | 夜间暗色模式 |
| **Mocha** | 深暗冷调 | 极致暗色模式 |

---

## 十四种强调色

`rosewater` `flamingo` `pink` `mauve` `red` `maroon` `peach` `yellow` `green` `teal` `sky` `sapphire` `blue` `lavender`

每个 flavor 下这些颜色有不同的 hex 值。

---

## CSS 变量体系

### 底层令牌（tokens/*.css）

每个 flavor 文件定义完整的 Catppuccin 调色板，命名规则：`--ctp-{color}`

**示例（Mocha）：**

```css
[data-theme="mocha"] {
  --ctp-base:        #1e1e2e;
  --ctp-mantle:      #181825;
  --ctp-crust:       #11111b;
  --ctp-text:        #cdd6f4;
  --ctp-subtext0:    #a6adc8;
  --ctp-overlay0:    #6c7086;
  --ctp-surface0:    #313244;

  --ctp-rosewater:   #f5e0dc;
  --ctp-flamingo:    #f2cdcd;
  --ctp-pink:        #f5c2e7;
  --ctp-mauve:       #cba6f7;
  --ctp-red:         #f38ba8;
  --ctp-maroon:      #eba0ac;
  --ctp-peach:       #fab387;
  --ctp-yellow:      #f9e2af;
  --ctp-green:       #a6e3a1;
  --ctp-teal:        #94e2d5;
  --ctp-sky:         #89dceb;
  --ctp-sapphire:    #74c7ec;
  --ctp-blue:        #89b4fa;
  --ctp-lavender:    #b4befe;
}
```

### 语义层映射（在 base/root 文件中定义）

```css
:root {
  --accent:          var(--ctp-mauve);      /* 用户可在 _config.yml 中修改映射 */
  --bg-primary:      var(--ctp-base);
  --bg-secondary:    var(--ctp-mantle);
  --bg-card:         var(--ctp-surface0);
  --text-primary:    var(--ctp-text);
  --text-secondary:  var(--ctp-subtext0);
  --border:          var(--ctp-overlay0);
}
```

---

## 变量使用层级

```
tokens/*.css          → 定义 --ctp-* 原始色值（不可修改）
    ↓
base/semantic.css     → 映射 --ctp-* → 语义变量（可修改映射关系）
    ↓
atoms/*.css           → 使用语义变量定义原子规则
components/*.css      → 使用语义变量定义组件规则
layout/*.css          → 使用语义变量定义布局规则
```

---

## 修改强调色

用户在 `_config.yml` 中设置 `appearance.default_accent` 后，Hexo 生成一段内联 CSS 或通过脚本修改 `--accent` 变量的值：

```css
:root {
  --accent: var(--ctp-green);  /* 由配置生成，覆盖默认的 mauve */
}
```

---

## 约束

- **`tokens/*.css` 中的色值不可修改**，它们来自 Catppuccin 官方定义
- 所有业务样式**只使用语义变量**，不直接引用 `--ctp-*`
- 如需添加新的语义变量，在语义层文件中新增，并从 `--ctp-*` 映射