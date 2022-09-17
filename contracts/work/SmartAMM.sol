// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "hardhat/console.sol";

contract SmartAMM {

    uint public constant EPX = 1e6;
    // 拉盘间隔
    uint public interval;

    // 最后一次更新时间
    uint public lastBuy;
    // 平均每笔买入数量
    uint public buyAmount;

    // seter 控制着
    mapping(address => bool) public seter;

    // usdt
    address public usdt;
    address public token;
    address public router;

    modifier onlyDev {
        address sender = msg.sender;
        require(seter[sender], "caller not seter");
        _;
    }

    event RandomBuy(address indexed sender, uint buyAmount, uint seed, uint limit, uint time, address coinbase);

    function setDever(address _seter, bool _status) external {}

    // usdt 数量
    function setBuy(uint _buyAmountUSDTByDay) external {}

    function setInterval(uint _interval) external {}

    function buy() external {}

}
