document.addEventListener("DOMContentLoaded", function () {
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");
    const bookForm = document.getElementById("inputBook");
    const searchForm = document.getElementById("searchBook");

    let books = [];

    function generateId() {
        return +new Date();
    }

    function findBook(bookId) {
        return books.find(book => book.id === bookId);
    }

    function findBookIndex(bookId) {
        return books.findIndex(book => book.id === bookId);
    }

    function saveData() {
        localStorage.setItem('books', JSON.stringify(books));
    }

    function loadData() {
        const data = localStorage.getItem('books');
        return data ? JSON.parse(data) : [];
    }

    function addBookToShelf(book) {
        const bookItem = document.createElement("article");
        bookItem.classList.add("book_item");
        bookItem.innerHTML = `
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>
            <div class="action">
                <button class="green" onclick="toggleComplete(${book.id})">${book.isComplete ? "Belum selesai di Baca" : "Selesai dibaca"}</button>
                <button class="red" onclick="removeBook(${book.id})">Hapus buku</button>
            </div>
        `;
        if (book.isComplete) {
            completeBookshelfList.appendChild(bookItem);
        } else {
            incompleteBookshelfList.appendChild(bookItem);
        }
    }

    function addBook() {
        const title = document.getElementById("inputBookTitle").value;
        const author = document.getElementById("inputBookAuthor").value;
        const year = parseInt(document.getElementById("inputBookYear").value);
        const isComplete = document.getElementById("inputBookIsComplete").checked;

        const newBook = {
            id: generateId(),
            title,
            author,
            year,
            isComplete
        };

        books.push(newBook);
        addBookToShelf(newBook);
        saveData();
    }

    function removeBook(bookId) {
        const bookIndex = findBookIndex(bookId);
        if (bookIndex >= 0) {
            books.splice(bookIndex, 1);
            saveData();
            refreshData();
        }
    }

    function toggleComplete(bookId) {
        const book = findBook(bookId);
        if (book) {
            book.isComplete = !book.isComplete;
            saveData();
            refreshData();
        }
    }

    function refreshData() {
        incompleteBookshelfList.innerHTML = "";
        completeBookshelfList.innerHTML = "";
        for (const book of books) {
            addBookToShelf(book);
        }
    }

    function searchBook() {
        const searchValue = document.getElementById("searchBookTitle").value.toLowerCase();
        const filteredBooks = books.filter(book =>
            book.title.toLowerCase().includes(searchValue)
        );
        incompleteBookshelfList.innerHTML = "";
        completeBookshelfList.innerHTML = "";
        for (const book of filteredBooks) {
            addBookToShelf(book);
        }
    }

    bookForm.addEventListener("submit", function (e) {
        e.preventDefault();
        addBook();
    });

    searchForm.addEventListener("submit", function(e) {
        e.preventDefault();
        searchBook();
    });

    window.removeBook = function(bookId) {
        const bookIndex = findBookIndex(bookId);
        if (bookIndex >= 0) {
            books.splice(bookIndex, 1);
            saveData();
            refreshData();
        }
    };

    window.toggleComplete = function(bookId) {
        const book = findBook(bookId);
        if (book) {
            book.isComplete = !book.isComplete;
            saveData();
            refreshData();
        }
    };

    document.getElementById("inputBook").addEventListener("submit", function (e) {
        e.preventDefault();
        addBook();
    });

     // Load books from local storage and display
    books = loadData();
    refreshData();
});