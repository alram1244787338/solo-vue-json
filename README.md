# JSON 格式化工具

JSON 在线格式化、压缩、语法校验、树形可视化，实时错误定位

## 技术栈

Vue 3 + Vite + Composition API + Vitest

## 目录结构

```
.
├── index.html
├── package.json
├── vite.config.js
├── vitest.config.js
├── .gitignore
└── src/
    ├── main.js
    ├── App.vue
    ├── components/
    │   ├── layout/
    │   │   ├── AppHeader.vue
    │   │   └── AppFooter.vue
    │   ├── JsonEditor.vue
    │   ├── JsonViewer.vue
    │   ├── TreeNode.vue
    │   ├── JsonEditorPlaceholder.vue
    │   ├── JsonViewerPlaceholder.vue
    │   └── __tests__/
    │       ├── JsonEditor.test.js
    │       └── TreeNode.test.js
    ├── styles/
    │   └── global.css
    └── utils/
        ├── json.js
        ├── common.js
        └── json.test.js
```

## 安装运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 功能点

- **格式化 / 压缩 / 清空**：一键将 JSON 以 4 空格缩进美化，或去除所有空白字符压缩，支持清空内容
- **实时语法校验**：输入内容变化时即时校验，合法时显示绿色「✓ JSON 有效」
- **错误行号定位**：语法错误时显示红色错误信息并标注具体行号，基于逐字符扫描法精确定位
- **树形可视化**：将 JSON 结构以递归树形方式渲染，支持折叠 / 展开
- **语法高亮**：不同类型分别着色（key 紫色、string 绿色、number 橙色、boolean 蓝色、null 灰色）
- **大 JSON 性能优化**：超过 100 项的数组/对象默认只显示前 20 项，底部「还有 N 项...点击展开全部」

## 测试

```bash
# 运行所有测试
npm test

# 监听模式
npm run test:watch
```

测试覆盖：

- **工具函数**：`format` / `minify` / `validate` / `findErrorPosition` — 包含正常 JSON、嵌套数组、转义字符、非法 key、尾部逗号、多行错误定位等场景
- **组件渲染**：`TreeNode` 组件的类型展示、折叠展开、大量子节点性能限制；`JsonEditor` 组件的按钮可用状态、tooltip、校验状态展示、格式化/压缩/清空交互
