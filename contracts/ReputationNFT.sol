// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ReputationNFT is ERC721, Ownable {
    uint public tokenIdCounter;
    mapping(address => uint) public driverDeliveries;

    event BadgeMinted(address indexed driver, uint indexed tokenId);

    constructor() ERC721("DriverReputation", "DRNFT") Ownable(msg.sender) {}

    function mintBadge(address driver) public onlyOwner {
        require(driver != address(0), "Invalid driver address");
        uint tokenId = tokenIdCounter++;
        _safeMint(driver, tokenId);
        emit BadgeMinted(driver, tokenId);
    }

    function recordDeliveryAndMaybeMint(address driver) external onlyOwner {
        require(driver != address(0), "Invalid driver address");
        driverDeliveries[driver]++;
        if (driverDeliveries[driver] % 5 == 0) {
            mintBadge(driver);
        }
    }
}
