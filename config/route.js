//Server routes

//Bring headlines and notes from the controller
var scrape = require("../scripts/scrape");
var notesController = require("../controllers/notes");

module.exports = function(router) {
    //This route renders the homepage
    router.get("/", function(req, res){
        res.render("home");
    })
    //This route renders the saved page
    router.get("/saved", function(req, res) {
        res.render("saved");
    });

    router.get("api/fetch", function(req, res){
        headlinesController.fetch(function(err, doc) {
            if (!docs || docs.insertedCount === 0) {
                res.json({
                    message: "No new articles today. Check back later"
                });
            }
            else {
                res.json({
                    message: "Added " + doc.insertedCount + " new articles!"
                });
            }
        });
    });
    router.get("/api/headlines", function(req, res) {
        var query = {};
        if (req.query.saved) {
            query = req.query;
        }

        headlinesController.get(query, function(data) {
            res.json(data);
        });
    });

    router.delete("/api/headlines/:id", function(req, res) {
        var query = {};
        query._id = req.params.id;
        headlinesController.delete(query, function(err, data) {
            res.json;
        });
    });

    router.patch("/api/headlines", function(req, res) {
        headlinesController.update(req.body, function(err, data) {
            res.json(data);
        });
    });
    router.get("/api/noyes/:headline_id?", function(req, res) {
        var query = {};
        if (req.params.headline_id) {
            query._id = req.params.headline_id;
        }
        notesController.get(query, function(err, data) {
            res.json(data);
        });
    });

    router.delete("/api/notes/:id", function(req, res) {
        var query = {};
        query._id = req.params.id;
        notesController.delete(query, function(err, data) {
            res.json(date);
        });
    });
    router.post("/api/notes", function(req, res){
        notesController.save(req.body, function(data) {
            res.json(data);
        });
    });
}