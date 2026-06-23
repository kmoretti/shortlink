const fs = require("fs");
const path = require("path");

const linksFile = path.join(__dirname, "links.json");
const outputDir = path.join(__dirname, "dist");

// 读取短链配置
const links = JSON.parse(fs.readFileSync(linksFile, "utf-8"));

// 清理并创建输出目录
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir, { recursive: true });

// 生成404页面
function generate404Page(shortPath) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>404 - 短链不存在</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh;
      background: #f8f9fa;
      color: #333;
    }
    .card {
      text-align: center;
      padding: 3rem 2rem;
      background: #fff;
      border-radius: 1rem;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      max-width: 400px;
      width: 90%;
    }
    .code { font-size: 5rem; font-weight: 700; color: #e74c3c; line-height: 1; }
    h1 { margin: 1rem 0 0.5rem; font-size: 1.4rem; }
    p { color: #888; font-size: 0.95rem; margin-bottom: 1.5rem; }
    code { background: #f0f0f0; padding: 0.15em 0.4em; border-radius: 4px; }
    a {
      display: inline-block;
      padding: 0.6rem 1.4rem;
      background: #333;
      color: #fff;
      border-radius: 0.5rem;
      text-decoration: none;
      font-size: 0.9rem;
      transition: background 0.2s;
    }
    a:hover { background: #555; }
  </style>
</head>
<body>
  <div class="card">
    <div class="code">404</div>
    <h1>短链不存在</h1>
    <p>路径 <code>${shortPath}</code> 没有对应的跳转目标。</p>
    <a href="https://yourblog.example.com">回到博客 →</a>
  </div>
</body>
</html>`;
}

// 生成跳转页面
function generateRedirectPage(targetUrl) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="refresh" content="0; url=${targetUrl}" />
  <title>正在跳转...</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh;
      background: #f8f9fa;
      color: #333;
    }
    .card {
      text-align: center;
      padding: 3rem 2rem;
      background: #fff;
      border-radius: 1rem;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      max-width: 400px;
      width: 90%;
    }
    p { color: #666; font-size: 1rem; margin-bottom: 1.5rem; }
    a {
      display: inline-block;
      padding: 0.6rem 1.4rem;
      background: #333;
      color: #fff;
      border-radius: 0.5rem;
      text-decoration: none;
      font-size: 0.9rem;
      transition: background 0.2s;
    }
    a:hover { background: #555; }
  </style>
</head>
<body>
  <div class="card">
    <p>正在跳转到 <a href="${targetUrl}">${targetUrl}</a></p>
    <script>window.location.replace("${targetUrl}");</script>
  </div>
</body>
</html>`;
}

// 生成选择页面
function generateChoicePage(config) {
  const optionsHtml = config.options
    .map((option, index) => {
      return `
      <a href="${option.url}" class="option-card" data-index="${index}">
        <div class="option-label">${option.label}</div>
        <div class="option-desc">${option.description}</div>
      </a>`;
    })
    .join("\n      ");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${config.title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh;
      background: #f8f9fa;
      color: #333;
      padding: 2rem 1rem;
    }
    .container {
      text-align: center;
      max-width: 500px;
      width: 100%;
    }
    h1 {
      font-size: 1.8rem;
      margin-bottom: 2rem;
      color: #222;
    }
    .option-card {
      display: block;
      padding: 1.5rem;
      margin-bottom: 1rem;
      background: #fff;
      border-radius: 0.75rem;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      text-decoration: none;
      color: #333;
      transition: all 0.2s ease;
      border: 2px solid transparent;
    }
    .option-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
      border-color: #333;
    }
    .option-label {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 0.4rem;
    }
    .option-desc {
      font-size: 0.9rem;
      color: #888;
    }
    .back-link {
      display: inline-block;
      margin-top: 1.5rem;
      padding: 0.5rem 1rem;
      color: #666;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.2s;
    }
    .back-link:hover {
      color: #333;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${config.title}</h1>
    ${optionsHtml}
    <a href="https://yourblog.example.com" class="back-link">← 回到博客</a>
  </div>
</body>
</html>`;
}

// 生成短链展示页面（根目录）
function generateIndexPage(links) {
  const linkCards = Object.entries(links)
    .map(([path, target]) => {
      let displayUrl;
      let type = "redirect";
      let icon = "→";

      if (typeof target === "object" && target.type === "choice") {
        displayUrl = target.title;
        type = "choice";
        icon = "◆";
      } else {
        try {
          const url = new URL(target);
          displayUrl =
            url.hostname +
            url.pathname.slice(0, 20) +
            (url.pathname.length > 20 ? "..." : "");
        } catch {
          displayUrl =
            target.length > 35 ? target.slice(0, 35) + "..." : target;
        }
      }

      const pathLabel = path.startsWith("/") ? path : "/" + path;

      return `
      <a href="${path}" class="link-card" data-type="${type}">
        <span class="card-icon">${icon}</span>
        <div class="card-content">
          <span class="card-path">${pathLabel}</span>
          <span class="card-target">${displayUrl}</span>
        </div>
        <span class="card-arrow">↗</span>
      </a>`;
    })
    .join("\n");

  const linkCount = Object.keys(links).length;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Shortlink Directory</title>
  <link rel="icon" href="/favicon.ico">
  <script defer src="https://busuanzi.9420.ltd/js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-primary: #faf9f7;
      --bg-secondary: #f0eeeb;
      --text-primary: #1a1a1a;
      --text-secondary: #666;
      --text-muted: #999;
      --accent: #dc2626;
      --accent-hover: #b91c1c;
      --border: #e5e3e0;
      --card-bg: #fff;
      --shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06);
      --shadow-hover: 0 2px 6px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.1);
    }
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    html {
      font-size: 16px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    body {
      font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      background: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
    }
    
    /* Header */
    .header {
      background: var(--card-bg);
      border-bottom: 1px solid var(--border);
      padding: 3rem 1.5rem 2rem;
    }
    
    .header-inner {
      max-width: 720px;
      margin: 0 auto;
    }
    
    .header-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    
    .header-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .logo {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
    }
    
    .logo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }
    
    .site-title {
      font-size: 1.5rem;
      font-weight: 600;
      letter-spacing: -0.02em;
    }
    
    .header-desc {
      font-size: 1.0625rem;
      color: var(--text-secondary);
      max-width: 480px;
      line-height: 1.7;
    }
    
    /* Theme Toggle Button */
    .theme-toggle {
      width: 44px;
      height: 44px;
      border: 1px solid var(--border);
      border-radius: 10px;
      background: var(--card-bg);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }
    
    .theme-toggle:hover {
      border-color: var(--text-secondary);
      transform: translateY(-1px);
    }
    
    .theme-toggle:active {
      transform: translateY(0);
    }
    
    .theme-toggle svg {
      width: 22px;
      height: 22px;
      stroke: var(--text-primary);
      transition: transform 0.3s ease;
    }
    
    .theme-toggle:hover svg {
      transform: rotate(15deg);
    }
    
    [data-theme="dark"] .theme-toggle .icon-sun,
    :root:not([data-theme]) .theme-toggle .icon-sun,
    :root[data-theme="light"] .theme-toggle .icon-moon {
      display: none;
    }
    
    :root[data-theme="dark"] .theme-toggle .icon-moon {
      display: block;
    }
    
    /* Stats Bar */
    .stats-bar {
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border);
      padding: 1rem 1.5rem;
    }
    
    .stats-inner {
      max-width: 720px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 2rem;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    
    .stat {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .stat-value {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 500;
      color: var(--text-primary);
      font-size: 1rem;
    }
    
    .stat-label {
      color: var(--text-muted);
    }
    
    /* Main Content */
    .main {
      padding: 2rem 1.5rem 4rem;
    }
    
    .container {
      max-width: 720px;
      margin: 0 auto;
    }
    
    .section-title {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      margin-bottom: 1rem;
      padding-left: 0.5rem;
    }
    
    /* Link Grid */
    .link-grid {
      display: grid;
      gap: 0.75rem;
    }
    
    .link-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.125rem 1.25rem;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      text-decoration: none;
      color: inherit;
      transition: all 0.2s ease;
      box-shadow: var(--shadow);
    }
    
    .link-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-hover);
      border-color: #d0cec9;
    }
    
    .link-card:active {
      transform: translateY(0);
    }
    
    .card-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-secondary);
      border-radius: 10px;
      font-size: 1rem;
      color: var(--text-secondary);
      flex-shrink: 0;
    }
    
    .link-card[data-type="choice"] .card-icon {
      background: #fef3c7;
      color: #d97706;
    }
    
    .card-content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .card-path {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--text-primary);
      letter-spacing: -0.01em;
    }
    
    .card-target {
      font-size: 0.8125rem;
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .card-arrow {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      font-size: 1.125rem;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }
    
    .link-card:hover .card-arrow {
      color: var(--accent);
      transform: translate(2px, -2px);
    }
    
    /* Footer */
    .footer {
      border-top: 1px solid var(--border);
      padding: 2rem 1.5rem;
      text-align: center;
    }
    
    .footer-inner {
      max-width: 720px;
      margin: 0 auto;
    }
    
    .footer-text {
      font-size: 0.8125rem;
      color: var(--text-muted);
    }
    
    .footer-text a {
      color: var(--text-secondary);
      text-decoration: none;
      border-bottom: 1px solid var(--border);
      transition: all 0.2s;
    }
    
    .footer-text a:hover {
      color: var(--text-primary);
      border-color: var(--text-secondary);
    }
    
    /* Responsive */
    @media (max-width: 640px) {
      .header {
        padding: 2rem 1rem 1.5rem;
      }
      
      .site-title {
        font-size: 1.25rem;
      }
      
      .header-desc {
        font-size: 0.9375rem;
      }
      
      .theme-toggle {
        width: 40px;
        height: 40px;
        border-radius: 8px;
      }
      
      .theme-toggle svg {
        width: 20px;
        height: 20px;
      }
      
      .stats-bar {
        padding: 0.875rem 1rem;
      }
      
      .stats-inner {
        gap: 1.5rem;
      }
      
      .main {
        padding: 1.5rem 1rem 3rem;
      }
      
      .link-card {
        padding: 1rem;
        gap: 0.875rem;
      }
      
      .card-icon {
        width: 36px;
        height: 36px;
        border-radius: 8px;
      }
      
      .card-path {
        font-size: 0.875rem;
      }
      
      .card-target {
        font-size: 0.75rem;
      }
    }
    
    /* Manual dark mode */
    [data-theme="dark"] {
      --bg-primary: #0f0f0f;
      --bg-secondary: #1a1a1a;
      --text-primary: #f5f5f5;
      --text-secondary: #a0a0a0;
      --text-muted: #666;
      --accent: #ef4444;
      --accent-hover: #dc2626;
      --border: #2a2a2a;
      --card-bg: #141414;
      --shadow: 0 1px 3px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4);
      --shadow-hover: 0 2px 6px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.5);
    }
    
    [data-theme="dark"] .link-card[data-type="choice"] .card-icon {
      background: #3d2a0f;
      color: #fbbf24;
    }
    
    /* System dark mode preference (when no manual override) */
    @media (prefers-color-scheme: dark) {
      :root:not([data-theme]) {
        --bg-primary: #0f0f0f;
        --bg-secondary: #1a1a1a;
        --text-primary: #f5f5f5;
        --text-secondary: #a0a0a0;
        --text-muted: #666;
        --accent: #ef4444;
        --accent-hover: #dc2626;
        --border: #2a2a2a;
        --card-bg: #141414;
        --shadow: 0 1px 3px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4);
        --shadow-hover: 0 2px 6px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.5);
      }
      
      :root:not([data-theme]) .link-card[data-type="choice"] .card-icon {
        background: #3d2a0f;
        color: #fbbf24;
      }
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="header-inner">
      <div class="header-top">
        <div class="header-brand">
          <div class="logo"><img src="https://jsd.268682.xyz/gh/Kemeow0815/img@main/img/preloader.gif" alt="Logo" width="40" height="40"></div>
          <h1 class="site-title">Shortlink Directory</h1>
        </div>
        <button class="theme-toggle" id="themeToggle" aria-label="切换主题">
          <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.2 4.2l1.4 1.4m12.8 12.8l1.4 1.4M1 12h2m18 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></g></svg>
          <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke-width="2"><path d="M20.958 15.325c.204-.486-.379-.9-.868-.684a7.7 7.7 0 0 1-3.101.648c-4.185 0-7.577-3.324-7.577-7.425a7.3 7.3 0 0 1 1.134-3.91c.284-.448-.057-1.068-.577-.936C5.96 4.041 3 7.613 3 11.862C3 16.909 7.175 21 12.326 21c3.9 0 7.24-2.345 8.632-5.675Z"/><path d="M15.611 3.103c-.53-.354-1.162.278-.809.808l.63.945a2.33 2.33 0 0 1 0 2.588l-.63.945c-.353.53.28 1.162.81.808l.944-.63a2.33 2.33 0 0 1 2.588 0l.945.63c.53.354 1.162-.278.808-.808l-.63-.945a2.33 2.33 0 0 1 0-2.588l.63-.945c.354-.53-.278-1.162-.809-.808l-.944.63a2.33 2.33 0 0 1-2.588 0z"/></g></svg>
        </button>
      </div>
      <p class="header-desc">个人短链导航页面，点击下方任意卡片即可跳转至对应链接。</p>
    </div>
  </header>
  
  <div class="stats-bar">
    <div class="stats-inner">
      <div class="stat">
        <span class="stat-value">${linkCount}</span>
        <span class="stat-label">短链</span>
      </div>
      <div class="stat">
        <span class="stat-value" id="busuanzi_site_pv">加载中...</span>
        <span class="stat-label">总访问</span>
      </div>
      <div class="stat">
        <span class="stat-value" id="busuanzi_site_uv">加载中...</span>
        <span class="stat-label">总访客</span>
      </div>
    </div>
  </div>
  
  <main class="main">
    <div class="container">
      <h2 class="section-title">所有链接</h2>
      <div class="link-grid">
        ${linkCards}
      </div>
    </div>
  </main>
  
  <footer class="footer">
    <div class="footer-inner">
      <p class="footer-text">
        Powered by <a href="https://pages.cloudflare.com/" target="_blank">Cloudflare Pages</a> · 
        <a href="https://github.com/moretti815" target="_blank">GitHub</a>
      </p>
    </div>
  </footer>
  
  <script>
    (function() {
      const themeToggle = document.getElementById('themeToggle');
      const root = document.documentElement;
      const statsTargets = {
        pv: document.getElementById('busuanzi_site_pv'),
        uv: document.getElementById('busuanzi_site_uv')
      };
      
      function isNumericText(value) {
        return /^\d+$/.test((value || '').trim());
      }
      
      function sanitizeStat(target) {
        const text = target.textContent || '';
        target.textContent = isNumericText(text) ? text.trim() : '--';
      }
      
      function loadStats() {
        statsTargets.pv.textContent = '加载中...';
        statsTargets.uv.textContent = '加载中...';
        window.setTimeout(function() {
          sanitizeStat(statsTargets.pv);
          sanitizeStat(statsTargets.uv);
        }, 1500);
      }
      
      // Get saved theme or default to system preference
      const savedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Apply initial theme
      if (savedTheme) {
        root.setAttribute('data-theme', savedTheme);
      } else if (systemPrefersDark) {
        root.setAttribute('data-theme', 'dark');
      }
      
      // Toggle theme on button click
      themeToggle.addEventListener('click', function() {
        const currentTheme = root.getAttribute('data-theme');
        let newTheme;
        
        if (currentTheme === 'dark') {
          newTheme = 'light';
        } else if (currentTheme === 'light') {
          newTheme = 'dark';
        } else {
          // No explicit theme set, check system preference
          newTheme = systemPrefersDark ? 'light' : 'dark';
        }
        
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
      });
      
      // Listen for system theme changes (only when no manual override)
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
          root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
      });
      
      loadStats();
    })();
  </script>
</body>
</html>`;
}

// 生成所有短链页面
console.log("开始生成静态页面...");

Object.entries(links).forEach(([shortPath, target]) => {
  // 处理路径：去掉开头的斜杠
  const cleanPath = shortPath.startsWith("/") ? shortPath.slice(1) : shortPath;

  // 创建目录结构
  const targetDir = path.join(outputDir, cleanPath);
  fs.mkdirSync(targetDir, { recursive: true });

  let htmlContent;

  // 检查是否为选择页面配置
  if (typeof target === "object" && target.type === "choice") {
    htmlContent = generateChoicePage(target);
    console.log(
      `✓ 生成: /${cleanPath}/index.html -> 选择页面 (${target.title})`,
    );
  } else {
    // 普通重定向
    htmlContent = generateRedirectPage(target);
    console.log(`✓ 生成: /${cleanPath}/index.html -> ${target}`);
  }

  const htmlFilePath = path.join(targetDir, "index.html");
  fs.writeFileSync(htmlFilePath, htmlContent, "utf-8");
});

// 生成根目录 index.html 作为短链展示页面
const indexPageHtml = generateIndexPage(links);
fs.writeFileSync(path.join(outputDir, "index.html"), indexPageHtml, "utf-8");
console.log("✓ 生成: /index.html -> 短链展示页面");

// 生成自定义404页面（Cloudflare Pages会使用404.html）
const notFoundHtml = generate404Page("/不存在的短链");
fs.writeFileSync(path.join(outputDir, "404.html"), notFoundHtml, "utf-8");
console.log("✓ 生成: 404.html");

console.log(`\n完成！共生成 ${Object.keys(links).length} 个短链页面`);
console.log(`输出目录: ${outputDir}`);
