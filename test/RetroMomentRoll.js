const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

function decodeTokenId(tokenId) {
  const nonceMask = BigInt(0xffffffff);
  const addressShift = BigInt(96);
  const expShift = BigInt(32);

  const addressBigInt = tokenId >> addressShift;

  const expBigInt = (tokenId >> expShift) & nonceMask;
  const nonceBigInt = tokenId & nonceMask;

  const address = "0x" + addressBigInt.toString(16).padStart(40, "0");

  const exp = Number(expBigInt);
  const nonce = Number(nonceBigInt);

  return { address, exp, nonce };
}

function encodeTokenId(address, exp, nonce) {
  const addressBigInt = BigInt(address);
  const expBigInt = BigInt(exp);
  const nonceBigInt = BigInt(nonce);

  const tokenId =
    (addressBigInt << BigInt(96)) | (expBigInt << BigInt(32)) | nonceBigInt;

  return tokenId;
}

describe("RetroMomentRoll", function () {
  async function deployRetroMomentRollFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const RetroMomentRoll = await ethers.getContractFactory("RetroMomentRoll");
    const retroMomentRoll = await RetroMomentRoll.deploy(owner.address);

    return { retroMomentRoll, owner, otherAccount };
  }

  describe("Minting Rolls", function () {
    it("Should mint a roll with a specific capacity", async function () {
      const { retroMomentRoll, owner } = await loadFixture(
        deployRetroMomentRollFixture
      );
      const exp = 24;
      await retroMomentRoll.mint(exp);

      const nonce = await retroMomentRoll.walletNonces(owner.address);
      const calculatedNonce = (nonce - BigInt(1)).toString();
      const tokenId = encodeTokenId(owner.address, exp, calculatedNonce);

      // Retrieve the roll details from the contract
      const roll = await retroMomentRoll.rolls(tokenId);

      expect(roll.exp).to.equal(exp);
      expect(roll.reveals).to.equal(0);
    });

    it("Should not mint a roll with zero capacity", async function () {
      const { retroMomentRoll } = await loadFixture(
        deployRetroMomentRollFixture
      );
      await expect(retroMomentRoll.mint(0)).to.be.revertedWith(
        "exposures must be greater than zero"
      );
    });
  });

  describe("Token ID Generation", function () {
    it("Should generate unique token IDs", async function () {
      const { retroMomentRoll, owner } = await loadFixture(
        deployRetroMomentRollFixture
      );
      const exp1 = 12;
      const exp2 = 24;

      await retroMomentRoll.mint(exp1);
      await retroMomentRoll.mint(exp2);

      const nonce = await retroMomentRoll.walletNonces(owner.address);
      const calculatedNonce1 = (nonce - BigInt(2)).toString();
      const calculatedNonce2 = (nonce - BigInt(1)).toString();
      const tokenId1 = encodeTokenId(owner.address, exp1, calculatedNonce1);
      const tokenId2 = encodeTokenId(owner.address, exp2, calculatedNonce2);

      expect(tokenId1).to.not.equal(tokenId2);
    });

    it("Should decode original token values", async function () {
      const { retroMomentRoll, owner } = await loadFixture(
        deployRetroMomentRollFixture
      );
      const exp = 36;

      await retroMomentRoll.mint(exp);

      const nonce = await retroMomentRoll.walletNonces(owner.address);
      const calculatedNonce = (nonce - BigInt(1)).toString();

      const tokenId = encodeTokenId(owner.address, exp, calculatedNonce);
      const {
        address: decodedAddress,
        exp: decodedExp,
        nonce: decodedNonce,
      } = decodeTokenId(tokenId);

      expect(owner.address.toLowerCase()).to.equal(decodedAddress.toLowerCase());
      expect(exp).to.equal(decodedExp);
      expect(Number.parseInt(calculatedNonce, 10)).to.equal(decodedNonce);
    });
  });
});
