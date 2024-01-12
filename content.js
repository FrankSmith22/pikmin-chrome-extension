const C = document.createElement('canvas')

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
    pikmin.onload = () => { ctx.drawImage(pikmin, 10, 10) }
    pikmin.src = chrome.runtime.getURL('./images/red-pikmin.webp')
    pikmin.style.height = "20px"
    pikmin.style.width = "auto"
    console.log(`pikmin height:${pikmin.style.height}`)
    const ctx = C.getContext('2d')
    ctx.drawImage(pikmin, 100, 100)
}

function attachOnion() {
    const onion = document.createElement('img')
    onion.src = chrome.runtime.getURL('./images/onion.png')
    onion.style.zIndex = "999"
    onion.style.position = "absolute"
    onion.style.top = "0"
    onion.style.left = "0"
    onion.style.height = "150px"
    onion.style.width = "auto"

    onion.addEventListener('click', addPikminToCanvas)
    
    document.body.prepend(onion)
}

function attachCanvas() {
    C.style.zIndex = "9999"
    C.style.pointerEvents = "none"
    C.style.position = "absolute"
    C.style.height = "100%"
    C.style.width = "100%"
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