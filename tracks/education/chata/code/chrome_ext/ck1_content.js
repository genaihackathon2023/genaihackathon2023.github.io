// Define the functions in the global scope
function createSetButtons(labels, popup) {
    var setButtonsContainer = document.createElement('div');
    setButtonsContainer.classList.add('set-buttons');

    // Create three buttons with the given labels
    labels.forEach(function(label) {
        var button = document.createElement('button');
        button.textContent = label;
        button.classList.add('popup-button'); // Apply the CSS style class
        setButtonsContainer.appendChild(button);
    });

    popup.appendChild(setButtonsContainer);
}

function removeExistingButtons(popup) {
    var existingButtons = popup.querySelectorAll('.set-buttons');
    existingButtons.forEach(function(buttonsContainer) {
        popup.removeChild(buttonsContainer);
    });
}

// Event listener for mouseup
document.addEventListener('mouseup', function(event) {
    var selectedText = window.getSelection().toString();

    // Check if text is selected
    if (selectedText) {
        // Remove existing popups, if any
        var existingPopups = document.querySelectorAll('.popup');
        existingPopups.forEach(function(popup) {
            document.body.removeChild(popup);
        });

        var popup = document.createElement('div');
        popup.classList.add('popup');
        popup.style.width = '400px';
        popup.style.position = 'fixed';
        popup.style.bottom = '100px'; // Moved to bottom of the screen
        popup.style.right = '20px';
        popup.style.border = '1px solid black';
        popup.style.padding = '20px';
        popup.style.boxSizing = 'border-box';
        popup.style.backgroundColor = '#fff'; // setting background color to white
        popup.style.display = 'flex';
        popup.style.flexDirection = 'column';
        popup.style.justifyContent = 'space-between';
        popup.style.overflow = 'auto'; // Makes the popup scrollable if it exceeds the screen
        popup.style.maxHeight = '80vh'; // Set a maximum height for the popup (e.g., 80% of the viewport height)

        // create an element of logo  <img id="logo" src="ChaTA.png" alt="Logo1">
        const img = document.createElement('img');
        img.src = chrome.runtime.getURL('ChaTA.png');
        img.style.width = '90%';
        popup.appendChild(img);
        // document.body.append(img);

        // var title = document.createElement('div');
        // title.textContent = 'ChaTA';
        // title.style.textAlign = 'center';
        // title.style.marginBottom = '20px';
        // title.style.fontWeight = 'bold'; // Make the title bolder
        // title.style.backgroundColor = 'green'; // Added green background
        // title.style.color = 'white'; // Added white color
        // title.style.fontSize = '24px'; // Increased font size

        var cssStyles = `
            .popup-button {
                display: inline-block;
                padding: 10px 20px;
                margin: 5px;
                border: 1px solid #000;
                background-color: #f0f0f0;
                cursor: pointer;
                border-radius: 4px;
            }

            .set-buttons {
                text-align: center;
                margin-top: 20px;
            }
        `;

        var styleElement = document.createElement('style');
        styleElement.textContent = cssStyles;
        document.head.appendChild(styleElement);

        // var areYouText = document.createElement('div');
        // areYouText.textContent = 'Are you a...';
        // areYouText.style.textAlign = 'center';
        // areYouText.style.marginBottom = '10px';

        var buttonsContainer = document.createElement('div');
        buttonsContainer.style.textAlign = 'center';

        var studentButton = document.createElement('button');
        studentButton.textContent = 'Student';
        studentButton.classList.add('popup-button');

        var taButton = document.createElement('button');
        taButton.textContent = 'TA';
        taButton.classList.add('popup-button');

        // buttonsContainer.appendChild(areYouText);
        buttonsContainer.appendChild(studentButton);
        buttonsContainer.appendChild(taButton);

        // popup.appendChild(title);
        popup.appendChild(buttonsContainer);

        var textboxContainer = document.createElement('div');
        textboxContainer.style.marginTop = '20px';
        var textbox = document.createElement('textarea');
        textbox.style.width = '100%';
        textbox.style.height = '80px'; // Reduced height
        textbox.textContent = selectedText;
        textboxContainer.appendChild(textbox);
        popup.appendChild(textboxContainer);

        // Dropdown menu
        var dropDownContainer = document.createElement('div');
        var dropDown = document.createElement('select');
        var option1 = document.createElement('option');
        option1.text = 'LLaMA2';
        var option2 = document.createElement('option');
        option2.text = 'LLaMA2+IR';//'GPT3.5';
        dropDown.add(option1);
        dropDown.add(option2);
        dropDownContainer.appendChild(dropDown);
        popup.appendChild(dropDownContainer);

        // Ask GPT button
        var askGPTButton = document.createElement('button');
        askGPTButton.textContent = 'ASK Model';
        askGPTButton.classList.add('popup-button');
        popup.appendChild(askGPTButton);
        askGPTButton.addEventListener('click', function() {
            var message = textbox.value;
            var model = dropDown.value;
            console.log("CLICK BUTTON", message, model);
            fetch('http://localhost:5000/ask-model', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message, model: "gpt3" })
            }).then(response => response.json())
            .then(data => {
                modelResponseTextbox.value = data.response;
            })
            .catch((error) => {
                console.error('Error:', error, model);
            });
        });

        // Model response title and text box
        var modelResponseTitle = document.createElement('div');
        modelResponseTitle.textContent = 'Model response';
        var modelResponseTextboxContainer = document.createElement('div');
        var modelResponseTextbox = document.createElement('textarea');
        modelResponseTextbox.style.width = '100%';
        modelResponseTextbox.style.height = '90px'; // Reduced height
        modelResponseTextboxContainer.appendChild(modelResponseTextbox);
        popup.appendChild(modelResponseTitle);
        popup.appendChild(modelResponseTextboxContainer);

        document.body.appendChild(popup);

        studentButton.addEventListener('click', function() {
            removeExistingButtons(popup);
            createSetButtons(["I like", "I don't like", "Feedback"], popup);
        });

        taButton.addEventListener('click', function() {
            removeExistingButtons(popup);
            createSetButtons(["I approve", "I reject", "My edits"], popup);
        });
    }
});

// Event listener for mousedown
document.addEventListener('mousedown', function(event) {
    var popup = document.querySelector('.popup');
    if (popup) {
        var isClickInsidePopup = popup.contains(event.target);
        if (!isClickInsidePopup) {
            // The click was outside the popup, remove it
            document.body.removeChild(popup);
        }
    }
});
