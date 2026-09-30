# Git 规范

## 分支策略

```
main          ← 稳定发布分支（只接受 merge，不直接 commit）
  └── dev     ← 开发主分支
        ├── feat/xxx       ← 新功能
        ├── fix/xxx        ← 修复
        ├── refactor/xxx   ← 重构
        ├── style/xxx      ← 样式调整
        └── chore/xxx      ← 工程化配置
```

> `xxx` 为简短英文描述，使用连字符分隔，如 `feat/add-dark-mode-toggle`

## Commit Message 规范

采用 **Conventional Commits**：

```
<type>(<scope>): <subject>

[body]

[footer]
```

### Type 类型

| type | 说明 | 示例 |
|---|---|---|
| `feat` | 新功能 | `feat(layout): 添加 fixed header 组件` |
| `fix` | 修 bug | `fix(sidebar): 移动端汉堡菜单不展开` |
| `refactor` | 重构 | `refactor(tokens): 重构颜色变量命名` |
| `style` | 样式/格式化 | `style(card): 调整卡片圆角` |
| `docs` | 文档 | `docs(readme): 补充主题配置说明` |
| `chore` | 工程化 | `chore(postcss): 添加 autoprefixer` |
| `perf` | 性能优化 | `perf(pug): 减少模板嵌套层级` |

### Scope 范围

按模块划分：

`layout` `sidebar` `header` `card` `tokens` `postcss` `pug` `giscus` `i18n` `config` `scripts` `docs` `deps`

### 规则

- `subject` 使用中文或英文，保持项目内一致
- `subject` 不以句号结尾，不超过 72 字符
- `body` 说明 **做了什么** 和 **为什么**，非必须
- `footer` 关联 issue，如 `Closes #12`

## Tag 策略

版本号遵循 **SemVer**：

```
v0.1.0  ← 初始可用版本
v0.2.0  ← 新功能
v0.2.1  ← bug 修复
v1.0.0  ← 正式发布
```

每个 tag 附带 release notes，列出该版本的变更摘要。