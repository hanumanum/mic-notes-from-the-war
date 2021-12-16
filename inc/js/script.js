let allowSounds = false
const coverVideo = document.getElementById("coverVideo")
const coverAudio = document.getElementById("coverAudio")
const turnSound = document.getElementById("turnsound")
let greenSoundPlayers

let videosToPlay = []
let pageid = parseInt(Number(window.location.hash.replace("#", "")))

pageid = (pageid == 0 || pageid == 1) ? 2 : pageid

//let animationSound = undefined
//let animate = false
//const animatonRate = 50

const outline = document.getElementById("outline")

$(document).ready(($) => {
  const ROOT_ELEMENT = $("#root");
  const BOOK = $("<div>").attr("id", "book").appendTo(ROOT_ELEMENT);

  initCoverPage(BOOK)
});


function initBook(BOOK) {
  (async () => {
    $("#outline").fadeIn(1000)
    initControls(BOOK)
    turnByKeyboard(BOOK)

    await getPage(1, BOOK);
    $(BOOK).css("opacity", "1");
    $(BOOK).turn({
      width: (outline.width * 86) / 100,
      height: window.innerHeight - 55 - 160,
    });

    $(BOOK).bind('turn', function (a, pageid) {
      if (pageid == 0 || pageid == 1) {
        setTimeout(() => {
          $(BOOK).turn('page', 2);
        }, 500)
      }

      if (allowSounds) {
        turnSound.play()
      }


      animate = false
      pageid = fixToLeftPage(pageid)
      window.location.hash = pageid

      //stopAnimationSound()
      //initAnimation(pageid)

      /*
      if (pageid == 2) {
        videosToPlay = $(".inpageVideos")
        videosToPlay.trigger("play")
      }
      else {
        videosToPlay.trigger("pause")
      }
      */

      fixControlsPositions()

    });
    $(BOOK).turn('page', pageid);
    greenSoundPlayers = new GreenAudioPlayer('.autor-audio-green');
    initTOCHover()
  })();
}

function initTOCHover(){
  const whitePartSize = 10
  const hoverImage = $("<img>").attr("src", "./inc/img/hover.png").addClass("hoverImage")
  $(".toc-thumbnail").hover(mouseIn, mouseOut)

  function mouseIn(){
    hoverImage.width($(this).width()+2*whitePartSize)
    hoverImage.css({"margin-left": -$(this).width() - whitePartSize, "margin-top": -whitePartSize})
    $(this).after(hoverImage)
  }

  function mouseOut(){
    
  }
}

