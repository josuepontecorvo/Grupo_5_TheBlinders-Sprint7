const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-bar")

form.addEventListener("submit", (e) => {
    if (searchInput.value.trim() == "") {
        e.preventDefault();
    }
})
