// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract BatchAsset {

    address private _owner;

    constructor(address _owner_) {
        _owner = _owner_;
    }

    modifier onlyOwner() {
        require(_owner == msg.sender, "Asset caller only owner");
        _;
    }

    function setOwner(address _owner_) external onlyOwner {
        _owner = _owner_;
    }

    struct SendValue {
        address payable to;
        uint amount;
    }
    function batchToken(address token, SendValue[] calldata _sends) external onlyOwner {
        for(uint i = 0; i < _sends.length; i++) {
            SendValue memory _sends_ = _sends[i];
            (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, _sends_.to, _sends_.amount));
            require(success && (data.length == 0 || abi.decode(data, (bool))), "!Asset safeTransfer");
        }
    }

    function batchETH(SendValue[] calldata _sends) external onlyOwner {
        for(uint i = 0; i < _sends.length; i++) {
            SendValue memory _sends_ = _sends[i];
            _sends_.to.transfer(_sends_.amount);
        }
    }

    struct Call {
        address target;
        bytes callData;
    }
    function aggregate(Call[] memory calls) public onlyOwner returns (uint256 blockNumber, bytes[] memory returnData) {
        blockNumber = block.number;
        returnData = new bytes[](calls.length);
        for(uint256 i = 0; i < calls.length; i++) {
            (bool success, bytes memory ret) = calls[i].target.call(calls[i].callData);
            require(success);
            returnData[i] = ret;
        }
    }
}
