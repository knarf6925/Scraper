// Parses our HTML and helps us find elements
var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var request = require("request");


// Making a request for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
request("https://old.reddit.com/r/webdev/", function(error, response, html) {

// Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(html);

    // An empty array to save the data that we'll scrape
    var results = [];
