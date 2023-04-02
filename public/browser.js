document.addEventListener("click", function (event) {
  alert("click");

  if (event.target.classList.contains("show_more")) {
    //fetchBooks();
  }
});

window.onload = function () {
  //fetchBooks()
};
