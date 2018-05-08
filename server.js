var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var path = require("path");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = process.env.PORT || 3000;
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
//mongoose.Promise = Promise;
//mongoose.connect(MONGODB_URI);


app.get("/", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            // If all Notes are successfully found, send them back to the client
            res.render("home", { article: dbArticle });
        })
        .catch(function (err) {
            // If an error occurs, send the error back to the client
            res.json(err);
        });

});

app.post("/scraper", function (req, res) {

    axios.get("https://www.nytimes.com/").then(function (response) {
        var $ = cheerio.load(response.data);

        $("h2.story-heading").each(function (i, element) {
            var result = {};
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            console.log(result);
            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    return res.json(err);
                });
        })
        res.end();
    });
});


app.get("/articles", function (req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({})
        .then(function (dbArticle) {
            // If all Notes are successfully found, send them back to the client
            res.render("home", { article: dbArticle });
        })
        .catch(function (err) {
            // If an error occurs, send the error back to the client
            res.json(err);
        });
});

app.post("/articles/:id", function (req, res) {
    if (req.params.id === "removeall") {
        db.Article.remove().then(function () {
            res.end();
        })
    } else {
        db.Article.remove({ "_id": req.params.id }).then(function () {
            res.end();
        })
    }
})

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});