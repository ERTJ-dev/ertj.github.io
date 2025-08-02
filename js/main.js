document.addEventListener('DOMContentLoaded', () => {
    fetchArticles();
});

async function fetchArticles() {
    try {
        const response = await fetch('articles/list.json');
        const articles = await response.json();
        displayArticles(articles);
    } catch (error) {
        console.error('加载文章列表失败:', error);
        document.getElementById('articles-container').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>加载文章列表失败</p>
                <button onclick="location.reload()" class="retry-btn">重试</button>
            </div>
        `;
    }
}

function displayArticles(articles) {
    const container = document.getElementById('articles-container');
    container.innerHTML = '';

    articles.forEach(article => {
        const articleEl = document.createElement('div');
        articleEl.className = 'article-card';
        articleEl.innerHTML = `
            <div class="article-info">
                <h3>${article.title}</h3>
                <div class="article-meta">
                    <span>${article.date}</span>
                    <span>${article.category}</span>
                </div>
                <p>${article.excerpt}</p>
                <a href="article.html?id=${article.id}" class="read-more">阅读全文</a>
            </div>
        `;
        container.appendChild(articleEl);
    });
}