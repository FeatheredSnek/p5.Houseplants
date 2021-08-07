class Plant {
  constructor (potParams, stalksParams, leavesParams, leafTextureParams, potTextureParams, baseGreen, baseBrown) {
    this.baseGreen = helpers.getRandomGreen()
    this.baseBrown = helpers.getRandomBrown()
    this.potTexture = new PotTexture(PotTexture.getRandomParams(), this.baseBrown)
    this.leafTexture = new LeafTexture(LeafTexture.getRandomParams(), this.baseGreen)

    potParams, stalksParams, leavesParams = null

    this.pot = this.createPot(potParams)
    let stalkCount = this.pot.bottomRadius < 30 ? random([2,3]) : random([3,4,5])

    this.stalks = this.createStalks(stalkCount, stalksParams)
    this.leaves = this.createLeaves(leavesParams)

    this.log()
  }

  createPot (potParams) {
    return new Pot(createVector(0,0,0), createVector(0,0,0), Pot.getRandomParams(), this.potTexture)
  }

  createStalks (count, stalksParams) {
    let baseParams = Stalk.getRandomParams()
    let stalks = []
    let radius = this.pot.groundRadius * random(0.1, 0.25)
    let radialStep = TAU / count
    for (let i = 0; i < count; i++) {
      let x = cos(radialStep * i) * radius * random(0.8, 1.2)
      let z = sin(radialStep * i) * radius * random(0.8, 1.2)
      let y = this.pot.groundHeight
      let rotationWiggle = count > 4 ? random(0.9, 1.1) : random(0.8, 1.2)
      let yRotation = TAU - radialStep * i * rotationWiggle
      let position = createVector(x, y, z)
      let rotation = createVector(0, yRotation, 0)
      let instanceParams = Stalk.wiggleParams(baseParams)
      stalks.push(new Stalk(position, rotation, instanceParams, this.baseGreen))
    }
    return stalks
  }

  createLeaves (leavesParams) {
    let leaves = []
    let baseParams = Leaf.getRandomParams()
    for (let stalk of this.stalks) {
      let instanceParams = Leaf.wiggleParams(baseParams)
      let leafAnchor = stalk.getTip()
      let xMod = random(-0.1, 0.1)
      let zMod = random(-0.1, 0.1)
      let yMod = this.stalks.length > 3 ? random(-0.2, 0.2) : random(-0.4, 0.4)
      let leafRotation = createVector(
        stalk.rotation.x + xMod,
        stalk.rotation.y + yMod,
        stalk.rotation.z + zMod
      )
      leaves.push(new Leaf(leafAnchor, leafRotation, instanceParams, this.leafTexture))
    }
    return leaves
  }

  log () {
    let pot = this.pot.log()
    let stalks = []
    let leaves = []
    this.stalks.forEach(s => stalks.push(s.log()))
    this.leaves.forEach(l => leaves.push(l.log()))
    console.log(pot);
    console.log(stalks);
    console.log(leaves);
  }

  draw () {
    this.pot.draw()
    this.stalks.forEach(stalk => stalk.draw())
    this.leaves.forEach(leaf => leaf.draw())
  }
}
