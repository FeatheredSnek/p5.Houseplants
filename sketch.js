// rotator for rotating
let rotator = 0
let plant

function setup() {
  createCanvas(400, 400, WEBGL)
  frameRate(30)
  plant = new Plant()
}

function draw() {
  background(220)
  translate(0, 150, -150)
  rotateX(PI - 0.4)
  rotateY(rotator)
  rotator += 0.01

  plant.draw()
}
