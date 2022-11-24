// This code example has been widely copied https://github.com/Jeiwan/upgradeable-proxy-from-scratch under MIT License

//require("@nomiclabs/hardhat-waffle");
const hre = require("hardhat");
const { expect } = require("chai");
const { BigNumber } = require("ethers");

describe("Proxy", async () => {
  let owner;
  let proxy, hhTokenLogic;
  let HhTokenJSON, abi;

  beforeEach(async () => {
    [owner] = await hre.ethers.getSigners();

    const HhToken = await hre.ethers.getContractFactory("HhToken");
    hhTokenLogic = await HhToken.deploy();
    console.log("Token address:", hhTokenLogic.address);

    await hhTokenLogic.deployed();
    HhTokenJSON = require('../artifacts/contracts/HhToken.sol/HhToken.json');

    const Proxy = await hre.ethers.getContractFactory("Proxy");
    proxy = await Proxy.deploy();
    console.log("Proxy address:", proxy.address);

    await proxy.deployed();
    await proxy.setImplementation(hhTokenLogic.address);
    console.log("Proxy hhToken address: ", await proxy.getImplementation());

    abi = ["function initialize() public"];
    const proxied = new ethers.Contract(proxy.address, abi, owner);

    await proxied.initialize();
  });

  it("points to an implementation contract", async () => {
    expect(await proxy.callStatic.getImplementation()).to.eq(hhTokenLogic.address);
  });

  it("proxies calls to implementation contract", async () => {
    abi = HhTokenJSON.abi;

    const proxied = new ethers.Contract(proxy.address, abi, owner);

    expect(await proxied.owner()).to.eq(owner.address);
  });

  it("cannot be initialized twice", async () => {
    abi = ["function initialize() public"];
    const proxied = new ethers.Contract(proxy.address, abi, owner);

    await expect(proxied.initialize()).to.be.revertedWith(
      "Initializable: contract is already initialized"
    );
  });


  it("allows to change implementations", async () => {
    const HhToken_v2 = await ethers.getContractFactory("HhToken_v2");
    hhToken_v2 = await HhToken_v2.deploy();
    await hhToken_v2.deployed();
    
    HhTokenJSON = require('../artifacts/contracts/HhToken_v2.sol/HhToken_v2.json');

    await proxy.setImplementation(hhToken_v2.address);
    console.log("Proxy hhToken_v2 address: ", await proxy.getImplementation());

    abi = HhTokenJSON.abi;

    const proxied2 = new ethers.Contract(proxy.address, abi, owner);
    await proxied2.reInitialize();

    console.log("Owner: ", owner.address);
    console.log("Owner Balance: ", await proxied2.balanceOf(owner.address));

    await proxied2.calculate50PercentBalance(owner.address);
    expect(await proxied2.fiftyPercentOfBalance()).to.eq(500000);

  });

});


