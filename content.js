const C = document.createElement('canvas')
C.width=document.body.clientWidth
C.height=document.body.clientHeight
const CTX = C.getContext('2d')

const ONION_WIDTH = 180
const ONION_HEIGHT = 150

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
    const pikmin = new Image()
    pikmin.onload = () => {
        randomX = Math.floor(Math.random() * ONION_WIDTH)
        randomY = Math.floor(Math.random() * ONION_HEIGHT)
        CTX.drawImage(pikmin, randomX, randomY, 20, 25)
    }
    pikmin.src = chrome.runtime.getURL('./images/red-pikmin.png')
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
}

function run() {
    const allImages = document.querySelectorAll("img")

    const visibleImages = [...allImages].filter(image => elementIsVisibleInViewport(image))
    console.log(visibleImages)
    attachCanvas()
    attachOnion()
}

run()