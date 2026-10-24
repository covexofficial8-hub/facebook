
const form = document.getElementById("surveyForm");
const message = document.getElementById("message");
const submitButton = document.getElementById("submitButton");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const age = document.getElementById("age").value.trim();
  const gender = document.getElementById("gender").value.trim();

  if (!age || !gender) {
    message.textContent = "Please fill in both fields.";
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
      body: JSON.stringify({ age, gender })
    });

    const responseText = await response.text();

    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error(
        `Server returned an invalid response (HTTP ${response.status}): ${
          responseText || "Empty response"
        }`
      );
    }

    if (!response.ok || !result.success) {
      throw new Error(
        result.error || `Request failed (HTTP ${response.status})`
      );
    }

    message.textContent = "Your survey was submitted successfully.";
    form.reset();

  } catch (error) {
    console.error("Survey submission error:", error);
    message.textContent = "Submission failed: " + error.message;
  } finally {
    submitButton.disabled = false;
  }
});
