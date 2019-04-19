$(".clear-articles").on("click", function(event){
    console.log("clicked")
    
    event.preventDefault();
    $.ajax({
        url: "/cleararticles",
        method: "DELETE",
    }).then(function(response){
        console.log("all articles removed")
    })
})

$("h1").on("click", function(){
    console.log("h1 clicked")
})