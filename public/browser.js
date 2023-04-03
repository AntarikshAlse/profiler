document.addEventListener("click", function (event) {
  if (event.target.classList.contains("show_more")) {
    fetchBooks();
  }
});

//login
function login(event) {
  event.preventDefault();
  let loginId = document.getElementById("loginId").value;
  let password = document.getElementById("password").value;
  //post request axios
  axios
    .post("/login", {
      loginId: loginId,
      password: password,
    })
    .then((response) => {
      console.log(response.data);
      if (response.data) {
        window.location.href = "/dashboard";
      } else {
        alert("Invalid Credentials");
      }
    })
    .catch((error) => {
      alert(error.response.data.error);
      console.log(error);
    });
}

// register
function register(event) {
  event.preventDefault();
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let email = document.getElementById("email").value;
  console.log(username, password, name, phone, email);
  if (!username || !password || !name || !phone || !email) {
    alert("All fields are required");
    return;
  }
  //post request axios
  axios
    .post("/registration", {
      username: username,
      password: password,
      name: name,
      phone: phone,
      email: email,
    })
    .then((response) => {
      if (response.data) {
        alert(response.data + " Verify your email");
        window.location.href = "/login";
        console.log(response.message);
      } else {
        alert("Invalid Credentials");
      }
    })
    .catch((error) => {
      alert(error.response.data.error);
      console.log(error);
    });
}

function resend(event) {
  let email = document.getElementById("email").value;
  if (email === "") {
    alert("Email is required");
    return;
  }
  console.log(email);
  //post request axios
  axios
    .post("/resend-mail", {
      email: email,
    })
    .then((response) => {
      console.log(response.data);
      if (response.data) {
        alert(response.data);
      } else {
        alert(response.data.error);
      }
    })
    .catch((error) => {
      alert(error.response.data.error);
    });
}

function forgetpass() {
  let email = document.getElementById("loginId").value;
  if (email === "") {
    alert("Email is required");
    return;
  }
  console.log(email);
  //post request axios
  axios
    .post("/reset-pass", {
      email: email,
    })
    .then((response) => {
      if (response.data) {
        alert(response.data.message);
      } else {
        alert(response.data.error);
      }
    })
    .catch((error) => {
      alert(error.response.data.error);
    });
}

function createBook(event) {
  event.preventDefault();
  let title = document.getElementById("title").value;
  let author = document.getElementById("author").value;
  let price = document.getElementById("price").value;
  let category = document.getElementById("category").value;
  if (!title || !author || !price || !category) {
    alert("All fields are required");
    return;
  }
  //post request axios
  axios
    .post("/create-book", {
      title: title,
      author: author,
      price: price,
      category: category,
    })
    .then((response) => {
      if (response.data) {
        alert(response.data);
      } else {
        alert(response.data.error);
      }
    })
    .catch((error) => {
      alert(error.response.data.error);
    });
}
window.onload = function () {
  fetchBooks();
};

function fetchBooks() {
  axios.get("/books").then((response) => {
    console.log(response.data);
    if (response.data) {
      let books = response.data.data;
      let html = "";
      books.forEach((book) => {
        html += `
          <li>
          <div class="card">
          <div class="card-body">
            <h3>Title - ${book.title}</h3>
          
            <p>Author : ${book.author}</p>
            <p>Price : ${book.price}</p>
            <p>Category : ${book.category}</p>
            <button>
              <a href="#" class="btn btn-danger btn-sm" onclick="deleteBook(${book._id})">Delete</a>
            </button>
            </div>
            </div>
          </li>
          `;
      });
      document.getElementById("item_list").innerHTML = html;
    }
  });
}
