let pageid = Number(window.location.hash.replace("#", ""))
const turnSound = document.getElementById("turnsound")
let animationSound = undefined
pageid = (pageid==0 || pageid == 1) ? 2 : pageid

let animate = false
const animatonRate = 50

const BACKGROUNDS = [
  undefined,  //0
  undefined,   //1
  undefined,  //2
  undefined,  //3
  "page 7.png", //4
  "page 7.png", //5
  "page 7.png", //6
  "page 7.png", //7
  "page 2.png", //8
  "page 2.png", //9
  "",           //10
  "",           //11
]

$(document).ready(($) => {
  turnByKeyboard()
  const ROOT_ELEMENT = $("#root");
  const BOOK = $("<div>").attr("id", "book").appendTo(ROOT_ELEMENT);


  (async () => {
    await getPage(1, BOOK);
    $(BOOK).css("opacity", "1");
    $(BOOK).turn({
      width: (window.innerWidth * 60) / 100,
      height: window.innerHeight - 55 - 120,
    });

    $(BOOK).bind('turn', function (a, pageid) {
      if (pageid == 0 || pageid == 1) {
        setTimeout(() => {
          $(BOOK).turn('page', 2);
        }, 500)
      }

      turnSound.play()

      animate = false
      pageid = fixToLeftPage(pageid)
      window.location.hash = pageid

      stopAnimationSound()
      initAnimation(pageid)

    });


    $(BOOK).turn('page', pageid);
  })();


  function turnByKeyboard() {
    document.addEventListener("keydown", keyboardControl);

    function keyboardControl(e) {
      if (e.key == "ArrowRight") {
        $(BOOK).turn('next')
      }
      else if (e.key == "ArrowLeft") {
        $(BOOK).turn('previous')
      }
    }

  }

});




async function getPage(pageNum, container) {
  const res = await fetch(
    `./pages/${$("html").attr("lang")}/p-${pageNum}.html`
  );
  if (res.status != 404) {
    const pageHtml = await res.text();

    const bookPage = $("<div>").addClass("page").html(pageHtml)
    if (BACKGROUNDS[pageNum] != undefined) {
      bookPage.css("background-image", `url('./inc/img/${BACKGROUNDS[pageNum]}')`)
    }
    bookPage.appendTo(container);

    await getPage(++pageNum, container);
  }
}

function initAnimation(pageid, cb) {
  let page = getDataByPageID(pageid)

  if (page != null) {
    initAnimationSound(pageid)

    animate = true
    const configNoLoop = page.configNoLoop
    const configLoop = page.configLoop

    if (cb !== undefined) {
      animateFrames(pageid, configNoLoop, cb, animatonRate)
    }
    else {
      animateFrames(pageid, configNoLoop, () => {
        if (configLoop !== undefined) {
          animateFrames(pageid, configLoop, undefined, animatonRate)
        }
      }, animatonRate)

    }
  }
}

function stopAnimationSound() {
  if (animationSound) {
    animationSound.pause()
    animationSound.currentTime = 0
  }
}


function initAnimationSound(pageid) {
  animationSound = document.getElementById("animation-sound-page" + pageid)
  if(animationSound){
    animationSound.loop = true
    animationSound.play()
  }
}

function fixToLeftPage(pageID) {
  return (pageID % 2 == 0) ? pageID : pageID - 1
}