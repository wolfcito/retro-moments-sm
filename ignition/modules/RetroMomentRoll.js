const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules')

module.exports = buildModule('RetroMomentRollModule', (m) => {
  const initialOwner = m.getParameter('initialOwner')

  const retroMomentRoll = m.contract('RetroMomentRoll', [initialOwner])

  return { retroMomentRoll }
})
