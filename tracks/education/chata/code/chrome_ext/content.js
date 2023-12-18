
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

        var $popup = $("<div>", {id: "chata-popup", "class": "chata-popup"});
        
        const img = document.createElement('img');
        img.src = chrome.runtime.getURL('ChaTA.png');
        img.style.width = '90%';
        $popup.append(img);

        // var title = document.createElement('div');
        // title.classList.add('chata-title');
        // title.textContent = 'ChaTA';

        // var areYouText = document.createElement('span');
        // areYouText.textContent = 'Are you a...';
        // areYouText.style.textAlign = 'center';
        // areYouText.style.marginBottom = '10px';

        $buttonsContainer = $('<div>', { style: 'text-align: center' });

        var $studentButton = $('<button>', { text: 'Student', class: 'chata-popup-button' });
        var $taButton = $('<button>', { text: 'TA', class: 'chata-popup-button' });
       
        // $buttonsContainer.append(areYouText);
        $buttonsContainer.append($studentButton);
        $buttonsContainer.append($taButton);

        // $popup.append(title);
        $popup.append($buttonsContainer);

        var textboxContainer = document.createElement('div');
        textboxContainer.style.marginTop = '20px';
        var textbox = document.createElement('textarea');
        textbox.classList.add('chata-selected-text');
        textbox.textContent = selectedText;
        textboxContainer.appendChild(textbox);
        $popup.append(textboxContainer);

        // Dropdown menu
        var modelSelectContainer = document.createElement('span');
        var dropDown = document.createElement('select');
        dropDown.classList.add('chata-model-select');
        var option1 = document.createElement('option');
        option1.text = 'LLaMA2';
        var option2 = document.createElement('option');
        option2.text = 'LLaMA2+IR';
        dropDown.add(option1);
        dropDown.add(option2);
        modelSelectContainer.appendChild(dropDown);
        
        // Ask GPT button
        var askGPTButton = document.createElement('button');
        askGPTButton.textContent = 'ASK Model';
        askGPTButton.classList.add('chata-ask-button');
        modelSelectContainer.appendChild(askGPTButton);
        
        // PUT ASK MODEL BUTTON FUNCTIONALITY IN HERE
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
        
        $popup.append(modelSelectContainer);

        

        // Model response title and text box
        var modelResponseTitle = document.createElement('div');
        modelResponseTitle.textContent = 'Model response';
        var modelResponseTextboxContainer = document.createElement('div');
        var modelResponseTextbox = document.createElement('textarea');
        modelResponseTextbox.classList.add('chata-response-text');
        modelResponseTextboxContainer.appendChild(modelResponseTextbox);
        $popup.append(modelResponseTitle);
        $popup.append(modelResponseTextboxContainer);

        
        // Student response buttons
        
        $studentResponseButtons = $('<div>', { id: 'student-response-buttons'} ).hide();
        $studentResponseButtons.append($('<button>', { class: "chata-popup-button good-button", text: "I like", click: function() { } }));
        $studentResponseButtons.append($('<button>', { class: "chata-popup-button bad-button", text: "I don't like", click: function() { } }));
        $studentResponseButtons.append($('<button>', { class: "chata-popup-button edit-button", text: "Feedback", click: function() { } }));
        
        // TA response buttons
        
        $taResponseButtons = $('<div>', { id: 'ta-response-buttons'} ).hide();
        $taResponseButtons.append($('<button>', { class: "chata-popup-button good-button", text: "I approve", click: function() { } }));
        $taResponseButtons.append($('<button>', { class: "chata-popup-button bad-button", text: "I reject", click: function() { } }));
        $taResponseButtons.append($('<button>', { class: "chata-popup-button edit-button", text: "My edits", click: function() { } }));     
        
        $popup.append($studentResponseButtons, { id: 'ta-response-buttons' })
        $popup.append($taResponseButtons)
        
        $studentButton.click(function() {
          $studentButton.addClass('chata-button-selected');
          $taButton.removeClass('chata-button-selected');
          $taResponseButtons.hide();
          $studentResponseButtons.show();
        });
        
        $taButton.click(function() {
          $taButton.addClass('chata-button-selected');
          $studentButton.removeClass('chata-button-selected');
          $studentResponseButtons.hide();
          $taResponseButtons.show();
        });
        
        $('body').append($popup);
    }
});

// Event listener for mousedown
document.addEventListener('mousedown', function(event) {
    var popup = document.querySelector('#chata-popup');
    if (popup) {
        var isClickInsidePopup = popup.contains(event.target);
        if (!isClickInsidePopup) {
            // The click was outside the popup, remove it
            document.body.removeChild(popup);
        }
    }
});
