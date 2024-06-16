const newsContainer = document.getElementById('news-container');
const regionSelect = document.getElementById('region-select');
const navLinks = document.querySelectorAll('.category-link');
const pagination = document.getElementById('pagination');

let currentPage = 1;
const pageSize = 5; // Number of articles per page

document.addEventListener('DOMContentLoaded', () => {
    fetchNews('us', 'general', currentPage);
});

regionSelect.addEventListener('change', () => {
    const region = regionSelect.value;
    const category = document.querySelector('.category-link.active')?.dataset.category || 'general';
    fetchNews(region, category, currentPage);
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(link => link.classList.remove('active'));
        link.classList.add('active');
        const category = link.dataset.category;
        fetchNews(regionSelect.value, category, currentPage);
    });
});

pagination.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        if (event.target.id === 'prev' && currentPage > 1) {
            currentPage--;
        } else if (event.target.id === 'next') {
            currentPage++;
        }
        const region = regionSelect.value;
        const category = document.querySelector('.category-link.active')?.dataset.category || 'general';
        fetchNews(region, category, currentPage);
    }
});

async function fetchNews(region, category, page) {
    newsContainer.innerHTML = '<div class="loader-container"><div class="loader"><div></div><div></div><div></div></div></div>';
    try {
        const response = await fetch(`./data/newsData_${region}_${category}.json`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const articles = paginate(data.articles, page, pageSize);
        displayNews(articles);
        setupPagination(data.articles.length, page);
    } catch (error) {
        newsContainer.innerHTML = `<p>Error fetching news: ${error.message}</p>`;
    }
}

function paginate(array, page, pageSize) {
    return array.slice((page - 1) * pageSize, page * pageSize);
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

function setupPagination(totalItems, currentPage) {
    const totalPages = Math.ceil(totalItems / pageSize);
    pagination.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.id = 'prev';
    prevButton.disabled = currentPage === 1;
    pagination.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.id = 'next';
    nextButton.disabled = currentPage === totalPages;
    pagination.appendChild(nextButton);
}
