/* ===== Event initiator Functions ==== */
function initStartButtonFix() {
  const coverVideo = $("#coverVideo")
  const startButton = $("#start")

  startButton.css({
    "top": coverVideo.offset().top + 7 * (coverVideo.height() / 8)
  })
}


function initDoubledVideos() {
  const inPageVideos = []

  const check = function (pageid) {
    const leftPageId = pageid % 2 == 0 ? pageid : pageid - 1
    const currVideo1 = ($(".p" + (leftPageId)).find(".full-page-video")).get(0)
    const currVideo2 = ($(".p" + (leftPageId + 1)).find(".full-page-video")).get(0)

    if (currVideo1 && currVideo2) {
      inPageVideos.push(currVideo1)
      inPageVideos.push(currVideo2)

      for (let v of inPageVideos) {
        v.play()
      }

    }
    else {
      for (let v of inPageVideos) {
        v.pause()
        v.currentTime = 0
      }
      inPageVideos.splice(0, inPageVideos.length)
    }

  }

  return check;

}

function initControls(BOOK) {

  $(".controls-start").click(() => {
    window.location = "/"
  })

  $(".controls-toc").click(() => {
    BOOK.turn("page", 4);
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

function makeNewPage(htmltext, backgroundStyle, authorName, title, pageNumber, totalNumber) {
  if (!htmltext) {
    htmltext = ""
  }
  return `<div class="page" style="${backgroundStyle}" data-author="${authorName}" data-title="${title}" data-page-number=${pageNumber} data-total-number=${totalNumber}>
  <div class="page-article-page">${htmltext}</div></div>`
}


function paginateArticles(_html) {
  const parser = new DOMParser();
  const pages = $(parser.parseFromString(_html, 'text/html'));

  $.each(pages.find(".page-article-page"), function (i, p) {
    const parts = $(p).find("part").get() //.reverse()
    const backgroundStyle = $(p).parent().attr("style")
    const authorName = $(p).parent().data("author")
    console.log(authorName)
    const title = $(p).parent().data("title")

    if (parts.length % 2 == 1) {
      parts.push("")
    }

    for (let i = 0; i < parts.length; i++) {
      let part = parts[i]
      let d = makeNewPage(part.innerHTML, backgroundStyle, authorName, title, i + 1, parts.length)
      $(p, pages).parent().before(d)
    }

    $(p, pages).parent().remove()

  })

  return $(pages).find("body").html();
}

/* ============== Other helper functions ==================== */
async function getAllPages(container) {
  const res = await fetch(
    `./pages/${$("html").attr("lang")}/all.html`
  );
  if (res.status != 404) {
    const pageHtml = paginateArticles(await res.text());

    const bookPage = $(pageHtml);
    bookPage.appendTo(container);
  }
}


async function getPage(pageNum, container) {
  const res = await fetch(
    `./pages/${$("html").attr("lang")}/p-${pageNum}.html`
  );
  if (res.status != 404) {
    const pageHtml = await res.text();

    const bookPage = $(pageHtml);
    bookPage.appendTo(container);
    await getPage(++pageNum, container);
  }
}


function fixToLeftPage(pageID) {
  return (pageID % 2 == 0) ? pageID : pageID - 1
}

function fillPageInfo(pageid) {
  const title = $(".p" + pageid).data("title")
  const author = $(".p" + pageid).data("author")
  const pageNumber = $(".p" + pageid).data("page-number")
  const totalNumber = $(".p" + pageid).data("total-number")
  const page = ($("html").attr("lang") == "en") ? "page" : "էջ"

  let pageStr = ""
  if (!author) {
    pageStr = `<span class="title">${title}</span>`
  }
  else if (!pageNumber) {
    pageStr = `<span class="title">${title}</span> / ${author}`
  }
  else {
    pageStr = `<span class="title">${title}</span> / ${author} ${page} ${pageNumber}/${totalNumber}`
  }

  $(".page-info").html(pageStr)
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

  $(".page-info").css({
    "top": outline.offset().top - 35,
    "left": outline.offset().left - 20,
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


function initTOCHover() {
  const whitePartSize = 10
  const hoverImage = $("<img>").attr("src", "./inc/img/hover.png").addClass("hoverImage")
  $(".toc-thumbnail").hover(mouseIn)

  function mouseIn() {
    hoverImage.width($(this).width() + 2 * whitePartSize)
    hoverImage.css({ "margin-left": -$(this).width() - whitePartSize, "margin-top": -whitePartSize })
    $(this).after(hoverImage)
  }

}