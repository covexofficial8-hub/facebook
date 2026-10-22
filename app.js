const form = document.getElementById("surveyForm");
const message = document.getElementById("message");
const submitButton = document.getElementById("submitButton");

form.addEventListener("submit", async function (event) {
event.preventDefault();

const age = Number(document.getElementById("age").value);
const gender = document.getElementById("gender").value.trim();

if (!Number.isInteger(age) || age < 13 || age > 120) {
message.textContent = "Please enter an age between 13 and 120.";
return;
}

if (!gender || gender.length > 30) {
message.textContent = "Please enter your gender (maximum 30 characters).";
return;
}

submitButton.disabled = true;
message.textContent = "Submitting...";

try {
const response = await fetch("/api/survey", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
age: age,
gender: gender
})
});

const result = await response.json();

if (!response.ok || !result.success) {
  throw new Error(result.error || "Submission failed.");
}

message.textContent = "Your survey was submitted successfully.";
form.reset();

} catch (error) {
message.textContent =
"Submission failed. Please try again later.";
} finally {
submitButton.disabled = false;
}
});