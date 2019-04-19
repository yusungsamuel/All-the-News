var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var PORT = 3000;

var db = require("./models")

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";


var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(MONGODB_URI);

app.get("/scrape", function(req, res){
    axios.get("https://myanimelist.net/news/tag/new_anime").then(function(response){
        
        var $ = cheerio.load(response.data);

        $("div.news-unit").each(function(i, element){
            var result = {}

            result.title = $(element).find("p.title").text();
            result.link = $(element).find(".title").children().attr("href");
            result.description = $(element).find("div.text").text();
            result.image = $(element).children("a").find(".image").attr("src");

            db.Article.create(result).then(function(dbArticle){
                console.log(`${dbArticle} is added to database`)
            })
        })
        res.send("SCRAPED")
    })
})

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });