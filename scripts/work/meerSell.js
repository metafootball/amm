// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, upgrades, network } = require("hardhat");

const {
    Attach,
    Accounts,
    address,
    ForBig,
    BigNumber,
    DecimalHex
} = require("../deployed")

let accounts;

let meerSell;

let tx;
async function main() {
    accounts = await Accounts()
    console.log(
        accounts[0].address,
        accounts[1].address,
        accounts[2].address,
        accounts[3].address,
    )

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
