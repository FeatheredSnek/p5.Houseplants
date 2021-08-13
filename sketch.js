let rotator = 0
let plant, canvasElement
let modalShown = false

const modalWrapper = document.getElementById('modal')
const modalContent = document.getElementById('modal-content')
const inputField = document.getElementById('code-input')

function loadRandomPlant () {
  noLoop()
  plant = new Plant()
  loop()
}

function loadPlantFromCode () {
  let inputValidated
  if (!inputField.value) {
    showModalMessage('Enter plant code', 2)
  }
  else {
    inputValidated = parser.parseInput(inputField.value)
    if (!inputValidated)
    {
      showModalMessage('Invalid code', 2)
    }
    else {
      noLoop()
      plant = new Plant(inputValidated)
      loop()
      showModalMessage('Plant loaded', 2)
    }
    inputField.value = ''
  }
}

function copyPlantToClipboard () {
  const code = parser.plantToCode(plant.log())
  const successMessage = 'Plant code copied to clipboard'
  const failureMessage = 'Cannot access clipboard, use the console (F12)'
  navigator.clipboard.writeText(code)
    .then(showModalMessage(successMessage, 2))
    .catch(() => {
      showModalMessage(failureMessage, 3)
      console.log('Your plant code:')
      console.log(code)
    })
}

function showModalMessage (message, time) {
  if (!modalShown) {
    modalShown = true
    modalWrapper.classList.remove('modal-disabled')
    modalContent.textContent = message
    setTimeout(() => {
      modalWrapper.classList.add('modal-disabled')
      modalShown = false
    }, time * 1000)
  }
}

function setup() {
  canvasElement = createCanvas(400, 400, WEBGL)
  canvasElement.parent('canvas-wrapper')
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
