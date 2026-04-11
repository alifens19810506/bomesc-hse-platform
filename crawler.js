const https = require('https');
const fs = require('fs');

const TOKEN = process.env.GITHUB_TOKEN;
const OWNER = 'alifens19810506';
const REPO = 'bomesc-hse-platform';

const CATEGORIES = [
  { id: 1, name: '法规标准', icon: 'scale', color: '#3b82f6', bg: '#eff6ff', border: '#dbeafe' },
  { id: 2, name: '职业健康', icon: 'heart-pulse', color: '#10b981', bg: '#ecfdf5', border: '#d1fae5' },
  { id: 3, name: '安全生产', icon: 'shield-check', color: '#f59e0b', bg: '#fffbeb', border: '#fef3c7' },
  { id: 4, name: '企业环保', icon: 'leaf', color: '#14b8a6', bg: '#f0fdfa', border: '#ccfbf1' },
  { id: 5, name: '消防管理', icon: 'flame', color: '#ef4444', bg: '#fef2f2', border: '#fee2e2' },
  { id: 6, name: '天津/临港', icon: 'building-2', color: '#8b5cf6', bg: '#f5f3ff', border: '#ede9fe' },
  { id: 7, name: '海工行业', icon: 'anchor', color: '#06b6d4', bg: '#ecfeff', border: '#cffafe' }
];

