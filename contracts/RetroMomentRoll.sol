// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract RetroMomentRoll is ERC721, Ownable {
    struct Roll {
        uint256 exp; // Number of photos the roll can hold
        uint256 reveals; // Number of photos already taken
    }

    mapping(uint256 => Roll) public rolls;
    mapping(address => uint256) public walletNonces;

    constructor(
        address initialOwner
    ) ERC721('RetroMomentRoll', 'PRL') Ownable(initialOwner) {}

    function mint(uint256 exp) external {
        require(exp > 0, 'exposures must be greater than zero');

        uint256 nonce = walletNonces[msg.sender];
        walletNonces[msg.sender]++;

        uint256 tokenId = _generateTokenId(msg.sender, exp, nonce);

        rolls[tokenId] = Roll({exp: exp, reveals: 0});

        _mint(msg.sender, uint256(tokenId));
    }

    function _generateTokenId(
        address minter,
        uint256 exp,
        uint256 nonce
    ) internal pure returns (uint256) {
        return (uint256(uint160(minter)) << 96) | (exp << 32) | nonce;
    }
}
