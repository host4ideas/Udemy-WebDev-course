if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
    var randomNumber1 = (Math.floor(Math.random() * 6) + 1);
    var randomNumber2 = (Math.floor(Math.random() * 6) + 1);
    var flagIcon = " <i class='fas fa-flag-checkered'></i> ";

    document.querySelector("div").children[1].querySelector("img").setAttribute("src", "images/dice" + randomNumber1 + ".png")

    document.querySelector("div").children[2].querySelector("img").setAttribute("src", "images/dice" + randomNumber2 + ".png")

    if (randomNumber1 > randomNumber2) {
        document.querySelector("h1").innerHTML =  flagIcon + "Player 1 Wins!";
    } else if (randomNumber1 < randomNumber2) {
        document.querySelector("h1").innerHTML = "Player 2 Wins!" + flagIcon;
    } else {
        document.querySelector("h1").innerHTML = flagIcon + "DRAW!!!" + flagIcon;
    }
}
