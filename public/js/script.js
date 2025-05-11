document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('searchInput');
  const selectElement = document.getElementById('categoryFilter');
  const formElement = document.querySelector('.search__form');
  const searchBtn = document.querySelector('.searchBtn');

  // Example: Focus on the search input on page load
  searchInput.focus();

  // Adjust the category filter change logic as needed
  selectElement.addEventListener('change', function () {
    const selectedCategory = selectElement.value;
    formElement.action = `/search?category=${selectedCategory}`;
    searchInput.value = selectedCategory;
    formElement.submit();
  });

  // Handle click event on the search button
  searchBtn.addEventListener('click', function () {
    const searchBar = document.querySelector('.searchBar');
    searchBar.style.visibility = 'visible';
    searchBar.classList.add('open');
    this.setAttribute('aria-expanded', 'true');
    searchInput.focus();
  });
});
