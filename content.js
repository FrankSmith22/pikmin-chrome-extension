const C = document.createElement('canvas')
C.width=document.body.clientWidth
C.height=document.body.clientHeight
const CTX = C.getContext('2d')

const ONION_WIDTH = 180
const ONION_HEIGHT = 150

const PIKMIN_ARMY = []

class Sprite {
    constructor({ position, image, width, height }){
        this.position = position
        this.image = image
        this.width = width
        this.height = height
    }

    draw() {
        CTX.drawImage(this.image, this.position.x, this.position.y, this.width, this.height) // 20 and 25
    }
}

class PikminSprite extends Sprite {
    constructor({ position, image, width, height }){
        super({ position, image, width, height })
        this.bobStart = position.y // Make sure this is set as pikmin moves around the screen
        this.bobIndex = null
        
        // Looks crazy, but this is a list of the pixels away from bobStart to animate while bobbing
        this.BOB_ANIMATION = [1,2,3,4,5,6,7,8,9,10,9,8,7,6,5,4,3,2,1]
    }
    
    draw() {
        // First, if pikmin is already bobbing
        if(this.bobIndex !== null){
            if(this.bobIndex === this.BOB_ANIMATION.length - 1){
                // We've reached the end of the bob animation
                this.bobIndex = null
                this.position.y = this.bobStart
            }
            else {
                this.bobIndex++
                this.position.y = this.bobStart - this.BOB_ANIMATION[this.bobIndex]
            }
        }
        else {
            // Randomly decide if pikmin should animate. Make it 1/5 chance
            const shouldBob = Math.floor(Math.random() * 100) <= 1 //(True == 0 or 1)
            console.log(`should bob: ${shouldBob}`)
            if(shouldBob){
                // Begin bobbing animation
                this.isBobbing = true
                this.bobIndex = 0
                this.position.y = this.bobStart - this.BOB_ANIMATION[this.bobIndex]
            }
        }
        super.draw()
    }
}

const elementIsVisibleInViewport = (el, partiallyVisible = false) => {
    const { top, left, bottom, right } = el.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    return partiallyVisible
        ? ((top > 0 && top < innerHeight) ||
            (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
        : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};

function addPikminToCanvas() {    
    const pikminImage = new Image()
    pikminImage.onload = () => {
        const pikmin = new PikminSprite({
            position:{
                x: Math.floor(Math.random() * ONION_WIDTH),
                y: Math.floor(Math.random() * ONION_HEIGHT)
            },
            image: pikminImage,
            width: 20,
            height: 25
        })
        PIKMIN_ARMY.push(pikmin)
    }
    pikminImage.src = chrome.runtime.getURL('./images/red-pikmin.png')
}

function attachOnion() {
    const onion = document.createElement('img')
    onion.src = chrome.runtime.getURL('./images/onion.png')
    onion.style.zIndex = "999"
    onion.style.position = "absolute"
    onion.style.top = "0"
    onion.style.left = "0"
    onion.style.height = `${ONION_HEIGHT}px`
    onion.style.width = `${ONION_WIDTH}px`

    onion.addEventListener('click', addPikminToCanvas)
    
    document.body.prepend(onion)
}

function attachCanvas() {
    C.style.zIndex = "9999"
    C.style.pointerEvents = "none"
    C.style.position = "absolute"
    C.style.inset = "0"

    document.body.append(C)

    animate()
}

function animate(){
    // Grab ref to animation ID, might use later
    const animationId = window.requestAnimationFrame(animate)
    CTX.clearRect(0, 0, C.width, C.height);
    for(pikmin of PIKMIN_ARMY){
        pikmin.draw()
    }
}

function run() {
    const allImages = document.querySelectorAll("img")
    const visibleImages = [...allImages].filter(image => elementIsVisibleInViewport(image))
    console.log(visibleImages)
    attachCanvas()
    attachOnion()
}

run()