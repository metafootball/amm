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

let misAmm;
let meerAmm;
let spdAmm;
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

    misAmm = await Attach.SmartAMM(address.Address.MIS_AMM)
    meerAmm = await Attach.SmartAMM(address.Address.MEER_AMM)
    spdAmm = await Attach.SmartAMM(address.Address.SPD_AMM)

    async function runAMM(ammContract, signerId) {
        const signer = accounts[signerId]
        const now = Math.floor(new Date() / 1000)
        const nextBuyTime = ForBig(await ammContract.lastBuy()) * 1
        // 如果 now >= nextBuyTime 就执行买入
        if ( now >= nextBuyTime ) {
            try {
                const tx = await ammContract.connect(signer).buy()
                console.log(`nextBuyTime: ${nextBuyTime} now: ${now} -> ${signerId} hash ${tx.hash}`)
                await tx.wait()
            } catch {
                console.log(`nextBuyTime: ${nextBuyTime} now: ${now} -> ${signerId} error`)
            }
        }
        // 执行报错后 重新计算下一次 执行时间
        // nowAfter < nextBuyTimeAfter 则 setTimeout 会立即执行
        const nextBuyTimeAfter = ForBig(await ammContract.lastBuy()) * 1
        const nowAfter = Math.floor(new Date() / 1000)
        setTimeout(() => {
            runAMM(ammContract, signerId)
        }, (nextBuyTimeAfter - nowAfter)*1000)
    }
    
    
    runAMM(misAmm,0)
    runAMM(meerAmm,1)
    runAMM(spdAmm,3)

    // runMeer(0)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
