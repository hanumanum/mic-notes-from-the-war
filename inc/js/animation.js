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