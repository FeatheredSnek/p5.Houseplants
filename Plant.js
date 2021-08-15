/* This class aggregates all the parts into a Plant object.
It works primarily by calling appropriate method of its children.
Passing the data object to the constructor results in a custom plant,
passing no arguments generates a random plant. Note that there's no internal
validation of the customData argument in this class.
A detailed data object of a given plant instance can be logged in the console
by calling instance.log(true). Note that calling the log() gives a precise float
values whereas the plant encoding functionality truncates everything
beyond 2 decimal places. */

class Plant {
  // The order of color and geometry generation is crucial, as the parts
  // generated later depend on the previously generated data
  constructor (customData) {

    this.baseGreen = customData ?
    helpers.colorFromRGB(customData.baseGreen) :
    helpers.getRandomGreen()

    this.baseBrown = customData ?
    helpers.colorFromRGB(customData.baseBrown) :
    helpers.getRandomBrown()

    this.potTexture = customData ?
      new PotTexture(customData.potTextureData, this.baseBrown) :
      new PotTexture(PotTexture.getRandomParams(), this.baseBrown)

    this.leafTexture = customData ?
      new LeafTexture(customData.leafTextureData.params, customData.leafTextureData.colors) :
      new LeafTexture(LeafTexture.getRandomParams(), LeafTexture.generateColors(this.baseGreen))

    this.pot = customData ?
      this.createPot(customData.potData) :
      this.createPot()

    this.stalkCount = customData ?
      customData.stalkCount :
      this.pot.bottomRadius < 30 ? random([2,3]) : random([3,4,5])

    this.stalkSpread = customData ?
      customData.stalkSpread :
      this.pot.groundRadius * random(0.1, 0.25)

    this.stalks = customData ?
      this.createStalks(customData.stalkData) :
      this.createStalks()

    this.leaves = customData ?
      this.createLeaves(customData.leafData) :
      this.createLeaves()

  }

  createPot (potData) {
    if (potData) {
      return new Pot(potData.position, potData.rotation, potData.meshParams, this.potTexture)
    }
    else {
      return new Pot(createVector(0,0,0), createVector(0,0,0), Pot.getRandomParams(), this.potTexture)
    }
  }

  createStalks (instanceParamsArr) {
    let stalks = []
    let baseParams = instanceParamsArr ? null : Stalk.getRandomParams()
    let count = this.stalkCount
    let radius = this.stalkSpread
    let radialStep = TAU / count
    for (let i = 0; i < count; i++) {
      let position, rotation, meshParams
      // If parameters are passed, stalks are generated accordingly.
      if (instanceParamsArr) {
        position = helpers.vectorFromValues(instanceParamsArr[i].position)
        rotation = helpers.vectorFromValues(instanceParamsArr[i].rotation)
        meshParams = instanceParamsArr[i].meshParams
      }
      // If no parameters are passed stalks with randomized params are
      // generated in a circle centered around the middle of pot's ground plane.
      else {
        let x = cos(radialStep * i) * radius * random(0.8, 1.2)
        let z = sin(radialStep * i) * radius * random(0.8, 1.2)
        let y = this.pot.groundHeight
        let rotationWiggle = count > 4 ? random(0.9, 1.1) : random(0.8, 1.2)
        let yRotation = TAU - radialStep * i * rotationWiggle
        position = createVector(x, y, z)
        rotation = createVector(0, yRotation, 0)
        meshParams = Stalk.wiggleParams(baseParams)
      }
      stalks.push(new Stalk(position, rotation, meshParams, this.baseGreen))
    }
    return stalks
  }

  createLeaves (instanceParamsArr) {
    let leaves = []
    let baseParams = instanceParamsArr ? null : Leaf.getRandomParams()
    if (instanceParamsArr) {
      // If parameters are passed, leaves are generated accordingly.
      for (let instanceParams of instanceParamsArr) {
        let position, rotation, meshParams
        position = helpers.vectorFromValues(instanceParams.position)
        rotation = helpers.vectorFromValues(instanceParams.rotation)
        meshParams = instanceParams.meshParams
        leaves.push(new Leaf(position, rotation, meshParams, this.leafTexture))
      }
    }
    // If no parameters are passed, leaves are generated with similar
    // but sligltly rerolled set of random parameters. One leaf is then
    /// placed at the tip of each stalk.
    else {
      for (let stalk of this.stalks) {
        let position, rotation, meshParams
        let xMod = random(-0.1, 0.1)
        let zMod = random(-0.1, 0.1)
        let yMod = this.stalks.length > 3 ? random(-0.2, 0.2) : random(-0.4, 0.4)
        meshParams = Leaf.wiggleParams(baseParams)
        position = stalk.getTip()
        rotation = createVector(
          stalk.rotation.x + xMod,
          stalk.rotation.y + yMod,
          stalk.rotation.z + zMod
        )
        leaves.push(new Leaf(position, rotation, meshParams, this.leafTexture))
      }
    }
    return leaves
  }

  log (print) {
    let customData = {
      stalkCount: this.stalkCount,
      stalkSpread: this.stalkSpread,
      baseBrown: helpers.colorToRGB(this.baseBrown),
      baseGreen: helpers.colorToRGB(this.baseGreen),
      leafTextureData: this.leafTexture.log(),
      potTextureData: this.potTexture.log(),
      potData: this.pot.log(),
      stalkData: Array.from(this.stalks, s => s.log()),
      leafData: Array.from(this.leaves, l => l.log()),
    }
    if (print) console.log(customData)
    return customData
  }

  draw () {
    this.pot.draw()
    this.stalks.forEach(stalk => stalk.draw())
    this.leaves.forEach(leaf => leaf.draw())
  }
}
