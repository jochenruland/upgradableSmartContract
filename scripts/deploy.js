async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const HhToken = await ethers.getContractFactory("HhToken");
  const hhTokenLogic = await HhToken.deploy();
  console.log("Token address:", hhTokenLogic.address);

  const Proxy = await ethers.getContractFactory("Proxy");
  const proxy = await Proxy.deploy();
  console.log("Token address:", proxy.address);  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


/**
 * @dev This has to be part of the implementation
 * await hhTokenLogic.deployed();
 * const HhTokenJSON = require('../artifacts/contracts/HhToken.sol/HhToken.json');
 * await proxy.deployed();
 * await proxy.setImplementation(hhTokenLogic.address);
 * abi = ["function initialize() public"];
 * const proxied = new ethers.Contract(proxy.address, abi, owner);
 * await proxied.initialize();
*/
