/* Pot object. A pot geometry consists of 5 rings of vertices, each made
out of n = resolution 3d vectors; surfaces between 4 of them make up
the cylindrical outer shell, the last one is filled with color and serves
as the ground for stalks. Surfaces are drawn in instance.draw().
Pot's constructor requires a position and rotation arguments. Paramters are
optional - if none are passed a random pot is generated (see getParams
methods at the end of this file). Pot instance can store its own texture.
If no texture is provided, the color defaults to brown. */

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
    this.groundHeight = 0.9 * params.height

    let topRadius = params.bottomRadius * (1 + params.slant)
    let extrusionBottomRadius = params.bottomRadius * (1 + params.slant * params.extrusionLevel) + params.extrusionWidth
    let extrusionTopRadius = params.bottomRadius * (1 + params.slant) + params.extrusionWidth
    let groundRadius = params.bottomRadius * (1 + params.slant * 0.9)

    this.bottomVertices = this.vertexRing(this.bottomRadius, 0)
    this.topVertices = this.vertexRing(topRadius, this.height)
    this.extrusionBottomVertices = this.vertexRing(extrusionBottomRadius, this.extrusionHeight)
    this.extrusionTopVertices = this.vertexRing(extrusionTopRadius, this.height)
    this.groundVertices = this.vertexRing(groundRadius, this.groundHeight)

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

  // These particular u and v values passed to drawCylinder ensure that the
  // texture's highlight is drawn at the right place and not stretched out too much.
  draw () {
    this.drawCylinder(this.bottomVertices, this.topVertices, 0, 0.5)
    this.drawCylinder(this.extrusionBottomVertices, this.extrusionTopVertices, 0.6, 0.8)
    this.drawCylinder(this.extrusionTopVertices, this.topVertices, 0.8, 0.85)
    this.drawRing(this.groundVertices, 51, true)
  }

  // Draw ring is actually used only with filled=true for the ground, but it
  // may also be used to generate some outlines.
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

  // Drawing method receives two vector 'rings' and their normalized heights
  // with respect to the ground level which serve as the texture's u values.
  // It generates n = resolution rectangular faces between the rings.
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
        // If a valid texture is passed faces are generated between xyzuv vertices
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
        // If there's no valid texture argument u and v are ommited
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
      height: 80, // 50-110 (height of the pot outer shell)
      bottomRadius: 40, // 20-60 (radius at the bottom)
      slant: 0.4, // 0.1-0.8 (cylindrical-slanted shape)
      extrusionWidth: 10, // 5-20 (narrow-wide extruded part at the top)
      extrusionLevel: 0.7, // 0.5-0.9 (small-big extrusion)
      resolution: 8 // 4-8 (# of vertices for each vertex ring)
    }
  }

  static getRandomParams () {
    let bottomRadius = 20 + random(40)
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
