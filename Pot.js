class Pot extends Mesh {
  constructor (positionVector, rotationVector, meshParams, texture) {
    super()

    this.position = positionVector
    this.rotation = rotationVector

    let params = meshParams || Pot.getDefaultParams()

    this.height = params.height
    this.slant = params.slant
    this.bottomRadius = params.bottomRadius
    this.extrusionLevel = params.extrusionLevel
    this.extrusionWidth = params.extrusionWidth
    this.extrusionHeight = params.height * params.extrusionLevel
    this.resolution = params.resolution

    let topRadius = params.bottomRadius * (1 + params.slant)
    let extrusionBottomRadius = params.bottomRadius * (1 + params.slant * params.extrusionLevel) + params.extrusionWidth
    let extrusionTopRadius = params.bottomRadius * (1 + params.slant) + params.extrusionWidth
    let groundRadius = params.bottomRadius * (1 + params.slant * 0.9)
    let groundHeight = 0.9 * params.height

    this.bottomVertices = this.vertexRing(this.bottomRadius, 0)
    this.topVertices = this.vertexRing(topRadius, this.height)
    this.extrusionBottomVertices = this.vertexRing(extrusionBottomRadius, this.extrusionHeight)
    this.extrusionTopVertices = this.vertexRing(extrusionTopRadius, this.height)
    this.groundVertices = this.vertexRing(groundRadius, groundHeight)

    this.texture = texture || null

    this.vertices = [
      this.bottomVertices,
      this.topVertices,
      this.extrusionBottomVertices,
      this.extrusionTopVertices,
      this.groundVertices
    ]

    this.rotateMesh(this.rotation)
    this.translateMesh(this.position)
  }

  vertexRing (radius, h) {
    let vertices = []
    for (let i = 0; i < this.resolution; i++) {
      let x = sin(TAU * (i/this.resolution)) * radius
      let z = cos(TAU * (i/this.resolution)) * radius
      let y = h
      vertices.push(createVector(x, y, z))
    }
    return vertices
  }

  // Overloads parent Mesh.rotateMesh method because of Pot's vertices structure
  // (array of ring-arrays).
  rotateMesh (rotationVector) {
    this.vertices.forEach(arr => arr = Mesh.rotateVertices(arr, rotationVector))
  }

  // Overloads parent Mesh.translateMesh method because of Pot's vertices structure
  // (array of ring-arrays).
  translateMesh (translationVector) {
    this.vertices.forEach(arr => arr = Mesh.translateVertices(arr, translationVector))
  }

  draw () {
    this.drawCylinder(this.bottomVertices, this.topVertices, 0, 0.5)
    this.drawCylinder(this.extrusionBottomVertices, this.extrusionTopVertices, 0.6, 0.8)
    this.drawCylinder(this.extrusionTopVertices, this.topVertices, 0.8, 0.85)
    this.drawRing(this.groundVertices, 51, true)
  }

  drawRing (vertexArray, color, filled) {
    if (filled) {
      fill(color)
      noStroke()
    }
    else {
      noFill()
      stroke(color)
      strokeWeight(3)
    }
    beginShape()
    for (let vert of vertexArray) {
      vertex(vert.x, vert.y, vert.z)
    }
    vertex(vertexArray[0].x, vertexArray[0].y, vertexArray[0].z)
    endShape()
  }

  bridgeRings (vertexArrayA, vertexArrayB, color) {
    if (vertexArrayA.length != vertexArrayB.length) {
      console.warn('Arrays not of equal length')
    }
    else {
      for (let i = 0; i < vertexArrayA.length; i++) {
        let top1 = vertexArrayA[i]
        let top2 = i < vertexArrayA.length-1 ? vertexArrayA[i+1] : vertexArrayA[0]
        let bot1 = vertexArrayB[i]
        let bot2 = i < vertexArrayB.length-1 ? vertexArrayB[i+1] : vertexArrayB[0]
        fill(color)
        noStroke()
        beginShape( )
        vertex(top1.x, top1.y, top1.z)
        vertex(top2.x, top2.y, top2.z)
        vertex(bot2.x, bot2.y, bot2.z)
        vertex(bot1.x, bot1.y, bot1.z)
        endShape()
      }
    }
  }

  drawCylinder (vertexArrayA, vertexArrayB, uA, uB) {
    if (vertexArrayA.length != vertexArrayB.length) {
      console.warn('Arrays not of equal length')
    }
    else {
      let vChunk = 1 / vertexArrayA.length
      for (let i = 0; i < vertexArrayA.length; i++) {
        let top1 = vertexArrayA[i]
        let top2 = i < vertexArrayA.length-1 ? vertexArrayA[i+1] : vertexArrayA[0]
        let bot1 = vertexArrayB[i]
        let bot2 = i < vertexArrayB.length-1 ? vertexArrayB[i+1] : vertexArrayB[0]
        if (this.texture instanceof PotTexture) {
          let v1 = i * vChunk
          let v2 = i < vertexArrayA.length-1 ? i * vChunk + vChunk : 0
          let uAinv = 1 - uA
          let uBinv = 1 - uB
          texture(this.texture.image)
          textureMode(NORMAL)
          noStroke()
          beginShape()
          vertex(top1.x, top1.y, top1.z, v1, uAinv)
          vertex(top2.x, top2.y, top2.z, v2, uAinv)
          vertex(bot2.x, bot2.y, bot2.z, v2, uBinv)
          vertex(bot1.x, bot1.y, bot1.z, v1, uBinv)
          endShape()
        }
        else {
          fill('brown')
          noStroke()
          beginShape()
          vertex(top1.x, top1.y, top1.z)
          vertex(top2.x, top2.y, top2.z)
          vertex(bot2.x, bot2.y, bot2.z)
          vertex(bot1.x, bot1.y, bot1.z)
          endShape()
        }
      }
    }
  }

  static getDefaultParams () {
    return {
      height: 80,
      bottomRadius: 40,
      slant: 0.4,
      extrusionWidth: 10,
      extrusionLevel: 0.7,
      resolution: 8
    }
  }

  static getRandomParams () {
    let bottomRadius= 20 + random(40)
    return {
      height: 50 + random(60),
      bottomRadius,
      slant: random(0.1, 0.8),
      extrusionWidth: random(5, bottomRadius * 0.4),
      extrusionLevel: random(0.5, 0.9),
      resolution: random([4,5,6,7,8])
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
        height: this.height,
        bottomRadius: this.bottomRadius,
        slant: this.slant,
        extrusionWidth: this.extrusionWidth,
        extrusionLevel: this.extrusionLevel,
        resolution: this.resolution
      }
    }
    if (print) console.log(p);
    return p
  }


}
