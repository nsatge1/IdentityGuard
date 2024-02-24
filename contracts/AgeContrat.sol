// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AgeContrat {
    address public owner;
    uint256 public age;
    uint256 private verificationCode;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setAge(uint256 _age) external onlyOwner {
        age = _age;
    }

    function setVerificationCode(uint256 _code) external onlyOwner {
        verificationCode = _code;
    }

    function verifyCode(uint256 _code) external view returns (bool) {
        return _code == verificationCode;
    }
    
    function getAge() public view returns (uint256){
     return age;
    }
}
