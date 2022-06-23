// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IPair {
    function token0() external view returns (address);
    function token1() external view returns (address);
    function balanceOf(address owner) external view returns (uint);
    function getReserves() external view returns ( uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast );
    function mint(address to) external returns (uint liquidity);
    function burn(address to) external returns (uint amount0, uint amount1);
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;
    function skim(address to) external;
    function sync() external;
}
