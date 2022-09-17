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

let cloneSell;

let tx;
async function main() {
    accounts = await Accounts()
    console.log(
        accounts[0].address,
        accounts[1].address,
        accounts[2].address,
        accounts[3].address,
    )
    // cloneSell = await Attach.Administrator.DeployProxy([])
    cloneSell = await Attach.Administrator()

    // tx = await cloneSell.createCaster(0)
    // console.log(tx.hash)
    // await tx.wait()
    const path = [
        '0xe9e7cea3dedca5984780bafc599bd69add087d56',
        '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'
    ]
    for(let i = 3; i < 4; i++) {
        tx = await cloneSell.buy(
            '0x10ED43C718714eb63d5aA57B78B54704E256024E',
            path,
            BigNumber.from(DecimalHex),
            accounts[0].address,
            i,
            {
                gasLimit: '91354' * 3
            }
        )
        console.log(i, " id ",tx.hash)
        await tx.wait()
    }
    

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
