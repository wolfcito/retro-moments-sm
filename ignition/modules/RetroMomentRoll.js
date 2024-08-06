const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules')

module.exports = buildModule('RetroMomentRollModule', (m) => {
  const initialOwner = m.getParameter('initialOwner', process.env.INITIAL_OWNER)

  const retroMomentRoll = m.contract('RetroMomentRoll', [initialOwner])

  return { retroMomentRoll }
})
