let keys = {};
let distance = 5;
let counter = 0;
let score = 0;
let jetSize;
let missileSize;
let mainInterval;
// Detect multiple keydowns reference:
// https://stackoverflow.com/questions/4954403/can-jquery-keypress-detect-more-than-one-key-at-the-same-time
$(document).keydown(function (e) {
    keys[e.key] = true;
});

$(document).keyup(function (e) {
    delete keys[e.key];
});

function jetMove(direction, distance) {
    if (direction === "up") {
        if ($("#jet").position().top - distance < 0) return;
        $("#jet").css("top", $("#jet").position().top - distance + "px");
    } else if (direction === "down") {
        if ($("#jet").position().top + distance > $("#game-canvas").height() - 50) return;
        $("#jet").css("top", $("#jet").position().top + distance + "px");
    } else if (direction === "left") {
        if ($("#jet").position().left - distance < 0) return;
        $("#jet").css("left", $("#jet").position().left - distance + "px");
    } else if (direction === "right") {
        if ($("#jet").position().left + distance > $("#game-canvas").width() - 50) return;
        $("#jet").css("left", $("#jet").position().left + distance + "px");
    }
}

function checkJetMove() {
    $("#jet").css("transform", "");
    if (Object.keys(keys).length === 0) return;
    $("#jet img").removeClass("rotate-jet");
    if (keys["ArrowLeft"]) {
        jetMove("left", distance);
    }
    if (keys["ArrowRight"]) {
        jetMove("right", distance);
    }
    if (keys["ArrowUp"]) {
        jetMove("up", distance);
        $("#jet").css("transform", "rotate(-30deg)");
    } else if (keys["ArrowDown"]) {
        jetMove("down", distance);
        $("#jet").css("transform", "rotate(30deg)");
    }
    else {
        $("#jet").css("transform", "");
    }
}

function addMissile() {
    let newMissile = document.createElement("img");
    $(newMissile).addClass("missile");
    // Randomise missile location and delay
    let missileLocation = Math.random() * $("#game-canvas").height();
    missileLocation = missileLocation - 50 < 0 ? missileLocation : missileLocation - 50;
    $(newMissile).css("top", missileLocation);
    $(newMissile).css("animation-delay", Math.random() * 2 + "s");
    // After animation has ended, reset the missile
    newMissile.addEventListener("animationend", function() {
        $(this).remove();
        addMissile();
    });
    $("#game-canvas").append(newMissile);
}

function checkCollision() {
    let missiles = $(".missile");
    // check every missile whether it hits the jet
    for (let i = 0; i < missiles.length; ++i) {
        let verticalCollision = $(missiles[i]).position().top > $("#jet").position().top - missileSize && $(missiles[i]).position().top < $("#jet").position().top + jetSize;
        let horizontalCollision = $(missiles[i]).position().left > $("#jet").position().left - missileSize && $(missiles[i]).position().left < $("#jet").position().left + jetSize;
        if (verticalCollision && horizontalCollision) {
            $(missiles).css("animation-play-state", "paused");
            $("#game-over").show();
            $("#game-canvas").addClass("unclickable");
            clearInterval(mainInterval);
        }
    }
}

function mainLoop() {
    $("#jet img").addClass("rotate-jet");
    checkJetMove();
    checkCollision();
    if (!(counter % 100)) {
        addMissile();
        updateScore(score + 100);
    }
    counter++;
}

function updateScore(newScore) {
    score = newScore;
    $(".score").text(score);
}

function init() {
    // Start the game with 1 missile
    addMissile();
    // Get the missile and jet size, for calibtrating collision detection
    jetSize = $("#jet").width();
    missileSize = $(".missile").width();
    // Start the game with score = 0
    updateScore(0);
    $("#game-canvas").addClass("unclickable");
    $("#game-over").hide();
    $("#play-again-btn").click(function() {
        // Reset score
        updateScore(0);
        // Reset missiles
        $(".missile").remove();
        addMissile();
        // Reset display
        $("#game-over").hide();
        $("#how-to-play").show();
    });
    $("#start-btn").click(function() {
        $("#how-to-play").hide();
        $("#game-canvas").removeClass("unclickable");
        mainInterval = setInterval(mainLoop, 10);
    });
}

$(document).ready(() => {
    init();
});