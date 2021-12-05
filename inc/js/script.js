/*
window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(f){return setTimeout(f, 1000/60)} // simulate calling code 60 
 
window.cancelAnimationFrame = window.cancelAnimationFrame
    || window.mozCancelAnimationFrame
    || function(requestID){clearTimeout(requestID)} //fall back
*/


let pageid = Number(window.location.hash.replace("#", ""))
const animatonRate = 50
pageid = (pageid == 0) ? 3 : pageid

const BACKGROUNDS = [
  undefined,  //0
  undefined,   //1
  "page 7.png", //2
  "page 7.png", //3
  "page 7.png", //4
  "page 7.png", //5
  "page 2.png", //6
  "page 2.png", //7
  "",           //8
  "",           //9
]

$(document).ready(($) => {
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
      window.location.hash = pageid
      if (pageid === 8) {

        const configNoLoop = {
          imagesPath: "/inc/img/lika/Lika_Skizb_resized",
          images_slug: "Lika_Skizb_",
          lastNumber: 177,
          positions: 5,
          loop: false
        }

        const configLoop = {
          imagesPath: "/inc/img/lika/Lika_Loop_resized",
          images_slug: "Lika_Loop_",
          lastNumber: 88,
          positions: 5,
          loop: true
        }

        initAnimation(pageid, configNoLoop, () => {
          initAnimation(pageid, configLoop, undefined, animatonRate)
        }, animatonRate)
      }
    });

    $(BOOK).turn('page', pageid);
  })();


  function initAnimation(pageid, config, cb, animatonRate) {
    let linkSequence = new LinkSequenceGenerator(config)
    let pageCurrent = $(".p" + pageid)
    let pageNext = $(".p" + (pageid + 1))
    next(linkSequence)

    function next(linkSequence) {
      let nextLink = linkSequence.next()
      if (nextLink.done) {
        if (cb) {
          cb()
        }

        return
      }

      let img = new Image()
      img.src = nextLink.path
      img.onload = () => {
        pageCurrent.css("background-image", `url('${img.src}')`)
        pageNext.css("background-image", `url('${img.src}')`)
        setTimeout(() => {
          next(linkSequence)
        }, animatonRate)

      }

      img.error = () => {
        setTimeout(() => {
          next(linkSequence)
        }, animatonRate)
      }
     
    }

    //Load images to DOM, for performance reasons
    /*
    let imagesPlace = $("#images-hidden")
    imagesPlace.empty()
    let d = linkSequence.next()
    do {
      d = linkSequence.next()
      imagesPlace.append($("<img>").attr("src", d.path))
    } while (!d.done)

    linkSequence.reset()
    */

    //Make Animation
    /*
    let intervalID = setInterval(() => {
      console.log("interval statrted")
      let nextLink = linkSequence.next()
      //console.log(nextLink.path)
      
      if (nextLink.done) {
        console.log("end of animation")
        if (cb!=undefined) {
          console.log("end of animation 1")
          clearInterval(intervalID)  
          cb()
        }
        clearInterval(intervalID)
      }
      else {
        pageCurrent.css("background-image", `url('${nextLink.path}')`)
        pageNext.css("background-image", `url('${nextLink.path}')`)
      }
    }, 100);
    */
  }


  async function getPage(pageNum, container) {
    const res = await fetch(
      `./pages/${$("html").attr("lang")}/p-${pageNum}.html`
    );
    if (res.status != 404) {
      const pageHtml = await res.text();
      $("<div>")
        .addClass("page")
        .css("background-image", `url('./inc/img/${BACKGROUNDS[pageNum]}')`)
        .html(pageHtml)
        .appendTo(container);
      await getPage(++pageNum, BOOK);
    }
  }
});
