// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

import "../utils/SafeToken.sol";

interface IERC20 {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint);
    function balanceOf(address owner) external view returns (uint);
    function allowance(address owner, address spender) external view returns (uint);
    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);
}


interface IRouter {
    function factory() external view returns (address);
    function WETH() external view returns (address);
    function addLiquidity(address,address,uint,uint,uint,uint,address,uint) external returns (uint,uint,uint);
    function addLiquidityETH(address,uint,uint,uint,address,uint) external payable returns (uint,uint,uint);
    function removeLiquidity(address,address,uint,uint,uint,address,uint) external returns (uint,uint);
    function swapExactTokensForTokens(uint,uint,address[] calldata,address,uint) external returns (uint[] memory);
    function swapTokensForExactTokens(uint,uint,address[] calldata,address,uint) external returns (uint[] memory);
    function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint,uint,address[] calldata,address,uint) external;
}


contract Caster {
    function cast(address target, bytes calldata data) external payable returns(bool ok, bytes memory returndata) {
        (ok,returndata) = target.call{value: msg.value}(data);
    }
}

contract Administrator is OwnableUpgradeable {

    using SafeToken for address;

    address public casterContract;

    mapping(uint => address) public caster;
    mapping(address => bool) public proxy;

    function initialize() public initializer {
        casterContract = address(new Caster());
        __Ownable_init();
        proxy[_msgSender()] = true;
    }

    function setP(address _proxy, bool _status) external onlyOwner {
        proxy[_proxy] = _status;
    }

    function _salt(address _token) internal view returns(bytes32) {
        return keccak256(abi.encodePacked(_token, address(this)));
    }

    function _clone(uint id) internal returns(address _caster) {
        bytes32 salt = keccak256(abi.encodePacked(id, address(this)));
        bytes20 targetBytes = bytes20(casterContract);
        assembly {
            let clone := mload(0x40)
            mstore(clone, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
            mstore(add(clone, 0x14), targetBytes)
            mstore(add(clone, 0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
            _caster := create2(0, clone, 0x37, salt)
        }
        caster[id] = _caster;
    }

    // abi.encodeWithSelector(IERC20Minimal.balanceOf.selector, address(this))
    // uint amountIn,
    // uint amountOutMin,
    // address[] calldata path,
    // address to,
    // uint deadline
    function _swap(uint amountIn, uint amountOutMin, address[] memory path, address to, uint deadline) internal pure returns(bytes memory) {
        return abi.encodeWithSelector(IRouter.swapExactTokensForTokens.selector, amountIn, amountOutMin, path, to, deadline);
    }

    function _approve(address spender, uint value) internal pure returns(bytes memory) {
        return abi.encodeWithSelector(IERC20.approve.selector, spender, value);
    }

    function _transfer(address to, uint value) internal pure returns(bytes memory) {
        return abi.encodeWithSelector(IERC20.transfer.selector, to, value);
    }

    function createCaster(uint id) public returns(address _caster) {
        _caster = caster[id];
        if ( _caster == address(0) ) {
            _caster = _clone(id);
        }
    }

    struct Call {
        address target;
        bytes callData;
    }
    function aggregate(Call[] memory calls) public returns (uint256 blockNumber, bytes[] memory returnData) {
        require(proxy[_msgSender()], "call not proxy");
        blockNumber = block.number;
        returnData = new bytes[](calls.length);
        for(uint256 i = 0; i < calls.length; i++) {
            (bool success, bytes memory ret) = calls[i].target.call(calls[i].callData);
            require(success);
            returnData[i] = ret;
        }
    }

    function buy(address router, address[] calldata path, uint amountIn, address to, uint id) external {
        require(proxy[_msgSender()], "call not proxy");

        address _caster = createCaster(id);
        Caster _casterContract = Caster(_caster);

        path[0].safeTransfer(_caster, amountIn);

        _casterContract.cast(path[0], _approve(router, amountIn));
        _casterContract.cast(router, _swap(amountIn, 0, path, to, block.timestamp));
    }
}


