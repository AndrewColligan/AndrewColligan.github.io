function copyCite(elementId) {
    // Get the text field
    var copyText = document.getElementById(elementId);

     // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.textContent);
  }
