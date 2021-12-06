class LinkSequenceGenerator {
    constructor({imagesPath, images_slug, lastNumber, positions, loop}) {
        this.images_slug = images_slug
        this.imagesPath = imagesPath
        this.lastNumber = lastNumber
        this.positions = positions
        this.loop = loop
        //this.linksList = this.generateLinks()
        this.index = 0
    }

    generateLinks() {
        let linksList = []
        for (let i = 0; i <= this.lastNumber; i++) {
            let number = this.addZerros(this.positions, String(i))
        }
        return linksList
    }
    reset(){
        
        this.index = 0
    }

    addZerros(targetCount, str) {
        while (str.length < targetCount) {
            str = "0" + str
        }

        return str
    }

    next() {
        let fileName = this.images_slug + this.addZerros(this.positions, String(this.index)) + ".png"
        let fullPath = this.imagesPath + "/" + fileName
        this.index++
        if (this.loop && this.index === this.lastNumber + 1) {
            this.index = 0
        }

        if (this.loop) {
            return {
                done: false,
                path: fullPath
            }
        }
        else {
            return {
                done: (this.index > this.lastNumber+1),
                path: (this.index > this.lastNumber+1) ? null:fullPath
            }

        }

    }
}



/* Tests */
/*
let linkSequence = new LinkSequenceGenerator("/inc/img/lika/Lika_Skizb", "Lika_Skizb_", 5, 6, false)
let d = linkSequence.next()
do {
    console.log(d)
    d = linkSequence.next()
} while (!d.done)
console.log(d)
d = linkSequence.next()


let linkSequence1 = new LinkSequenceGenerator("/inc/img/lika/Lika_Skizb", "Lika_Skizb_", 5, 6, true)
let d1 = linkSequence1.next()
setInterval(() => {
    console.log(d1)
    d1 = linkSequence1.next()
}, 1000)
*/