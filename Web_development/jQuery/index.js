$(document).ready(function () {
    $("h1").css("color", "red");
    h1OriginalColor = "red";
});

$("button").addClass("big-button");
console.log($("button").hasClass("big-button"));

$("#div button").css("font-size", "2rem");
console.log($("#div button").css("font-size"));

$("button.large-button").css("font-weight", "600");
console.log($("button.large-button").css("font-weight"));

$(".change-text button").text("<b>Changed text</b>");
$(".change-html button").html("<b>Changed html</b>");

// This two do the same
$("a").first().attr("href", "https://www.google.es")
$("a").eq(0).attr("href", "https://www.google.es")
console.log($("a").first().attr("href"));
// This wil work because returns a jQuery object
console.log($("a").eq(1).attr("href"));
// This won't work because returns a DOM element
// console.log($("a").get(1).attr("href"));

let h1 = $("h1").first();
$("h1").click(function () {
    $(this).css("color", "purple");
    h1OriginalColor = "purple";
});

$("button").click(function () {
    h1.css("color", "red");
    h1OriginalColor = "red";
});

$("input").keypress(function (event) {
    console.log(event.key);
});

$(document).keypress(function (event) {
    h1.text(event.key);
});

h1.on("mouseover", function () {
    h1.css("color", "yellow");
});

h1.on("mouseleave", function () {
    h1.css("color", h1OriginalColor);
});

// <button>New 1</button><h1>jQuery</h1>
$("#body-title").before("<button>New 1</button>");
// <h1>jQuery</h1><button>New 2</button>
$("#body-title").after("<button>New 2</button>");
// <h1><button>New 3</button>jQuery</h1>
$("#body-title").prepend("<button>New 3</button>");
// <h1>jQuery<button>New 4</button></h1>
$("#body-title").append("<button>New 4</button>");

$(".fade-in").click(function(){
    h1.fadeIn();
});
$(".fade-out").click(function(){
    $("h1").fadeOut();
});
$(".fade-toggle").click(function(){
    h1.fadeToggle();
});
$(".hide").click(function(){
    h1.hide();
});
$(".show").click(function(){
    h1.show();
});
$(".toggle").click(function(){
    h1.toggle();
});
$(".slide-toggle").click(function(){
    h1.slideToggle();
});
