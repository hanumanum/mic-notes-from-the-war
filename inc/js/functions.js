/* ===== Event initiator Functions ==== */
function initStartButtonFix() {
  const coverVideo = $("#coverVideo")
  const startButton = $("#start")

  startButton.css({
    "top": coverVideo.offset().top + 5 * (coverVideo.height() / 6)
  })

  /*
  outline.offset().top + outline.innerHeight() - adjustTop - 30,
    "left": outline.offset().left + outline.innerWidth() + 10,
  */

}


function initControls(BOOK) {
  $(".controls-start").click(() => {
    BOOK.turn("page", 2);
  })

  $(".controls-toc").click(() => {
    BOOK.turn("page", 6);
  })

  $(".controls-turn").click(() => {
    BOOK.turn("next");
  })

  $(window).resize(fixControlsPositions)

}

function turnByKeyboard(BOOK) {
  document.addEventListener("keydown", keyboardControl);

  function keyboardControl(e) {
    if (e.key == "ArrowRight") {
      BOOK.turn('next')
    }
    else if (e.key == "ArrowLeft") {
      BOOK.turn('previous')
    }
  }

}

/* ============== Other helper functions ==================== */
async function getPage(pageNum, container) {
  const res = await fetch(
    `./pages/${$("html").attr("lang")}/p-${pageNum}.html`
  );
  if (res.status != 404) {
    const pageHtml = await res.text();

    /*
    
    if (BACKGROUNDS[pageNum] != undefined) {
      bookPage.css("background-image", `url('./inc/img/${BACKGROUNDS[pageNum]}')`)
    }
    
    */
    const bookPage = $(pageHtml);
    bookPage.appendTo(container);
    await getPage(++pageNum, container);
  }
}


function fixToLeftPage(pageID) {
  return (pageID % 2 == 0) ? pageID : pageID - 1
}


function fixControlsPositions() {
  const adjustTop = 50
  const adjustLeft = 55
  const outline = $("#book")

  $(".controls-start").css({
    "top": outline.offset().top,
    "left": outline.offset().left - adjustLeft,
    "position": "fixed",
    "display": "block"
  })
  $(".controls-toc").css({
    "top": outline.offset().top + adjustTop,
    "left": outline.offset().left - adjustLeft,
    "position": "fixed",
    "display": "block"
  })

  $(".controls-turn").css({
    "top": outline.offset().top + outline.innerHeight() - adjustTop - 30,
    "left": outline.offset().left + outline.innerWidth() + 10,
    "position": "fixed",
    "display": "block"
  })
}


function switchSound(e) {
  allowSounds = !allowSounds
  const className = allowSounds ? "sound-icon-on" : "sound-icon-off"
  $(this).removeClass().addClass(className).addClass("share-icon")

  if (coverVideo) {
    coverVideo.muted = !allowSounds
  }

  if (coverAudio) {
    coverAudio.muted = !allowSounds
  }

  if (greenSoundPlayers) {
    greenSoundPlayers.player.volume = (allowSounds) ? 0.81 : 0
  }
}


function hideCoverPage() {
  $("#start").hide()
  if (coverVideo) {
    coverVideo.pause()
    $(coverVideo).hide()
  }
  if (coverAudio) {
    coverAudio.pause()
  }
}

function initCoverPage(BOOK) {
  coverVideo.play()
  coverVideo.onended = () => {
    if (allowSounds) {
      coverAudio.loop = true
      coverAudio.play()
    }
  }
  $(".sound-icon-off").click(switchSound)

  $(window).resize(initStartButtonFix)
  $(window).load(initStartButtonFix)
  $("#start").click(() => {
    hideCoverPage()
    initBook(BOOK);
  })

}
