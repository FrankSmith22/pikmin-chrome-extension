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

class Target extends Sprite{
    constructor({ left, top, right, bottom, x, y, width, height, image, alive=true }){
        super({position: {x, y}, image, width, height})
        this.left = left
        this.top = top
        this.right = right
        this.bottom = bottom
        this.alive = alive
    }
}

class PikminSprite extends Sprite {
    constructor({ position, image, width, height }){
        super({ position, image, width, height })
        this.bobStart = position.y // Make sure this is set as pikmin moves around the screen
        this.bobIndex = null
        this.travelling = false
        this.isAttacking = false
        
        // Looks crazy, but this is a list of the pixels away from bobStart to animate while bobbing
        this.BOB_ANIMATION = [1,2,3,4,5,6,7,8,9,10,9,8,7,6,5,4,3,2,1]

        setTimeout(() => this.travelling = { x: 400, y: 400 }, 1000) // Default delay time of 1 sec before pikmin moves away from onion
    }

    handleBobbing() {
        // if(this.travelling) return;
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
            // Randomly decide if pikmin should animate. Make it 2% chance
            const shouldBob = Math.floor(Math.random() * 100) <= 1 //(True == 0 or 1)
            if(shouldBob){
                // Begin bobbing animation
                this.isBobbing = true
                this.bobIndex = 0
                this.position.y = this.bobStart - this.BOB_ANIMATION[this.bobIndex]
            }
        }
    }

    handleTravelling() {
        if(!this.travelling) return;
        // Do the math to find the x and y difference between
        // where the pikmin is now, and where we want to move it
        const xDifference = this.travelling.x - this.position.x
        const yDifference = this.travelling.y - this.bobStart
        if(this.position.x === this.travelling.x || this.position.y === this.travelling.y){
            console.log('Reached destination!')
            this.travelling = false
            return
        }
        console.log(xDifference)
        console.log(yDifference)
        this.position.x++
        this.position.y++
        this.bobStart++
    }
    
    draw() {
        this.handleBobbing()
        this.handleTravelling()
        super.draw()
    }
}