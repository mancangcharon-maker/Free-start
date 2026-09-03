# SafeLift 外贸独立站（Hexo + Cloudflare Pages）

## 项目地址
- 域名：safelift.de5.net（Cloudflare Pages 保护）
- 仓库：github.com/mancangcharon-maker/Free-start（gh-pages 分支自动部署）
- 主题：`themes/safelift-modern/`（新建的工业风主题，EJS 模板）

## 主题结构
- 4 个核心 page：Home/Products/About/Contact（独立 URL，SEO 友好）
- 产品详情用 `layout: product`（带 front-matter 结构化数据：model/price/features/specs_table/applications）
- 共用 `layout/layout.ejs` 输出 head + 固定顶 nav + footer + JS
- 样式：`source/css/safelift.css`（移植自原型，~900 行）
- 脚本：`source/js/main.js`（移动 nav、scroll 阴影、锚点平滑、表单 demo）

## Hexo 模板里读取 post category
front-matter 的 `category: xxx` 单数字段在 hexo 里会被转成 `categories` 数组。在模板里用：
```ejs
let cat = p.category || (p.categories && p.categories.first && p.categories.first().name) || '';
```

## 注意事项
- 不要让 `.hero` / `.products-hero` 等顶 banner 被 fixed nav 遮挡：加 `margin-top: -68px; padding-top: 128px;`
- hexo 的 `bin/hexo` 是 shell 脚本，不能 `node ./node_modules/.bin/hexo` 跑；要用 `hexo.cmd` 通过 PowerShell
- `source/index/index.md` 与默认 home 冲突，要删掉
