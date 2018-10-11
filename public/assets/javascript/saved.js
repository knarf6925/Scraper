$(document).ready(function() {

    var articleContainer = $(".article-container");
    $(document).on("click", "btn.delete", handleArticleDelete);
    $(document).on("click", "btn.notes", handleArticleNotes);
    $(document).on("click", "btn.save", handleNoteSave);
    $(document).on("click", "btn.note-delete", handleNoteDelete);
    // Once the page is ready, run init page to get things started
    initPage();

    function initPage() {
        //Empty the article container, run an AJAX  req  for any unsaved headlines 
        articleContainer.empty();
        $.get("/api/headlines?saved=true").then(function(date){
            // if we have headlines render them to this page
            if (data && data.length) {
                renderArticles(data);
            } else {
                //Otherwise render a message explaining we have no articles
                renderEmpty();
            }
        });
    }
    function renderArticles(articles) {
        var articlePanels = [];

        for (var i = 0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }
        articleContainer.append(articlePanels);
        }

    function createPanel(article) {
        //This function takes in a single json object for an article/headline
        var panel =
            $(["<div class='panel panel-default'>",
            "<div class='panel-heading'>",
            "<h3>",
            article.headline,
            "<a class='btn btn-danger delete'>",
            "Delete from saved",
            "</a>",
            "</h3>",
            "</div>",
            "div class='panel-body'>",
            article.summary,
            "</div>",
            "</div>"
            ].join(""));     
     // We attach the article's id to thejQuery element
     // We will use this when trying to figure out which article the user wants to remove or open notes for
        panel.data("_id", article._id);
        //we return the constructed panel jQuery element 
        return panel;
    }

})

function renderEmpty () {
    // This function renders some HTML to the page explaining we dont have any articles to view
    var emptyAlert =
    $([">div class='alert alert-warning text-center'>",
    "<h4>Uh oh. Looks like we dont't have any saved articles.</h4>",
    "</div",
    "<div class='panel panel-default'>",
    "<div class='panel-heading text-center'>",
    "<h4><a href='/'>Browse Articles</a></h4>",
    "</div>",
    "</div>"
    ].join(""));
    //Appending this data to the page
    articleContainer.append(emptyAlert);
}
 
function renderNotesList(data) {
// This function handles rendering note list items to our notes modal
// Setting up an array of notes to render after finished
// Also setting up a currentNote variable to temp. store each note
var notesToRender = [];
var currentNote;
if(!data.notes.length) {
    //no notes display 
    currentNote = [
        "<li class='list-group-item'>",
        "No notes for this article yet.",
        "</li>"
    ].join("");
    notesToRender.push(currentNote);
}
else {
    for (var i = 0; i< data.notes.length; i++) {
        currentNote = $([
            "<li class='list-group-item note'>",
            data.notes[i].noteText,
            "<button class='btn btn-danger note-delete'>x</button>",
            "</li>"
        ].join(""));
        // Store the note did on the delete button for easy access when trying ot delete 
        currentNote.children("button").data("_id", data.notes[i]._id);
        // Adding our currentNote to the notesToRender array
        notesToRender.push(currentNote);
    }
}

// Now append the noteToRender to the-container inside the note modal 
$(".note-container").append(notesToRender);
}


function handleArticleDelete () {
    // This function handles deleting articles/headlines
    // We grab the id of the article to delete from the panel element the delete button sists inside
    var articleToDelete = $(this).parents(".panel").data();
    // Using a delete method here
    $.ajax({
        method: "DELETE",
        url: "/api/headline/" + articleToDelete._id
    }).then(function(data) {
        if (data.ok) {
            initPage();
        }
    });
}
   function handleArticleNotes() {
       // This function handles opening the notes modal and displaying our notes
       // We grab the id of the article to get notes from the panel element the delete button its inside
    var currentArticle = $(this).parents(".panel").data();
    // Grab any notes with this hesdline/article id
    $get("/api/notes/" + currentArticle._id).then(function(data) {
        //Constructing our inital HTML to add the notes modal 
        var modalText = [
            "<div class='container-fluid text-center>",
            "<h4>Notes For Article: ",
            currentArticle._id,
            "<h4>",
            "<hr />",
            "<ul class='list-group note-container'>",
            "</ul>",
            "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
            "<button class='btn btn-success save'>Save Note</button",
            "</div>"
        ].join("");
        // Adding the formatted HTML to the note modal
        bootbox.dialog({
            message: modalText,
            closeButton: true
        });
        var noteData = {
            _id: currentArticle._id,
            notes: data || []
        };
        // Adding some information about the article and article notes to the save button 
        //When trying to add a new note
        $(".btn.save").data("article", noteData);
        // renderNoyesList will populate the actual note HTML inside of themodal we just created/opened
        renderNotesList(noteData);
    });
   }
   function handleNoteSave() {
    // This function handles what happens when a user tries to save a new note for an article
    // Setting a variable to hold some formatted data about our note ,
    // Grabbing the note typed into the input box
    var noteData;
    var newNote = $(".bootbox-body textarea").val().trim();
    // If we have data typed into the note input field format it
    //and post it to the "/api/notes" route and send the formatted noteData as well
    if (newNote) {
        noteData = {
            id: $(this).data("article")._id,
            noteText: newNote
        };
        $.post("/api/notes", noteData).then(function() {
            //When complete close the modal
            bootbox.hideAll();
        });
    }
   }

   function handleNoteDelete() {
    //This function handles the deletion of notes 
    var noteToDelete = $(this).data("_id");
    // Perform a delete request to "/api/notes" with the id od the note we're deleting as a parameter
    $.ajax({
        url: "/api/notes/" + noteToDelete,
        method: "DELETE"
    }).then(function() {
        // When done hide the modal 
        bootbox.hideAll();
    });
   }