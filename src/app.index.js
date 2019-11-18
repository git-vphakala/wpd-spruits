import './spruits-2018.9.css';

$("body").append(
  $("<div>").append($("<label>").html("username"), $("<input>", { id:"username_field" })),
  $("<div>").append($("<label>").html("passwd"), $("<input>", { id:"password_field" })),
  $("<div>").append($("<button>", { id:"login_button" }).html("logon").on("click", e => {
    e.preventDefault();
    $("title").html("Welcome Page");
  })),
  $("<div>").append("Nimipäivä: ", $("<span>", { class:"nameday" }).html("Veli, Pekka")),
  $("<div>").append($("<h4>", { class:"namedaygreetings" }))
);
