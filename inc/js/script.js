let pageid = Number(window.location.hash.replace("#", ""))
const turnSound = document.getElementById("turnsound")
let animationSound = undefined
pageid = (pageid == 0 || pageid == 1) ? 2 : pageid

let animate = false
const animatonRate = 50

const outline = document.getElementById("outline")
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
  "page 6.png", //12
  "page 6.png", //13
  "page 6.png", //14
  "page 6.png", //15
  "page 6.png", //16
  "page 6.png", //17

]

$(document).ready(($) => {
  const ROOT_ELEMENT = $("#root");
  const BOOK = $("<div>").attr("id", "book").appendTo(ROOT_ELEMENT);

  (async () => {
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

      turnSound.play()

      animate = false
      pageid = fixToLeftPage(pageid)
      window.location.hash = pageid

      stopAnimationSound()
      initAnimation(pageid)
      fixControlsPositions()
    });
    $(BOOK).turn('page', pageid);
  })();

});
