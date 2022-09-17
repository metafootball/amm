// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAssetCustody {
    function withdraw(address token, address to, uint256 value) external;
}

contract AssetCustody {

    address private _owner;

    mapping(address => bool) public proxy;

    constructor(address _owner_) {
        _owner = _owner_;
        proxy[_owner_] = true;
    }

    modifier onlyOwner() {
        require(_owner == msg.sender, "Asset caller only owner");
        _;
    }

    function setProxy(address _proxy, bool _status) external onlyOwner {
        proxy[_proxy] = _status;
    }

    function setOwner(address _owner_) external onlyOwner {
        _owner = _owner_;
    }

    function withdraw(address token, address to, uint256 value) external onlyOwner {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "!Asset safeTransfer");
    }

    struct Call {
        address target;
        bytes callData;
    }
    function aggregate(Call[] memory calls) public returns (uint256 blockNumber, bytes[] memory returnData) {
        require(proxy[msg.sender], "call not proxy");
        blockNumber = block.number;
        returnData = new bytes[](calls.length);
        for(uint256 i = 0; i < calls.length; i++) {
            (bool success, bytes memory ret) = calls[i].target.call(calls[i].callData);
            require(success);
            returnData[i] = ret;
        }
    }
}