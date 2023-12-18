document.addEventListener('DOMContentLoaded', function () {
  var sendButton = document.getElementById('askButton');
  var messageInput = document.getElementById('questionInput');
  var chatArea = document.getElementById('responseOutput');

  console.log("CONTENT LOADED");

  sendButton.addEventListener('click', function () {

    console.log("CLICK BUTTON");

    var message = messageInput.value;
    // babel.lti.cs.cmu.edu 8080
    fetch('http://localhost:5000/ask-model', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message, model: "gpt2" })
    }).then(response => response.json())
    .then(data => {
      chatArea.value += data.response + '\n';
    })
    .catch((error) => {
      console.error('Error:', error);
    });

    messageInput.value = '';
  });
});

// not working, scratch it
document.addEventListener('mouseup', function(e) {
    var messageArea = document.getElementById('questionInput');
    console.log("hellpo!!");
    // Get the selected text
    var selectedText = window.getSelection().toString().trim();
    // Check if any text is selected
    if(selectedText.length > 0) {
      messageArea.value = selectedText;
    }
});