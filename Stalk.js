class Stalk extends Mesh {
  constructor (positionVector, rotationVector, meshParams, color) {
    super()

    this.position = positionVector
    this.rotation = rotationVector

    let params = meshParams || Stalk.getDefaultParams()

    this.length = params.length
    this.resolution = params.resolution
    this.curvature = params.curvature
    this.thickness = params.thickness

    this.color = color || 'green'

    this.vertices = this.generateVertices()
    this.rotateMesh(this.rotation)
    this.translateMesh(this.position)
  }

  generateVertices () {
    let lengthStep = this.length / this.resolution
    let coords = createVector(0,0)
    let vertices = []
    for (let i = 0; i < this.resolution; i++) {
      let vert = createVector(coords.x, coords.y, 0)
      vertices.push(vert)
      coords.y += lengthStep
      coords.rotate(PI * (1.2 / this.resolution) * this.curvature * -1)
    }
    return vertices

  }

  draw () {
    noFill()
    stroke(this.color)
    strokeWeight(this.thickness)
    beginShape()
    for (let vert of this.vertices) {
      vertex(vert.x, vert.y, vert.z)
    }
    endShape()
  }

  getTip () {
    return this.vertices[this.vertices.length - 1]
  }

  static getDefaultParams () {
    return {
      length: 80,
      resolution: 3,
      curvature: 0.33,
      thickness: 3
    }
  }

  static getRandomParams () {
    return {
      length: 50 + random(50),
      resolution: 3,
      curvature: random(0.1, 0.4),
      thickness: random([2,3,4,5])
    }
  }

  static wiggleParams (baseParams) {
    return {
      length: baseParams.length * random(0.66, 2),
      resolution: baseParams.resolution,
      curvature: baseParams.curvature * random(0.2, 1.2),
      thickness: baseParams.thickness
    }
  }

  log (print) {
    let p = {
      position: {
        x: this.position.x,
        y: this.position.y,
        z: this.position.z
      },
      rotation: {
        x: this.rotation.x,
        y: this.rotation.y,
        z: this.rotation.z
      },
      meshParams: {
        length: this.length,
        resolution: this.resolution,
        curvature: this.curvature,
        thickness: this.thickness
      }
    }
    if (print) console.log(p);
    return p
  }

}
