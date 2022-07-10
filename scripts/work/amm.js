// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
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
        // return
    misAmm = await Attach.SmartAMM(address.Address.MIS_AMM)
    meerAmm = await Attach.SmartAMM(address.Address.MEER_AMM)
    spdAmm = await Attach.SmartAMM(address.Address.SPD_AMM)
    function run(nextTime) {
        setTimeout(async () => {
            const tx = await misAmm.buy()
            console.log(tx.hash)
            await tx.wait()
            const next = await misAmm.lastBuy()
            const now = Math.floor(new Date() / 1000)
            const step = ForBig(next) - now
            console.log(
                step, "mis"
            )
            run(step * 1000)
        }, nextTime)
    }
    
    run(0)

    
    function runMeer(nextTime) {
        setTimeout(async () => {
            const sender = accounts[1]
            const tx = await meerAmm.connect(sender).buy()
            console.log("meerAmm buy ", tx.hash)
            await tx.wait()
            const next = await meerAmm.lastBuy()
            const now = Math.floor(new Date() / 1000)
            const step = ForBig(next) - now
            console.log(
                step, 'meer'
            )
            runMeer(step * 1000)
        }, nextTime)
    }

    runMeer(0)

    function runSPD(nextTime) {
        setTimeout(async () => {
            const sender = accounts[1]
            const tx = await spdAmm.connect(sender).buy()
            console.log("meerAmm buy ", tx.hash)
            await tx.wait()
            const next = await spdAmm.lastBuy()
            const now = Math.floor(new Date() / 1000)
            const step = ForBig(next) - now
            console.log(
                step, 'runSPD'
            )
            runSPD(step * 1000)
        }, nextTime)
    }

    runSPD(0)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
