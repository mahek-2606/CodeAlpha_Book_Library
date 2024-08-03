document.addEventListener('DOMContentLoaded', () => {
    const addBookForm = document.getElementById('add-book-form');
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-button');
    const categoryFilter = document.getElementById('category-filter');
    const bookList = document.getElementById('book-list');
    const borrowHistory = document.getElementById('borrow-history');

    function getBooks() {
        return JSON.parse(localStorage.getItem('books')) || [];
    }

    function saveBooks(books) {
        localStorage.setItem('books', JSON.stringify(books));
    }

    function addBook(book) {
        const books = getBooks();
        books.push(book);
        saveBooks(books);
        renderBooks();
        updateCategoryFilter();
    }

    function getBorrowHistory() {
        return JSON.parse(localStorage.getItem('borrowHistory')) || [];
    }

    function saveBorrowHistory(history) {
        localStorage.setItem('borrowHistory', JSON.stringify(history));
    }

    function addBorrowHistory(book) {
        const history = getBorrowHistory();
        history.push(book);
        saveBorrowHistory(history);
        renderBorrowHistory();
    }

    function renderBooks(books = null) {
        if (books === null) {
            books = getBooks();
        }
        const selectedCategory = categoryFilter.value;
        const query = searchInput.value.toLowerCase();
        const filteredBooks = books
            .filter(book => {
                const matchesCategory = !selectedCategory || book.category === selectedCategory;
                const matchesQuery = book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query);
                return matchesCategory && matchesQuery;
            });

        bookList.innerHTML = '';
        filteredBooks.forEach((book, index) => {
            const bookItem = document.createElement('div');
            bookItem.className = 'book-item';
            bookItem.innerHTML = `
                <h3>${book.title}</h3>
                <p>Author: ${book.author}</p>
                <p>Category: ${book.category}</p>
                <button onclick="borrowBook(${index})">Borrow</button>
            `;
            bookList.appendChild(bookItem);
        });
    }

    function renderBorrowHistory() {
        const history = getBorrowHistory();
        const selectedCategory = categoryFilter.value;
        const query = searchInput.value.toLowerCase();
        const filteredHistory = history
            .filter(book => {
                const matchesCategory = !selectedCategory || book.category === selectedCategory;
                const matchesQuery = book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query);
                return matchesCategory && matchesQuery;
            });

        borrowHistory.innerHTML = '';
        filteredHistory.forEach(book => {
            const borrowItem = document.createElement('div');
            borrowItem.className = 'borrow-item';
            borrowItem.innerHTML = `
                <h3>${book.title}</h3>
                <p>Author: ${book.author}</p>
                <p>Category: ${book.category}</p>
            `;
            borrowHistory.appendChild(borrowItem);
        });
    }

    function updateCategoryFilter() {
        const books = getBooks();
        const history = getBorrowHistory();
        const allCategories = new Set([...books.map(book => book.category), ...history.map(book => book.category)]);
        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        allCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    addBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const category = document.getElementById('category').value;
        addBook({ title, author, category });
        addBookForm.reset();
    });

    searchButton.addEventListener('click', () => {
        renderBooks();
        renderBorrowHistory();
    });

    categoryFilter.addEventListener('change', () => {
        renderBooks();
        renderBorrowHistory();
    });

    window.borrowBook = function(index) {
        const books = getBooks();
        const book = books.splice(index, 1)[0];
        saveBooks(books);
        addBorrowHistory(book);
        renderBooks();
        renderBorrowHistory();
    };

    renderBooks();
    renderBorrowHistory();
    updateCategoryFilter();
});
