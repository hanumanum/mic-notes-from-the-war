function animateFrames(pageid, config, cb, animatonRate) {
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
                if (animate) {
                    next(linkSequence)
                }
                else {
                    return
                }

            }, animatonRate)

        }

        img.onerror = () => {
            setTimeout(() => {
                if (animate) {
                    next(linkSequence)
                }
                else {
                    return
                }
            }, animatonRate)
        }

    }

}



function initAnimation(pageid, cb) {
    let page = getDataByPageID(pageid, animationsData)
  
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
    if (animationSound) {
      animationSound.loop = true
      animationSound.play()
    }
  }

  function getDataByPageID(pageID, animationsData) {
    for (let animD of animationsData) {
        if (animD.pageid == pageID) {
            return animD
        }
    }
    return null
}

/*
function initVideo(pageid) {
    let page = getDataByPageID(pageid, videosData)
    if (page != null) {
        let video = document.getElementById("video-page" + pageid)
        video.src = page.path
        video.play()
    }
}
*/