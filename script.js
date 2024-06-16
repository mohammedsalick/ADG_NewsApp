const apiKey = '7e649d799444495cb6d81271dec4cc4d';
const newsContainer = document.getElementById('news-container');
const regionSelect = document.getElementById('region-select');
const navLinks = document.querySelectorAll('.nav-link');

document.addEventListener('DOMContentLoaded', () => {
    fetchNews('us', 'general');
});

regionSelect.addEventListener('change', () => {
    const region = regionSelect.value;
    const category = document.querySelector('.nav-link.active')?.dataset.category || 'general';
    fetchNews(region, category);
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(link => link.classList.remove('active'));
        link.classList.add('active');
        const category = link.dataset.category;
        fetchNews(regionSelect.value, category);
    });
});

async function fetchNews(region, category) {
    newsContainer.innerHTML = '<div class="loader-container"><div class="loader"><div></div><div></div><div></div></div></div>';
    let url = `https://newsapi.org/v2/top-headlines?apiKey=${apiKey}&category=${category}`;
    
    if (region !== 'world') {
        url += `&country=${region}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        displayNews(data.articles);
    } catch (error) {
        newsContainer.innerHTML = `<p>Error fetching news: ${error.message}</p>`;
    }
}

function displayNews(articles) {
    newsContainer.innerHTML = '';
    articles.forEach(article => {
        const card = document.createElement('div');
        card.classList.add('news-card', 'item-enter');
        card.innerHTML = `
            <div class="news-image" style="background-image: url('${article.urlToImage || 'https://via.placeholder.com/300x200'}');"></div>
            <div class="news-content">
                <h2 class="news-title">${article.title}</h2>
                <p class="news-description">${article.description || ''}</p>
            </div>
        `;
        newsContainer.appendChild(card);

        requestAnimationFrame(() => {
            card.classList.add('item-enter-active');
        });

        card.addEventListener('animationend', () => {
            card.classList.remove('item-enter', 'item-enter-active');
        });
    });
}
