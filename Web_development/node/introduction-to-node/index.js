var superhero = require("superheroes");
var supervillain = require("supervillains");

var myHero = superhero.random();
var myVillain = supervillain.random();

console.log(myHero + " attacked " + myVillain);