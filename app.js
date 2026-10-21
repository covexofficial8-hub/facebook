
const form = document.getElementById("surveyForm");
const message = document.getElementById("message");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  message.textContent =
    "Survey submission is not connected yet. Please try again later.";
});
