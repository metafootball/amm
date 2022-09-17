const { expect } = require("chai");
const { ethers } = require("hardhat");

const {
    Attach,
    Accounts,
} = require('../scripts/deployed')

let cloneSell;
let accounts;
describe("Clone", function () {

    before(async () => {
        accounts = await Accounts()
        cloneSell = await Attach.Administrator.DeployProxy([])
        // 0xe9e7cea3dedca5984780bafc599bd69add087d56 busd
        // 
    })
    it("Should return the new greeting once it's changed", async function () {
        const Greeter = await ethers.getContractFactory("Greeter");
        const greeter = await Greeter.deploy("Hello, world!");
        await greeter.deployed();

        expect(await greeter.greet()).to.equal("Hello, world!");

        const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

        // wait until the transaction is mined
        await setGreetingTx.wait();

        expect(await greeter.greet()).to.equal("Hola, mundo!");
    });
});
