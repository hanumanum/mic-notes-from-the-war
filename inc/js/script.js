let allowSounds = false
const coverVideo = document.getElementById("coverVideo")
const coverAudio = document.getElementById("coverAudio")
const turnSound = document.getElementById("turnsound")
let currVideo = null
let greenSoundPlayers

let videosToPlay = []
let pageid = parseInt(Number(window.location.hash.replace("#", "")))
let inPageVideos = []

pageid = (pageid == 0 || pageid == 1) ? 2 : pageid

const outline = document.getElementById("outline")

$(document).ready(($) => {
  const ROOT_ELEMENT = $("#root");
  const BOOK = $("<div>").attr("id", "book").appendTo(ROOT_ELEMENT);

  //hideCoverPage()
  //initBook(BOOK)
  initCoverPage(BOOK)
});


function initBook(BOOK) {
  (async () => {
    $("#outline").fadeIn(1000)
    initControls(BOOK)
    turnByKeyboard(BOOK)

    await getAllPages(BOOK);
    $(BOOK).css("opacity", "1");
    $(BOOK).turn({
      width: (outline.width * 86) / 100,
      height: window.innerHeight - 55 - 160,
    });

    const dblVid = initDoubledVideos()
    $(BOOK).bind("turned", function (a, pageid) {
      dblVid(pageid)
      fillPageInfo(fixToLeftPage(pageid))
    })


    $(BOOK).bind('turn', function (a, pageid) {
      if (pageid == 0 || pageid == 1) {
        setTimeout(() => {
          $(BOOK).turn('page', 2);
        }, 500)
      }

      if (allowSounds) {
        turnSound.play()
      }


      pageid = fixToLeftPage(pageid)
      window.location.hash = pageid
    });

    fixControlsPositions()
    $(BOOK).turn('page', pageid);
    initTOCHover()
    greenSoundPlayers = new GreenAudioPlayer('.autor-audio-green');
    
  })();
}

