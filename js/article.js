window.marked = window.marked || {
    parse: function(md) {
        console.warn("使用备用Markdown解析器");
        return md
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/\n/g, '<br>');
    },
    version: '15.0.12-fallback'
};


async function loadArticle(id) {
    try {
        const response = await fetch(`articles/${id}.md`);
        const md = await response.text();
        document.getElementById('article-body').innerHTML = window.marked.parse(md);
    } catch (e) {
        console.error("渲染失败:", e);
        showError(e.message);
    }
}
if (!window.marked) {
  import('https://cdn.jsdelivr.net/npm/marked@4.0.0/marked.min.js')
    .then(() => console.log("CDN加载成功"))
    .catch(e => console.error("CDN加载失败", e));
}
if (typeof marked === 'undefined') {
    console.error('marked 未加载！');
    document.getElementById('article-body').innerHTML = `
        <div class="error">
            <h3>资源加载失败</h3>
            <p>Markdown解析库未正确加载</p>
            <button onclick="window.location.reload()">刷新页面</button>
        </div>
    `;
    throw new Error('marked库未加载');
}
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (articleId) {
        loadArticle(articleId);
    } else {
        showError('未指定文章ID');
    }
});

async function loadArticle(id) {
    try {
        const response = await fetch(`articles/${id}.md`);
        if (!response.ok) throw new Error('文章不存在');
        
        const markdown = await response.text();
        renderArticle(markdown);
    } catch (error) {
        console.error('加载文章失败:', error);
        showError('加载文章时发生错误');
    }
}

function renderArticle(markdown) {
    const titleMatch = markdown.match(/^#\s(.+)/m);
    const title = titleMatch ? titleMatch[1] : '未命名文章';
    
    document.getElementById('article-title').textContent = title;
    document.title = `${title} - ERTJ的博客`;
    
    const html = marked.parse(markdown);
    document.getElementById('article-body').innerHTML = html;
}

function showError(message) {
    const articleBody = document.getElementById('article-body');
    articleBody.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
            <button id="retry-btn" class="retry-btn">重试</button>
        </div>
    `;
    
    document.getElementById('retry-btn').addEventListener('click', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');
        if (articleId) loadArticle(articleId);
    });
async function loadArticle(id) {
    const articleBody = document.getElementById('article-body');
    try {
        articleBody.innerHTML = '<div class="loading"><div class="spinner"></div><p>加载中...</p></div>';
        
        const response = await fetch(`articles/${id}.md`);
        if (!response.ok) throw new Error(`HTTP错误 ${response.status}`);
        
        const markdown = await response.text();
        if (!markdown.trim()) throw new Error('文章内容为空');
        
        renderArticle(markdown);
    } catch (error) {
        console.error('加载失败:', error);
        articleBody.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>加载失败</h3>
                <p>${error.message}</p>
                <div class="error-actions">
                    <button onclick="location.reload()">刷新页面</button>
                    <button onclick="history.back()">返回上页</button>
                </div>
                ${error instanceof TypeError ? '<p>请检查网络连接</p>' : ''}
            </div>
        `;
    }
}
}
