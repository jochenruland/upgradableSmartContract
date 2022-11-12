// This code example has been widely copied https://github.com/Jeiwan/upgradeable-proxy-from-scratch under MIT License

require("@nomiclabs/hardhat-waffle");
const { expect } = require("chai");

describe("Proxy", async () => {
  let owner;
  let proxy, hhTokenLogic;
  let abi;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();

    const HhToken = await ethers.getContractFactory("HhToken");
    hhTokenLogic = await HhToken.deploy();
    console.log("Token address:", hhTokenLogic.address);

    await hhTokenLogic.deployed();
    const HhTokenJSON = require('../artifacts/contracts/HhToken.sol/HhToken.json');

    const Proxy = await ethers.getContractFactory("Proxy");
    proxy = await Proxy.deploy();
    console.log("Token address:", proxy.address);

    await proxy.deployed();
    await proxy.setImplementation(hhTokenLogic.address);

    abi = ["function initialize() public"];
    const proxied = new ethers.Contract(proxy.address, abi, owner);

    await proxied.initialize();
  });

  it("points to an implementation contract", async () => {
    expect(await proxy.callStatic.getImplementation()).to.eq(hhTokenLogic.address);
  });

  it("proxies calls to implementation contract", async () => {
    abi = HhTokenJSON.abi;
    /*
    [
      "function setMagicNumber(uint256 newMagicNumber) public",
      "function getMagicNumber() public view returns (uint256)",
    ];
    */
    const proxied = new ethers.Contract(proxy.address, abi, owner);

    expect(await proxied.owner()).to.eq(owner.address);
  });

  it("cannot be initialized twice", async () => {
    abi = ["function initialize() public"];
    const proxied = new ethers.Contract(proxy.address, abi, owner);

    await expect(proxied.initialize()).to.be.revertedWith(
      "already initialized"
    );
  });

  /*
  it("allows to change implementations", async () => {
    const LogicV2 = await ethers.getContractFactory("LogicV2");
    logicv2 = await LogicV2.deploy();
    await logicv2.deployed();

    await proxy.setImplementation(logicv2.address);

    abi = [
      "function initialize() public",
      "function setMagicNumber(uint256 newMagicNumber) public",
      "function getMagicNumber() public view returns (uint256)",
      "function doMagic() public",
    ];

    const proxied = new ethers.Contract(proxy.address, abi, owner);

    await proxied.setMagicNumber(0x33);
    expect(await proxied.getMagicNumber()).to.eq("0x33");

    await proxied.doMagic();
    expect(await proxied.getMagicNumber()).to.eq("0x19");
  });
  */
});


/*
// This is an example test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");

// We use `loadFixture` to share common setups (or fixtures) between tests.
// Using this simplifies your tests and makes them run faster, by taking
// advantage of Hardhat Network's snapshot functionality.
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

// `describe` is a Mocha function that allows you to organize your tests.
// Having your tests organized makes debugging them easier. All Mocha
// functions are available in the global scope.
//
// `describe` receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function.
describe("HhToken contract", function () {
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshot in every test.
  async function deployTokenFixture() {
    // Get the ContractFactory and Signers here.
    const HhToken = await ethers.getContractFactory("HhToken");
    const [owner, addr1, addr2] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // its deployed() method, which happens onces its transaction has been
    // mined.
    const hardhatToken = await HhToken.deploy();

    await hardhatToken.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { HhToken, hardhatToken, owner, addr1, addr2 };
  }

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define each
    // of your tests. It receives the test name, and a callback function.
    //
    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      // We use loadFixture to setup our environment, and then assert that
      // things went well
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);

      // `expect` receives a value and wraps it in an assertion object. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be
      // equal to our Signer's owner.
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
      // Transfer 50 tokens from owner to addr1
      await expect(
        hardhatToken.transfer(addr1.address, 50)
      ).to.changeTokenBalances(hardhatToken, [owner, addr1], [-50, 50]);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(
        hardhatToken.connect(addr1).transfer(addr2.address, 50)
      ).to.changeTokenBalances(hardhatToken, [addr1, addr2], [-50, 50]);
    });

    it("should emit Transfer events", async function () {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );

      // Transfer 50 tokens from owner to addr1
      await expect(hardhatToken.transfer(addr1.address, 50))
        .to.emit(hardhatToken, "Transfer")
        .withArgs(owner.address, addr1.address, 50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(hardhatToken.connect(addr1).transfer(addr2.address, 50))
        .to.emit(hardhatToken, "Transfer")
        .withArgs(addr1.address, addr2.address, 50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const { hardhatToken, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(
        hardhatToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");

      // Owner balance shouldn't have changed.
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
  });
});
*/
