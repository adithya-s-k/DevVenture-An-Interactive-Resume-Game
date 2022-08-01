const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d')

canvas.width=1024
canvas.height=576

// creating an offset so that the map is centers
const offset ={
    x:-735,
    y:-600
}

// collision mechanism

const collisionMap = []//sd array representing the grid
for(let i =0; i < collisions.length;i+=70){
    collisionMap.push(collisions.slice(i,i+70))
}
// creating a class for the boundary taking in position and also for drawing
class Boundary{
    static width = 48
    static height = 48
    constructor({position}) {
        this.position=position
        this.width = 48
        this.height = 48
    }
    draw(){
        c.fillStyle ="red"
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
    }
}

// creating a arr with all the boundary positions with height and width
const boundaries = []

collisionMap.forEach((row,i)=>{
    row.forEach((column,j)=>{
        if(column === 1025){
        boundaries.push(
            new Boundary({
                position:{
                    x : j*Boundary.width + offset.x,
                    y : i*Boundary.height + offset.y
                }
            })
        )}
    })
})


const image = new Image();
image.src = "./assets/images/map.png";

const playerImage = new Image();
playerImage.src = "./assets/images/playerDown.png";

class Sprite{
    constructor({position,velocity,image,frames = {max:1}}){
        this.position = position;
        this.image = image
        this.frames = frames
        this.width = this.image.width/this.frames.max
        this.height = this.image.height
        console.log(this.width)
        console.log(this.height)
        
    }
    draw(){
        c.drawImage(this.image,
            0,
            0,
            this.image.width/this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width/this.frames.max,
            this.image.height)
    }
}

const background = new Sprite({position:offset,image:image})

// canvas.width/2 - this.image.width/8, we are going to replace it with static value
// which is nothing but width and height of the player image in this cae
//it is 192 and 68
// canvas.height/2 - this.image.height/2, 

const player = new Sprite({
    position:{
        x:canvas.width/2 - 192/8,
        y:canvas.height/2 - 68/2
    },
    image :playerImage,
    frames:{
        max:4
    }
})


// image on load is required to load the image then render it on the canvae
/*image.onload=()=>{
    c.drawImage(image,-735,-600)
    c.drawImage(playerImage,
        0,
        0,
        playerImage.width/4,
        playerImage.height,
        canvas.width/2 - playerImage.width/8,
        canvas.height/2 - playerImage.height/2,
        playerImage.width/4,
        playerImage.height)
}*/

let lastKey = '';
const keys={
    w:{
        pressed:false
    },
    a:{
        pressed:false
    },
    s:{
        pressed:false
    },
    d:{
        pressed:false
    },
}

const movables  = [background,...boundaries]

// softedge is created to make the boundary smaller thus given more movement space to the player
const softedge = {
    x:20,
    y:20
}

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x + softedge.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width - softedge.x &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height - softedge.y &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y + softedge.y
    )
}

function animate(){
    window.requestAnimationFrame(animate);
    background.draw()
    boundaries.forEach(boundary =>{
        boundary.draw()
        if(rectangularCollision({
            rectangle1:player,
            rectangle2:boundary
        })){
            console.log('collision')
        }
    })
    player.draw()

    let moving = true

    if (keys.w.pressed && lastKey === 'w') {    
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: {
                ...boundary,
                position: {
                    x: boundary.position.x,
                    y: boundary.position.y + 3
                }
                }
            })
            ) {
            moving = false
            break
            }
        }
    
        if (moving)
            movables.forEach((movable) => {
            movable.position.y += 3
            })
        }    

    else if (keys.a.pressed && lastKey === 'a') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: {
                ...boundary,
                position: {
                    x: boundary.position.x + 3,
                    y: boundary.position.y
                }
                }
            })
            ) {
            moving = false
            break
            }
        }
    
        if (moving)
            movables.forEach((movable) => {
            movable.position.x += 3
            })
        } 
        else if (keys.s.pressed && lastKey === 's') {

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: {
                ...boundary,
                position: {
                    x: boundary.position.x,
                    y: boundary.position.y - 3
                }
                }
            })
            ) {
            moving = false
            break
            }
        }
    
        if (moving)
            movables.forEach((movable) => {
            movable.position.y -= 3
            })
        } 
    else if (keys.d.pressed && lastKey === 'd') {
    
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: {
                ...boundary,
                position: {
                    x: boundary.position.x - 3,
                    y: boundary.position.y
                }
                }
            })
            ) {
            moving = false
            break
            }
        }
    
        if (moving)
            movables.forEach((movable) => {
            movable.position.x -= 3
            })
        }

}
animate()

window.addEventListener('keydown',(e)=>{
    switch(e.key){
        case("w"):
            keys.w.pressed = true;
            lastKey = "w";
            break
        case("a"):
            keys.a.pressed = true;
            lastKey  = "a";
            break
        case("s"):
            keys.s.pressed = true;
            lastKey = "s";
            break
        case("d"):
            keys.d.pressed = true;
            lastKey = "d";
            break
    }
})

window.addEventListener('keyup',(e)=>{
    switch(e.key){
        case("w"):
            keys.w.pressed = false;
            break
        case("a"):
            keys.a.pressed = false;
            break
        case("s"):
            keys.s.pressed = false;
            break
        case("d"):
            keys.d.pressed = false;
            break
    }
})