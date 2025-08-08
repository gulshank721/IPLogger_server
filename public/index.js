document
  .getElementById("shorten-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const destination = document.getElementById("destination").value;
    const resultDiv = document.getElementById("result");
    resultDiv.textContent = "Creating...";
    try {
      const res = await fetch("/create-short-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination }),
      });
      const data = await res.json();
      if (data.shortUrl) {
        resultDiv.innerHTML = `Short link: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
      } else {
        resultDiv.textContent = data.error || "Failed to create short link.";
      }
    } catch (err) {
      resultDiv.textContent = "Error: " + err.message;
    }
  });
