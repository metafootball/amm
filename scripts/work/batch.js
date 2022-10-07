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

let meerAmm;
async function main() {
    accounts = await Accounts()
    console.log(
        accounts[0].address,
        accounts[1].address,
        accounts[2].address
    )
    // console.log(
    //     accounts[3],
    //     // network
    // )

    const e18 = BigNumber.from(DecimalHex)

    // const batch = await Attach.BatchAsset()
    const batch = await Attach.BatchAsset.Deploy(accounts[0].address)

    return
    const router = await Attach.Router()

    const Fy = await Attach.TestCoin(address.Address.FY)
    const hUsdt = await Attach.TestCoin(address.Address.HFUSDT)
    
    const meerAmm = await Attach.SmartAMM(address.Address.MEER_AMM)
    
    tx = await hUsdt.transfer(batch.address, e18)
    console.log(tx.hash)
    await tx.wait()

    tx = await batch.aggregate([
        hUsdt.calls.approve(router.address, e18),
        router.calls.swapExactTokensForTokens(e18,0,[hUsdt.address, Fy.address], batch.address, Math.floor(new Date() / 1000) + 3600)
    ])
    console.log(tx.hash)
    await tx.wait()
    // tx = await meerAmm.
    // runMeer(0)


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
