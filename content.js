const elementIsVisibleInViewport = (el, partiallyVisible = false) => {
    const { top, left, bottom, right } = el.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    return partiallyVisible
        ? ((top > 0 && top < innerHeight) ||
            (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
        : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};

function onionClickHandler() {
    console.log("Oño!")
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

    onion.addEventListener('click', onionClickHandler)
    
    document.body.prepend(onion)
}

function attachCanvas() {
    const canvas = document.createElement('canvas')
    canvas.style.zIndex = "9999"
    canvas.style.pointerEvents = "none"
    canvas.style.position = "absolute"
    canvas.style.height = "100%"
    canvas.style.width = "100%"
    canvas.style.inset = "0"

    document.body.append(canvas)
}

function run() {
    const allImages = document.querySelectorAll("img")

    const visibleImages = [...allImages].filter(image => elementIsVisibleInViewport(image))
    console.log(visibleImages)
    attachOnion()
    attachCanvas()
}

run()