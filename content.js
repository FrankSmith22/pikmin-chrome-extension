const C = document.createElement('canvas')
C.width=document.body.clientWidth
C.height=document.body.clientHeight
const CTX = C.getContext('2d')

const ONION_WIDTH = 180
const ONION_HEIGHT = 150

const PIKMIN_ARMY = []
let TARGETS = []

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

function attachCanvas() {
    C.style.zIndex = "9999"
    C.style.pointerEvents = "none"
    C.style.position = "absolute"
    C.style.inset = "0"

    document.body.append(C)
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

function animate(){
    // Grab ref to animation ID, might use later
    const animationId = window.requestAnimationFrame(animate)
    CTX.clearRect(0, 0, C.width, C.height);
    for(let pikmin of PIKMIN_ARMY){
        pikmin.draw()
    }
    for(let target of TARGETS){
        target.draw()
    }
}

function run() {
    const allImages = document.querySelectorAll("img")
    const visibleImages = [...allImages].filter(image => elementIsVisibleInViewport(image))
    TARGETS = visibleImages.map(image => {
        const imageRect = image.getBoundingClientRect().toJSON()
        // Debugging lines to ensure image is getting redrawn
        // imageRect.x += 100
        // imageRect.y += 100
        image.style.display = "none"
        return new Target({...imageRect, image })
    })
    attachCanvas()
    attachOnion()
    animate()
}

run()