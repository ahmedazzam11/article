// CRUD => Create - Read - Update - Delete

// ===== 1) Get Elements =====
let articleForm = document.getElementById("articleForm");
let articlesList = document.getElementById("articlesList");
let articlesCount = document.getElementById("articlesCount");
let saveChanges = document.getElementById("saveChanges");
let editModal = new bootstrap.Modal(document.getElementById("editModal"));

// ===== 2) Create DB ( Array + localStorage ) =====
// نقرأ المقالات المحفوظة، وإذا لم توجد نبدأ بمصفوفة فارغة
function loadArticles() {
    try {
        let saved = JSON.parse(localStorage.getItem("articles"));
        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        return []; // في حال كانت البيانات تالفة
    }
}

let articles = loadArticles();

function saveToStorage() {
    localStorage.setItem("articles", JSON.stringify(articles));
}

// منع حقن أكواد HTML من خلال النصوص المدخلة
function escapeHtml(text) {
    let div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// ===== 3) Create Article =====
articleForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let title = document.getElementById("title").value.trim();
    let content = document.getElementById("content").value.trim();

    if (!title || !content) return; // لا نضيف مقالاً فارغاً

    let newArticle = {
        id: Date.now(),
        title: title,
        content: content,
    };

    articles.unshift(newArticle); // الأحدث أولاً
    saveToStorage();
    renderArticles();
    articleForm.reset();
});

// ===== 4) Read Articles =====
function renderArticles() {
    articlesCount.textContent = articles.length;

    if (articles.length === 0) {
        articlesList.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-inbox"></i>
                لا توجد مقالات بعد، أضف أول مقال!
            </div>`;
        return;
    }

    articlesList.innerHTML = articles.map(article => `
        <div class="article-item card p-3">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h5 class="article-title">${escapeHtml(article.title)}</h5>
                    <p class="article-content">${escapeHtml(article.content)}</p>
                </div>
                <div class="d-flex gap-1">
                    <button class="btn btn-warning btn-sm" onclick="editArticle(${article.id})" aria-label="تعديل">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteArticle(${article.id})" aria-label="حذف">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

// ===== 5) Delete Article =====
window.deleteArticle = function (id) {
    if (confirm("هل أنت متأكد من حذف هذه المقالة؟")) {
        articles = articles.filter(a => a.id !== id);
        saveToStorage();
        renderArticles();
    }
};

// ===== 6) Edit Article (فتح النافذة وتعبئتها) =====
window.editArticle = function (id) {
    let article = articles.find(a => a.id === id);

    if (article) {
        document.getElementById("editId").value = article.id;
        document.getElementById("editTitle").value = article.title;
        document.getElementById("editContent").value = article.content;

        editModal.show();
    }
};

// ===== 7) Save Operation =====
saveChanges.addEventListener("click", function () {
    let id = parseInt(document.getElementById("editId").value);
    let title = document.getElementById("editTitle").value.trim();
    let content = document.getElementById("editContent").value.trim();

    if (!title || !content) {
        alert("العنوان والمحتوى مطلوبان");
        return;
    }

    let articleIndex = articles.findIndex(a => a.id === id);

    if (articleIndex !== -1) {
        articles[articleIndex] = { id, title, content };
        saveToStorage();
        renderArticles();
        editModal.hide();
    }
});

// عرض المقالات عند فتح الصفحة
renderArticles();
