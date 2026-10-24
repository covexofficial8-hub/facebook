
const API_URL = "https://facebook.adsense-org.workers.dev/api/survey";

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
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        age: age,
        gender: gender
      })
    });

    const responseText = await response.text();

    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error(
        `Worker returned an invalid response (HTTP ${response.status}). ` +
        (responseText || "The response was empty.")
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

    if (error instanceof TypeError) {
      message.textContent =
        "Cannot connect to the API. Check Worker availability and CORS settings.";
    } else {
      message.textContent = "Submission failed: " + error.message;
    }

  } finally {
    submitButton.disabled = false;
  }
});
