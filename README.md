# BOMESC HSE资讯平台

天津博迈科海洋工程有限公司 - HSE/EHS动态资讯聚合平台

## 在线访问

🔗 **https://alifens19810506.github.io/bomesc-hse-platform**

## 功能特性

- ✅ 7大HSE分类资讯聚合
- ✅ 自动去重，TOP50精选
- ✅ 高中低重要度分级
- ✅ 智能分析与适用性评估
- ✅ 分组展示，柔和配色
- ✅ 搜索与筛选功能
- ⏰ 工作日9:00自动更新

## 技术架构

- 前端: HTML5 + Tailwind CSS
- 托管: GitHub Pages
- 爬虫: GitHub Actions

## 定时更新

爬虫配置: `.github/workflows/deploy.yml`

```yaml
schedule:
  - cron: '0 1 * * 1-5'  # 工作日 9:00
```

## License

MIT - 天津博迈科海洋工程有限公司