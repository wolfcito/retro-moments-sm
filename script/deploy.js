const { ethers } = require('hardhat')

module.exports = async ({ deployments }) => {
  const { deploy } = deployments
  const { deployer } = await ethers.getSigners()

  console.log('Deploying contracts with the account:', deployer.address)

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
}

module.exports.tags = ['RetroMomentRoll']
