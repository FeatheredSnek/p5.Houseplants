class Leaf extends Mesh {
  constructor (positionVector, rotationVector, meshParams, texture) {
    super()

    this.position = positionVector
    this.rotation = rotationVector

    let params = meshParams || Leaf.getDefaultParams()

    this.length = params.length
    this.width = params.width
    this.resolution = params.resolution
    this.skew = params.skew
    this.fatness = params.fatness
    this.curvature = params.curvature
    this.outline = params.outline || null

    this.texture = texture || null

    this.vertices = this.generateVertices()
    this.rotateMesh(this.rotation)
    this.translateMesh(this.position)

  }

  updateShape (length, width, skew, curvature) {
    this.length = length
    this.width = width
    this.skew = skew
    this.curvature = curvature
    this.vertices = this.generateVertices()
  }

  generateVertices () {
    let vertices = []
    let lengthStep = this.length / this.resolution
    let widthStep = this.width / this.resolution
    // generate 2 sides of a leaf
    for (let i = 0; i < this.resolution; i++) {
      let normalizedStep = (i / (this.resolution - 1))
      let y = sin((i / (this.resolution - 1)) * PI) * 50 * this.curvature
      let x = (i / (this.resolution - 1)) * this.resolution * lengthStep
      let zshape = sin(i / (this.resolution - 1) * PI)
      let zskew = 1 - ( this.skew * (i / this.resolution) )
      let z = pow(zshape, this.fatness) * zskew * this.resolution * widthStep
      let vert = createVector(x, y, z)
      vertices.push(vert)
    }
    for (let i = this.resolution - 1; i > -1; i--) {
      let normalizedStep = (i / (this.resolution - 1))
      let x = (i / (this.resolution - 1)) * this.resolution * lengthStep
      let y = sin((i / (this.resolution - 1)) * PI) * 50 * this.curvature
      let zshape = sin(i / (this.resolution - 1) * PI)
      let zskew = 1 - ( this.skew * (i / this.resolution) )
      let z = pow(zshape, this.fatness) * zskew * this.resolution * widthStep * -1
      let vert = createVector(x, y, z)
      vertices.push(vert)
    }
    // widen the base tip a little to make it look more connected to the stalk
    vertices[0].z += 2
    vertices[vertices.length-1].z -= 2
    return vertices
  }

  draw () {
    if (this.outline) {
      this.drawOutline()
    }
    this.drawSurfaces()
  }

  drawOutline () {
    stroke(this.outline)
    strokeWeight(3)
    noFill()
    beginShape()
    for (let i = 0; i < this.vertices.length - 1; i++) {
      vertex(this.vertices[i].x, this.vertices[i].y, this.vertices[i].z)
    }
    vertex(this.vertices[0].x, this.vertices[0].y, this.vertices[0].z)
    endShape()
  }

  drawSurfaces () {
    let uChunk = 1 / (this.resolution - 1)
    // generate i faces
    for (let i = 0; i < this.resolution - 1; i++) {
      // generate faces by placing vertices in a specific index order
      // i.e. bottom left, top left, top right, bottom right
      // and creating a flat sufrace (fill) between them
      let indexes = [
        i,
        i + 1,
        this.vertices.length - 1 - i - 1,
        this.vertices.length - 1 - i
      ]
      // generate vertices with uv and textured faces
      // iff theres a valid leaf texture
      if (this.texture instanceof LeafTexture) {
        noStroke()
        texture(this.texture.image)
        textureMode(NORMAL)
        beginShape()
        for (let id of indexes) {
          let uValue, vValue
          // generate uv values for faces
          if (indexes.indexOf(id) == 0 || indexes.indexOf(id) == 3) {
            uValue = i * uChunk
          }
          else {
            uValue = i * uChunk + uChunk
          }
          vValue = indexes.indexOf(id) < 2 ? 0 : 1
          // fix v values for pointy ends to prevent stretching
          if (i == this.resolution - 2 && (indexes.indexOf(id) == 1 || indexes.indexOf(id) == 2)) {
            vValue = 0.5
          }
          if (i == 0 && (indexes.indexOf(id) == 0 || indexes.indexOf(id) == 3)) {
            vValue = 0.5
          }
          vertex(
            this.vertices[id].x,
            this.vertices[id].y,
            this.vertices[id].z,
            vValue,
            uValue
          )
        }
        endShape()
      }
      // if theres no texture - do not generate uv,
      // simply fill faces with this.color
      else {
        noStroke()
        fill('green')
        beginShape()
        for (let id of indexes) {
          vertex(
            this.vertices[id].x,
            this.vertices[id].y,
            this.vertices[id].z
          )
        }
        endShape()
      }
    }
  }

  static getDefaultParams () {
    return {
      length: 100,
      width: 60,
      resolution: 4, // 4 - 8 (low polygon count - high polygon count)
      skew: 0.6, // 0.2 - 1.5 (round end - pointy end)
      fatness: 1, // 0.1 - 2.0 (round start - pointy start)
      curvature: 0.8, // 0 - 1.5 (flat - curved)
      outline: 'green' // optional color value
    }
  }

  static getRandomParams () {
    let length = 60 + random(80)
    let width = length * random(0.2, 0.8)
    let resolution = length > 120 ? random([4,5,6,7]) : random([4,5,6])
    return {
      length,
      width,
      resolution,
      skew: random(0.3, 1.4),
      fatness: random(0.2, 1.9),
      curvature: random(0.3, 1.5),
      outline: null
    }
  }

  static wiggleParams (baseParams) {
    return {
      length: baseParams.length * random(0.7, 1.3),
      width: baseParams.width * random(0.8, 1.2),
      resolution: baseParams.resolution,
      skew: baseParams.skew * random(0.8, 1.2),
      fatness: baseParams.fatness * random(0.8, 1.2),
      curvature: (baseParams.length > 100 ?
                  baseParams.curvature * random(0.5, 1.5) :
                  baseParams.curvature * random(0.1, 1.8)),
      outline: baseParams.outline
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
        x: this.position.x,
        y: this.position.y,
        z: this.position.z
      },
      length: this.length,
      width: this.width,
      resolution: this.resolution,
      skew: this.skew,
      fatness: this.fatness,
      curvature: this.curvature,
      outline: this.outline
    }
    if (print) console.log(p);
    return p
  }

}
