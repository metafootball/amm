var XLSX = require('node-xlsx');


const {
    Attach,
    Accounts,
    DecimalHex,
    BigNumber,
    BnbBalance,
    ForBig
} = require("../deployed")
const e18 = BigNumber.from(DecimalHex)

function getUserData() {
    var workbook = XLSX.parse(`${__dirname}/air1.csv`);
    const data = workbook[0].data
    const initP = []
    let totalAmount = BigNumber.from(0)
    for(let i = 0 ;i < data.length; i++) {
        // initP.push({
        //     user: data[i][0],
        //     amount: e18
        // })
        const amount = e18.mul(data[i][1])
        initP.push([
            data[i][0],
            amount
        ])
        totalAmount = totalAmount.add(amount)
    }
    console.log(totalAmount,"totalAmount")
    return initP
}

async function main() {

    const batch = await Attach.BatchAsset()

    const sendList = getUserData()
    console.log(
        sendList.length
    )
    console.table(
        sendList
    )
    // sendList.
    console.log(
        batch.address
    )
    // return
    
    // const sList = sendList.slice(0,50)
    tx = await batch.batchETH(sendList) 
    console.log(tx.hash)
    await tx.wait()

    // for(let i = 3000; i < 3200; i++) {
    //     const addr = sendList[i][0]
    //     console.log(
    //         ForBig({
    //             ba: await BnbBalance(addr),
    //             addr
    //         })
            
    //     )
        
    // }
    
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
