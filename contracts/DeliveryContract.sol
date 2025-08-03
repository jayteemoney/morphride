// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract DeliveryContract {
    address public admin;
    IERC20 public stablecoin;

    uint public requestCounter;

    struct Request {
        address user;
        address driver;
        uint amount;
        bool isCompleted;
    }

    mapping(uint => Request) public requests;
    mapping(address => Request[]) public userRequests;

    event RequestCreated(uint requestId, address user, address driver, uint amount);
    event RequestCompleted(uint requestId, address driver);

    constructor(address _stablecoin) {
        admin = msg.sender;
        stablecoin = IERC20(_stablecoin);
    }

    function createRequest(uint _amount, address _driver) external {
        require(_amount > 0, "Amount must be > 0");

        stablecoin.transferFrom(msg.sender, address(this), _amount);

        requests[requestCounter] = Request(msg.sender, _driver, _amount, false);
        userRequests[msg.sender].push(requests[requestCounter]);
        emit RequestCreated(requestCounter, msg.sender, _driver, _amount);

        requestCounter++;
    }

    function completeRequest(uint _requestId) external {
        Request storage req = requests[_requestId];
        require(msg.sender == req.driver, "Not authorized");
        require(!req.isCompleted, "Already completed");

        req.isCompleted = true;
        stablecoin.transfer(req.driver, req.amount);

        emit RequestCompleted(_requestId, msg.sender);
    }
}