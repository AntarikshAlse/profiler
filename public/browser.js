document.addEventListener("click", function (event) {
  if (event.target.classList.contains("show_more")) {
    //fetchBooks();
  }
});

window.onload = function () {
  //fetchBooks()
};

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
