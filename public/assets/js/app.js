$(".clear-articles").on("click", function(event){
    console.log("clicked")
    
    event.preventDefault();
    $.ajax({
        url: "/cleararticles",
        method: "DELETE",
    }).then(function(response){
        window.location.reload()
    })
})

$(".scrape").on("click", function(){
    event.preventDefault();
    $.ajax({
        url: "/scrape",
        method: "GET",
    }).then(function(response){
        window.location.reload()
    })
})

$(".save-article").on("click", function(){
    event.preventDefault();
    $.ajax({
        url: "/save",
        method: "PUT",
    }).then(function(response){
        console.log(response)
    })
})