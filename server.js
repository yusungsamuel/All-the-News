var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

var PORT = process.env.PORT || 3000;

var db = require("./models")

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";


var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


app.engine("handlebars", exphbs({defaultLayout: "main"}))
app.set("view engine", "handlebars");


mongoose.connect(MONGODB_URI);

//home page
app.get("/", function(req, res){
    db.Article.find({}).then(function(dbArticles){
        // console.log(dbArticles)
        res.render("index", {articles: dbArticles})
    })
    
    
})

//scrape request
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
        res.end()
    })
})

//display all articles on main page
app.get("/articles", function(req, res){
    db.Article.find({})
    .then(function(dbArticle){
        res.json(dbArticle)
    })
    .catch(function(err){
        res.json(err)
    });
});

//write note
app.post("/articles/:id", function(req, res){
    db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.put("/save/:id", function(req, res){
    db.Article.findOneAndUpdate({_id: req.params.id}, {saved: true}, {new:true})
    .then(function(response){
            res.end()
        })
    .catch(function(err){
        console.log(err)
    })
})

app.get("/saved", function(req, res){
    db.Article.find({saved:true}).then(function(savedArticles){
        res.render("saved", {saved: savedArticles})
    })
})



//clear all articles in db
app.delete("/cleararticles", function(req, res){
    db.Article.deleteMany({})
    .then(res.end())
    .catch(function(err){
        console.log(err)
    }
    )
});





app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });