const { ethers, deployments } = require('hardhat')

module.exports = async () => {
  const { deploy } = deployments
  const signers = await ethers.getSigners()

  const deployer = signers[0]

  console.log('Deploying contracts with the account:', deployer.address)

  try {
    const deploymentResult = await deploy('RetroMomentRoll', {
      from: deployer.address,
      args: [deployer.address],
      log: true,
    })

    if (deploymentResult.newlyDeployed) {
      console.log(
        `Contract RetroMomentRoll deployed at ${deploymentResult.address} using ${deploymentResult.receipt.gasUsed} gas`
      )
    }
  } catch (error) {
    console.error('Error deploying contract:', error)
  }
}

module.exports.tags = ['RetroMomentRoll']
