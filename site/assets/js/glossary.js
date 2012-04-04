function updateList() {
    var theList = $('#theList');
    $.ajax({
        url: 'glossary/terms',
        //type defaults to 'GET' 
        success: function(data) {
            //clear out the current list
            theList.empty();

            //loop through each item that returned
            data.forEach(function(dataItem) {
                //the term is a key on the dataItem
                for (var term in dataItem) {
                    //append the term to the list
                    $('<dt>' + term + '</dt>').appendTo(theList);

                    //the value of the term is the definition, append it also:
                    $('<dd>' + dataItem[term] + '</dd>').appendTo(theList);
                }
            });
            
            //event handler for when the mouse enters ANY DT element
            $('dt').mouseenter(function(evt) {
                //remove the "active" class and button from other DT elements
                var previouslyActive = $('dt.active');
                previouslyActive.removeClass('active');
                previouslyActive.children('.define-button').remove();

                //add the "active" class to the targeted element
                var target = $(evt.target);
                target.addClass('active');
                
                //create a new button and put append it inside the target element
                var defineButton = $('<button class="define-button">define this term</button>');
                defineButton.appendTo(target);
            });
        }
    });
}

function addNewTerm(evt) {
    //stop the REAL submission:
    evt.preventDefault();

    //begin ajax
    $.ajax({
        url: 'glossary/terms',
        type: 'POST', //POST creates terms
        data: {
            term: $('#newTerm').val()
        },
        complete: function(xhr, status) {
            updateList(); //refresh the list with our update function
        }
    });
};

function defineTerm(evt) {
    var target = $(evt.target); //the element the mouse clicked on
    
    //get the next definition element
    var definitionElement = target.closest('dt').next('dd');

    //check for an existing "input" inside of the definition element
    var inputBox = definitionElement.children('input');
    if (inputBox.length !== 0) {
        //if one exists, focus it and exit
        inputBox.focus();
        return;
    }

    //create an input box
    inputBox = $('<input type="text">');

    //set its value to the text that is already in the definition element
    inputBox.val(definitionElement.text());

    //empty out the definition element, and inject the inputBox 
    definitionElement.empty();
    inputBox.appendTo(definitionElement);
    inputBox.focus();

    //create a save button
    var  saveButton = $('<button class="save-definition">save</button>');
    
    //inject it onto the definition element
    saveButton.appendTo(definitionElement);

}

function saveDefinition(evt) {
    var target = $(evt.target); //the save button that was clicked on
    
    //the nearest definition element
    var definitionElement = target.closest('dd');

    //the new definition is the value of the input box
    var newDefinition = definitionElement.children('input').val();

    //the text of the nearest term (removing the "define this term" text from the button)
    var term = definitionElement.prev('dt').text().replace('define this term', '');
    
    //the url is created dynamically by adding the term
    //- note that we change spaces into underscores
    var termUrl = "glossary/terms/" + term.replace(/\s/g, '_');

    $.ajax({
        url: termUrl, //use the url we created above
        type: 'PUT', //PUT is used to update
        data: {
            definition: newDefinition
        }, 
        success: function(data, status, xhr) {
            //clear out the definition element
            definitionElement.empty();
            
            //put the newDefinition text into the definition element
            definitionElement.text(newDefinition);
        }
    });
};

//global click handler
$(window).click(function(evt) {
    var target = $(evt.target);
    
    //addTerm button in top right
    if (target.attr('id') === 'addTerm') {
        addNewTerm(evt);
    }

    //define buttons that appears next to each term
    if (target.hasClass('define-button')) {
        defineTerm(evt);
    }

    //save buttons that appears while editing a term
    if (target.hasClass('save-definition')) {
        saveDefinition(evt);
    }
});

//call our updateList function right away, so that the list is displayed on page load
updateList(); 

