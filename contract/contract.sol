// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DiscountCard {

    // Address of the person who deploys the contract
    address public owner;

    // Structure to store each user's discount card
    struct Card {
        uint discount;     // discount percentage
        uint usesLeft;     // how many times it can be used
        bool active;       // whether card is usable
    }

    // Mapping: user address => their card
    mapping(address => Card) public cards;

    // EVENTS (for logging on blockchain)
    event CardGiven(address user, uint discount, uint uses);
    event CardUsed(address user, uint remainingUses);
    event CardRemoved(address user);

    // This runs automatically when contract is deployed
    constructor() {
        owner = msg.sender;   // deployer becomes owner
    }

    // Only owner can call certain functions
    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    // Owner gives a discount card to a user
    function giveCard(address user, uint discount, uint uses) public onlyOwner {
        require(user != address(0), "Invalid address");
        require(discount <= 100, "Discount too high");

        cards[user] = Card(discount, uses, true);

        emit CardGiven(user, discount, uses);
    }

    // User uses their discount card once
    function useMyCard() public {
        require(cards[msg.sender].active == true, "No active card");
        require(cards[msg.sender].usesLeft > 0, "No uses left");

        cards[msg.sender].usesLeft--;

        emit CardUsed(msg.sender, cards[msg.sender].usesLeft);

        // If no uses left, disable the card
        if (cards[msg.sender].usesLeft == 0) {
            cards[msg.sender].active = false;
        }
    }

    // Owner can remove a user's card
    function removeCard(address user) public onlyOwner {
        cards[user].active = false;
        emit CardRemoved(user);
    }

    // Anyone can check their own card details
    function myCard() public view returns (uint discount, uint usesLeft, bool active) {
        Card memory c = cards[msg.sender];
        return (c.discount, c.usesLeft, c.active);
    }
}
