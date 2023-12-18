// Declare the popup and buttonGroup outside the event listener so they can be accessed from both event listeners
var popup = null;
var buttonGroup = null;

function replaceFeedbackButtons(feedbackButtons) {
    // Remove all existing feedback buttons
    while (buttonGroup.firstChild) {
        buttonGroup.removeChild(buttonGroup.firstChild);
    }

    // Add the new feedback buttons
    for (var i = 0; i < feedbackButtons.length; i++) {
        var feedbackButton = document.createElement('button');
        feedbackButton.className = "feedbackButton btn";
        feedbackButton.textContent = feedbackButtons[i];
        buttonGroup.appendChild(feedbackButton);
    }
}

document.addEventListener('mouseup', function(e) {
    // Remove any existing popup
    if (popup !== null) {
        document.body.removeChild(popup);
        popup = null;
    }

    // Get the selected text
    var selectedText = window.getSelection().toString().trim();

    // Check if any text is selected
    if(selectedText.length > 0) {
        // Create a new popup
        popup = document.createElement('div');

        // Style the popup
        popup.style.position = 'fixed';
        popup.style.bottom = '200px';
        popup.style.right = '40px';
        popup.style.zIndex = '9999';
        popup.style.height = '400px';
        popup.style.width = '500px';

        // Add the popup to the page
        document.body.appendChild(popup);

        // Create a shadow root
        var shadow = popup.attachShadow({mode: 'open'});

        // Add styles to the shadow root
        var style = document.createElement('style');
        style.textContent = ` 
           body {
    font-family: Arial, sans-serif;
    padding: 0;
    margin: 0;
    background-color: #f5f5f5;
    width: 300px;
}

.container {
    padding: 20px;
    background-color: white;
}

#logo {
    display: block;
    width: 100%;
    height: auto;
    margin-bottom: 20px;
}

.label {
    width: 100%;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin: 10px 0;
}

.textbox {
    width: 100%;
    height: 100px;
    margin-bottom: 20px;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    resize: none;
}

.btn {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    transition: background-color 0.3s ease;
}

#askButton {
    background-color: #008CBA;
}

#askButton:hover {
    background-color: #0079a1;
}

.button-group {
    display: flex;
    justify-content: space-between;
}

.feedbackButton {
    width: 30%;
    transition: background-color 0.3s ease;
}

.feedbackButton:nth-child(1) {
    background-color: #4CAF50;  /* green */
}

.feedbackButton:nth-child(1):hover {
    background-color: #3f8c3e;
}

.feedbackButton:nth-child(2) {
    background-color: #f44336;  /* red */
}

.feedbackButton:nth-child(2):hover {
    background-color: #da190b;
}

.feedbackButton:nth-child(3) {
    background-color: #008CBA;  /* blue */
}

.feedbackButton:nth-child(3):hover {
    background-color: #0079a1;
}

        `;
        shadow.appendChild(style);

        // Create and append the individual elements to the shadow root
        var container = document.createElement('div');
        container.className = 'container';
        shadow.appendChild(container);

        var userTypeLabel = document.createElement('h4');
        userTypeLabel.className = "label";
        userTypeLabel.textContent = "Are you a...";
        container.appendChild(userTypeLabel);

       var userTypeButtons = ['Student', 'TA'];
var userTypeButtonGroup = document.createElement('div');  // Create a div to hold the user type buttons
userTypeButtonGroup.style.display = 'flex';  // Make the div a flex container to place the buttons side by side
for (var i = 0; i < userTypeButtons.length; i++) {
    var userTypeButton = document.createElement('button');
    userTypeButton.className = "btn userTypeButton";
    userTypeButton.textContent = userTypeButtons[i];
    if (userTypeButtons[i] === 'Student') {
    userTypeButton.addEventListener('click', function() {
        var newButton = document.createElement('button');
        newButton.textContent = 'New Button';
        container.appendChild(newButton);  // append the new button to the container in the shadow root
    });
} else if (userTypeButtons[i] === 'TA') {
    userTypeButton.addEventListener('click', function() {
        var buttons = shadow.querySelectorAll('button');  // get all buttons in the shadow root
        var lastButton = buttons[buttons.length - 1];
        lastButton.textContent = 'Old Button';
    });
}
    userTypeButtonGroup.appendChild(userTypeButton);
}
container.appendChild(userTypeButtonGroup);

        var questionInput = document.createElement('textarea');
        questionInput.className = "textbox";
        questionInput.id = "questionInput";
        questionInput.value = selectedText;  // Set the selected text as the value
        container.appendChild(questionInput);

        // Create a drop-down menu for the model selection
        var modelLabel = document.createElement('h4');
        modelLabel.className = "label";
        modelLabel.textContent = "What model would you like to use?";
        container.appendChild(modelLabel);

        var modelSelect = document.createElement('select');
        modelSelect.id = "modelSelect";
        var modelOptions = ["LLaMA2", "GPT 3.5 (warning: you are sending data to a company)"];
        for (var i = 0; i < modelOptions.length; i++) {
            var option = document.createElement('option');
            option.textContent = modelOptions[i];
            modelSelect.appendChild(option);
        }
        container.appendChild(modelSelect);

        var askButton = document.createElement('button');
        askButton.className = "btn";
        askButton.id = "askButton";
        askButton.textContent = "Ask ChaTA";
        askButton.onclick = function() {
            var label = document.createElement('h4');
            label.className = "label";
            label.textContent = "Model is generating answer...";
            askButton.parentNode.insertBefore(label, askButton.nextSibling);
        };
        container.appendChild(askButton);

        var label2 = document.createElement('h2');
        label2.className = "label";
        label2.textContent = "Model response";
        container.appendChild(label2);

        var responseOutput = document.createElement('textarea');
        responseOutput.className = "textbox";
        responseOutput.id = "responseOutput";
        responseOutput.readOnly = true;
        container.appendChild(responseOutput);
    }
});
