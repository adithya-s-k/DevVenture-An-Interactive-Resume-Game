const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d')


canvas.width=1024
canvas.height=576
console.log(canvas)

c.fillStyle = "white"
c.fillRect(0,0,canvas.width,canvas.height)

const image = new Image();
image.src = "./assets/images/map.png"


// image on load is required to load the image then render it on the canvae
image.onload=()=>{
    c.drawImage(image,-750,-550)
}