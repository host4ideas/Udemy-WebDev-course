const buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];

var userClickedPattern = [];

let index = 0;

var level = 0;

function nextSequence() {
    userClickedPattern = [];
    level++;
    $("#level-title").text(level);

    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);

    // Flash efect
    $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);

    // Call to playsound
    playSound(randomChosenColour);

    // Register the user clicked button
    $(".btn").click(function () {
        userClickedPattern.push($(this).attr("id"));
        animatePress($(this).attr("id"));
        checkAnswer(level);
    });
}

function playSound(name) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

function animatePress(currentColour) {
    $("#" + currentColour).addClass("pressed");
    setTimeout(function () {
        $("#" + currentColour).removeClass("pressed");
    }, 100);
}

function checkAnswer(currentLevel) {
    if (gamePattern[index] != userClickedPattern[userClickedPattern.length - 1] || userClickedPattern.length > gamePattern.length) {
        index = 0;
        $("#level-title").text("Game lost");
        setTimeout(function () {
            $("#level-title").text("Press A Key to Start")
        }, 1000)
    } else if (userClickedPattern.length == gamePattern.length) {
        index++;
        nextSequence()
    }
}

// First keyboard interaction
(level == 0) ? $(document).keypress(function () {
    gamePattern = [];
    userClickedPattern = [];
    level = 0;
    nextSequence();
}) : false;
