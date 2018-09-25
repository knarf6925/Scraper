$(document).ready(function() {

    var articleContainer = $(".article-container");
    $(document).on("click", "btn.save", handleArticleSave);
    $(document).on("click", "scrape-new", handleArticleScrape);

    // Once the page is ready, run init page to get things started
    initPage();

    function initPage() {
        //Empty the article container, run an AJAX  req  for any unsaved headlines 
        articleContainer.empty();
        $.get("/api/headlines?saved=false")
        .then(function(data) {
            if (data && data.length) {
                renderArticles(data);
            }
            else {
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
            "<a class='btn btn-success save'>",
            "Save Article",
            "</a>",
            "</h3>",
            "</div>",
            "div class='panel-body'>",
            article.summary,
            "</div>",
            "</div>"
            ].join(""));     
     // Appending is data to the page
     articleContainer.append(emptyAlert);          
    }

},

function handleArticleSave () {
    // This function is triggered when the user wants to save an article
    //When we rendered the article initially, we attached a javascript object containing the headline id
    //to the element using the .data method. Here we retrieve that.
    var articleToSave = $(this).parents(".panel").data();
    articleToSave.saved = true;
    //Using a patch method to be semantic since this is an update to an exsisting record in our collection
    ajax({
        method: "patch",
        url:"/api/headlines",
        data: articleToSave
    }) 
    .then(function(data) {
        //if successful, mongoose will send back an object containing a key of "ok" with the value of 1
        //(which casts to "true")
        if (data.ok) {
            //Run the initPage function again. This will reload the entire list of articles
            initPage();
        }
    });
},

function handleArticleSave () {
    //This function handles the user clicking any "scrape new articles" buttons
    $.get("/api/fetch")
    .then(function(data){
        // if we are able to succesfully scrape the NYTimes and compare the articles to those
        //already in our collection, re render the articles on the page
        // and let teh user know how many unique articles we were able to see
        initPage();
        bootbox.alert("<h3 class='text-center m-top-80>" + data.message + "<h3>");

    });
})