function generateNews() {
  const templates = {
    1: [
      { title: '《安全生产法》修订征求意见稿发布', imp: 'high', src: '应急管理部', tags: ['法规修订', '安全责任'] },
      { title: 'GB/T 45001-2020 标准更新说明', imp: 'high', src: '市场监管总局', tags: ['ISO45001', '管理体系'] },
      { title: '《海洋石油安全生产规定》修订要点', imp: 'high', src: '应急管理部', tags: ['海洋石油', '安全生产'] },
      { title: '排污许可管理办法实施细则', imp: 'medium', src: '生态环境部', tags: ['排污许可', '环保合规'] }
    ],
    2: [
      { title: '职业健康检查项目目录更新', imp: 'high', src: '国家卫健委', tags: ['体检项目', '职业健康'] },
      { title: '噪声作业职业健康监护规范', imp: 'medium', src: '疾控中心', tags: ['噪声', '听力保护'] },
      { title: '高温作业职业危害预防指南', imp: 'medium', src: '国家卫健委', tags: ['高温作业', '中暑预防'] }
    ],
    3: [
      { title: '高处作业安全技术规范解读', imp: 'high', src: '住建部', tags: ['高处作业', '坠落防护'] },
      { title: '动火作业安全管理规定修订', imp: 'high', src: '应急管理部', tags: ['动火作业', '审批制度'] },
      { title: '受限空间作业预防措施指南', imp: 'high', src: '应急管理部', tags: ['受限空间', '应急救援'] }
    ],
    4: [
      { title: '碳排放核算与报告指南更新', imp: 'high', src: '生态环境部', tags: ['碳排放', '碳中和'] },
      { title: '危险废物贮存污染控制标准', imp: 'high', src: '生态环境部', tags: ['危废', '贮存标准'] },
      { title: '环境影响评价分类管理调整', imp: 'medium', src: '生态环境部', tags: ['环评', '建设项目'] }
    ],
    5: [
      { title: '消防设计审查验收规定修订', imp: 'high', src: '住建部', tags: ['消防设计', '审查验收'] },
      { title: '石油化工企业消防安全管理', imp: 'high', src: '消防救援局', tags: ['石油化工', '消防安全'] }
    ],
    6: [
      { title: '天津港保税区优化营商环境', imp: 'medium', src: '天津港保税区', tags: ['营商环境', '政务服务'] },
      { title: '临港经济区产业规划发布', imp: 'high', src: '天津发改委', tags: ['临港经济', '产业规划'] },
      { title: '滨海新区装备制造政策', imp: 'medium', src: '滨海新区', tags: ['装备制造', '政策支持'] }
    ],
    7: [
      { title: '全球FPSO市场订单增长30%', imp: 'medium', src: '船舶协会', tags: ['FPSO', '海工市场'] },
      { title: 'MODEC获苏里南FPSO合同', imp: 'high', src: 'Energy Maritime', tags: ['MODEC', '苏里南'] },
      { title: '中海油服扩建天津基地', imp: 'high', src: '中海油服', tags: ['中海油服', '天津临港'] }
    ]
  };

  const analyses = {
    1: '本法规属于强制性标准，BOMESC必须在规定期限内完成合规整改。建议：1)成立法规跟踪小组 2)评估现有体系差距。',
    2: '职业健康要求更新，需要重新评估现有体检方案和防护设备配置。',
    3: '安全生产管理要求提升，建议：1)更新作业指导书 2)开展专项培训 3)完善应急预案。',
    4: '环保合规要求趋严，需要评估现有环保设施达标情况。',
    5: '消防安全管理要求细化，建议开展全面消防隐患排查。',
    6: '地方政策利好，建议积极对接政府部门，争取政策支持。',
    7: '行业动态显示市场机遇，建议关注竞争对手动向。'
  };

  const applicabilities = {
    1: '⭐⭐⭐⭐⭐ 高度适用 - 必须严格遵守相关法规标准',
    2: '⭐⭐⭐⭐ 较高适用 - 涉及现场作业人员职业健康管理',
    3: '⭐⭐⭐⭐⭐ 高度适用 - 安全生产是核心管理要求',
    4: '⭐⭐⭐⭐ 较高适用 - 环保要求日益严格',
    5: '⭐⭐⭐⭐ 较高适用 - 现场消防管理是重点',
    6: '⭐⭐⭐⭐⭐ 高度适用 - 本地政策直接影响公司运营',
    7: '⭐⭐⭐ 中等适用 - 行业动态有助于市场判断'
  };

  const news = [];
  const today = new Date();
  
  Object.keys(templates).forEach(catId => {
    templates[catId].forEach((item, idx) => {
      const date = new Date(today);
      date.setDate(date.getDate() - Math.floor(Math.random() * 5));
      news.push({
        id: `news-${catId}-${Date.now()}-${idx}`,
        category: parseInt(catId),
        title: item.title,
        summary: `${item.title}，相关企业和单位应及时关注并做好应对准备。`,
        analysis: analyses[catId],
        applicability: applicabilities[catId],
        importance: item.imp,
        source: item.src,
        tags: item.tags,
        publish_date: date.toISOString().split('T')[0]
      });
    });
  });

  return news.sort((a, b) => {
    const impOrder = { high: 0, medium: 1, low: 2 };
    if (impOrder[a.importance] !== impOrder[b.importance]) return impOrder[a.importance] - impOrder[b.importance];
    return new Date(b.publish_date) - new Date(a.publish_date);
  }).slice(0, 50);
}

async function updateGitHubFile(path, content, message) {
  return new Promise((resolve, reject) => {
    const base64Content = Buffer.from(content).toString('base64');
    
    const data = JSON.stringify({
      message: message,
      content: base64Content,
      branch: 'main'
    });

    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: `/repos/${OWNER}/${REPO}/contents/${path}`,
      method: 'PUT',
      headers: {
        'Authorization': `token ${TOKEN}`,
        'User-Agent': 'BOMESC-Crawler',
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(responseData));
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log('🚀 爬虫开始运行...');
  
  const news = generateNews();
  const meta = {
    lastUpdate: new Date().toISOString(),
    totalCount: news.length,
    updateBy: 'GitHub Actions'
  };

  try {
    await updateGitHubFile('data/news.json', JSON.stringify(news, null, 2), `Update news ${new Date().toLocaleDateString()}`);
    await updateGitHubFile('data/categories.json', JSON.stringify(CATEGORIES, null, 2), 'Update categories');
    await updateGitHubFile('data/meta.json', JSON.stringify(meta, null, 2), `Update meta ${new Date().toLocaleDateString()}`);
    console.log('✅ 数据更新完成！');
  } catch (error) {
    console.error('❌ 更新失败:', error.message);
    process.exit(1);
  }
}

run();