import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

// Data Store, central place to store all main parts of data
const dataStore = {
  books,
  authors,
  genres,
  matches: books,
  page: 1,
};

// Central location with the DOM elements of all query selectors to avoid repeated querySelector calls
const selectors = {
  listItems: document.querySelector("[data-list-items]"),
  searchGenres: document.querySelector("[data-search-genres]"),
  searchAuthors: document.querySelector("[data-search-authors]"),
  settingsTheme: document.querySelector("[data-settings-theme]"),
  settingsOverlay: document.querySelector("[data-settings-overlay]"),
  searchOverlay: document.querySelector("[data-search-overlay]"),
  searchTitle: document.querySelector("[data-search-title]"),
  listButton: document.querySelector("[data-list-button]"),
  listMessage: document.querySelector("[data-list-message]"),
  listActive: document.querySelector("[data-list-active]"),
  listBlur: document.querySelector("[data-list-blur]"),
  listImage: document.querySelector("[data-list-image]"),
  listTitle: document.querySelector("[data-list-title]"),
  listSubtitle: document.querySelector("[data-list-subtitle]"),
  listDescription: document.querySelector("[data-list-description]"),
};
// Utility Functions
const createOptionElement = (value, text) => {
  const element = document.createElement("option");
  element.value = value;
  element.innerText = text;
  return element;
};

const createBookElement = ({ author, id, image, title }) => {
  const element = document.createElement("button");
  element.classList.add("preview");
  element.setAttribute("data-preview", id);

  element.innerHTML = `
      <img class="preview__image" src="${image}" />
      <div class="preview__info">
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${dataStore.authors[author]}</div>
      </div>
    `;
  return element;
};

// Event Handlers for all event listeners
const handleEvents = () => {
  selectors.searchGenres.addEventListener("click", () => {
    selectors.searchOverlay.open = false;
  });

  document
    .querySelector("[data-header-search]")
    .addEventListener("click", () => {
      selectors.searchOverlay.open = true;
      selectors.searchTitle.focus();
    });

  document
    .querySelector("[data-header-settings]")
    .addEventListener("click", () => {
      selectors.settingsOverlay.open = true;
    });

  selectors.listButton.addEventListener("click", () => {
    const start = dataStore.page * BOOKS_PER_PAGE;
    const end = (dataStore.page + 1) * BOOKS_PER_PAGE;
    renderBooks(dataStore.matches.slice(start, end), selectors.listItems);
    dataStore.page += 1;
    updateShowMoreButton();
  });

  selectors.listItems.addEventListener("click", (event) => {
    const pathArray = Array.from(event.composedPath());
    const activePreview = pathArray.find((node) => node?.dataset?.preview);
    if (activePreview) {
      const book = dataStore.books.find(
        (book) => book.id === activePreview.dataset.preview
      );
      if (book) {
        showBookDetails(book);
      }
    }
  });

  selectors.listActive.addEventListener("click", () => {
    selectors.listActive.open = false;
  });

  document
    .querySelector("[data-settings-form]")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const { theme } = Object.fromEntries(new FormData(event.target));
      setTheme(theme);
      selectors.settingsOverlay.open = false;
    });

  document
    .querySelector("[data-search-form]")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const filters = Object.fromEntries(new FormData(event.target));
      dataStore.matches = filterBooks(filters);
      dataStore.page = 1;
      renderBooks(
        dataStore.matches.slice(0, BOOKS_PER_PAGE),
        selectors.listItems
      );
      updateShowMoreButton();
      window.scrollTo({ top: 0, behavior: "smooth" });
      selectors.searchOverlay.open = false;
    });

  document
    .querySelector("[data-search-cancel]")
    .addEventListener("click", () => {
      selectors.searchOverlay.open = false;
    });

  document
    .querySelector("[data-settings-cancel]")
    .addEventListener("click", () => {
      selectors.settingsOverlay.open = false;
    });
};

// Initialize Event Handlers
handleEvents();
