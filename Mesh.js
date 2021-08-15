/* Parent class for all meshes (collections of vector-stored vertices).
Stores information about the general position and rotation as well as
the vertices data. Performs rotation and translation. */

class Mesh {
  constructor(positionVector, rotationVector) {
    this.position = positionVector
    this.rotation = rotationVector
    this.vertices = []
  }

  rotateMesh (rotationVector) {
    this.vertices.forEach(v => {
      let rotated = Mesh.rotateVertex(v, rotationVector.x, rotationVector.y, rotationVector.z)
      v.x = rotated.x
      v.y = rotated.y
      v.z = rotated.z
    })
  }

  translateMesh (translationVector) {
    this.vertices.forEach(v => {
      v.x = v.x + translationVector.x
      v.y = v.y + translationVector.y
      v.z = v.z + translationVector.z
    })
  }

  static rotateVertex (v, xAngle, yAngle, zAngle) {
    // matrix for euler order zxy
    let rm = {
      x1: cos(zAngle) * cos(yAngle),
      x2: cos(zAngle) * sin(yAngle) * sin(xAngle) - sin(zAngle) * cos(xAngle),
      x3: cos(zAngle) * sin(yAngle) * cos(xAngle) + sin(zAngle) * sin(xAngle),
      y1: sin(zAngle) * cos(yAngle),
      y2: sin(zAngle) * sin(yAngle) * sin(xAngle) + cos(zAngle) * cos(xAngle),
      y3: sin(zAngle) * sin(yAngle) * cos(xAngle) - cos(zAngle) * sin(xAngle),
      z1: sin(yAngle) * -1,
      z2: cos(yAngle) * sin(xAngle),
      z3: cos(yAngle) * cos(xAngle)
    }
    let vm = {
      x: v.x,
      y: v.y,
      z: v.z
    }
    let result = {
      x: 0,
      y: 0,
      z: 0
    }
    result.x = rm.x1 * vm.x + rm.x2 * vm.y + rm.x3 * vm.z
    result.y = rm.y1 * vm.x + rm.y2 * vm.y + rm.y3 * vm.z
    result.z = rm.z1 * vm.x + rm.z2 * vm.y + rm.z3 * vm.z
    return createVector(result.x, result.y, result.z)
  }

  static rotateVertices (vertices, rotationVector) {
    vertices.forEach(v => {
      let rotated = Mesh.rotateVertex(v, rotationVector.x, rotationVector.y, rotationVector.y)
      v.x = rotated.x
      v.y = rotated.y
      v.z = rotated.z
    })
  }

  static translateVertices (vertices, translationVector) {
    vertices.forEach(v => {
      v.x = v.x + translationVector.x
      v.y = v.y + translationVector.y
      v.z = v.z + translationVector.z
    })
  }

}
