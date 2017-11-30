// Create a list that holds all the cards
var cards = [
  "images/rice.png",
  "images/rice.png",
  "images/noodle.png",
  "images/noodle.png",
  "images/springroll.png",
  "images/springroll.png",
  "images/teapot.png",
  "images/teapot.png",
  "images/xiaolongbao.png",
  "images/xiaolongbao.png",
  "images/teacup.png",
  "images/teacup.png",
  "images/ricespoon.png",
  "images/ricespoon.png",
  "images/chopsticks.png",
  "images/chopsticks.png"
];

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
// Shuffle the list of cards using the "shuffle" method
shuffle(cards);

// Loop through each card and create its HTML
cards.forEach(function(card, index, cards){
    var cardHtml = '<li class="card"><img class="front" src="' + cards[index] + '"></li>';
    // Add each card's HTML to the page
    $(".deck").append(cardHtml);
    $(".front").hide();
});

var openedCards = [],
    moveCount = 0,
    $moves = $(".moves"),
    matchCount = 0,
    $congrats = $("<div id='congrats'><div class='congrats-content'><h1>Congratulations! You won!</h1><p>With <span class='moves'></span> Moves, <span class='minutes'></span> <span class='minuteUnit'>Minutes</span> <span class='seconds'></span> Seconds and <span class='stars'></span> Stars.<br>Wooooooooo!</p><button class='congrats-button'>Play again!</button></div></div>"),
    $restart = $(".restart"),
    star = 3,
    $firstStar = $(".stars li:nth-child(1)").children(),
    $secondStar = $(".stars li:nth-child(2)").children(),
    $thirdStar = $(".stars li:nth-child(3)").children();

// When the restart button is clicked, the game starts over
$restart.click(function(){
  window.location.reload();
});

// Timer
var start = new Date().getTime(),
		isFirstClick = false,
    timer, seconds, minutes, secs, mins;

function setTimer() {
  // Reference: https://www.sitepoint.com/creating-accurate-timers-in-javascript/
  var time = new Date().getTime() - start,
      // Reference: https://discussions.udacity.com/t/having-trouble-with-timer-in-memory-game-final-project/397591
  seconds = Math.floor((time % (1000 * 60)) / 1000);
  minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  secs = (seconds < 10) ? ('0' + seconds) : (seconds),
  mins = (minutes < 10 ) ? ('0' + minutes) : (minutes);
  $("#seconds").text(secs);
  $("#minutes").text(mins);
}

$("li").click(function(){
  // Timer starts only at the first click
  if (!isFirstClick) {
    timer = window.setInterval(setTimer, 1000);
    isFirstClick = !isFirstClick;
  };

  var currentCard = this;
  // Only two cards can be opened at a time
  if (!$(currentCard).hasClass("open") && openedCards.length < 2) {
    setTimeout(function(){
      $(currentCard).children("img").show();
    }, 100);
    $(currentCard).addClass("open");
    openedCards.push($(currentCard));
  }

  // When two cards are selected
  if (openedCards.length === 2) {
    // Determine if a match occurs
   var  firstCard = openedCards[0].children().attr("src");
   var  secondCard = openedCards[1].children().attr("src");
    if (firstCard === secondCard) {
      openedCards[0].addClass("match");
      openedCards[1].addClass("match");
      openedCards = [];
      matchCount++;
      // Increment the move counter and display it on the page
      moveCount++;
      $moves.text(moveCount);
    } else {
      setTimeout(function() {
        openedCards[0].removeClass("open").children("img").hide();;
        openedCards[1].removeClass("open").children("img").hide();
        openedCards = [];
        // Increment the move counter and display it on the page
        moveCount++;
        $moves.text(moveCount);
      }, 1000);
    }
    // Star ratings
    if (moveCount === 12) {
      $thirdStar.replaceWith("<i class='fa fa-star-o'></i>");
      star = 2;
      }
    if (moveCount === 16) {
      $thirdStar.replaceWith("<i class='fa fa-star-o'></i>");
      $secondStar.replaceWith("<i class='fa fa-star-o'></i>");
      star = 1;
    }
    if (moveCount === 20) {
      $thirdStar.replaceWith("<i class='fa fa-star-o'></i>");
      $secondStar.replaceWith("<i class='fa fa-star-o'></i>");
      $firstStar.replaceWith("<i class='fa fa-star-o'></i>");
      star = 0;
    }
}
    // When all cards have matched, display a box with the final score
    if (matchCount === 8) {
      $("body").append($congrats);
      clearInterval(timer);
      $congrats.find(".moves").text(moveCount);
      $congrats.find(".stars").text(star);
      if (mins === '00') {
        $congrats.find(".minuteUnit").replaceWith('');
      } else {
        $congrats.find(".minutes").text(mins);
      }
      $congrats.find(".seconds").text(secs);
      $congrats.show();
      $congrats.find(".congrats-button").click(function(){
        window.location.reload();
      });
    }
  });
