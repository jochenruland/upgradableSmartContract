# Upgradeable smart contracts

This project is for experimentation purposes implementing a simple proxy pattern
in order to make smart contracts upgradeable.

A great tutorial on upgradeable smart contracts can be found [https://jeiwan.net/posts/upgradeable-proxy-from-scratch/]
Further details especially on initialization can be found [here](https://dev.to/abhikbanerjee99/nuances-of-using-upgradeable-smart-contracts-5acj)

Here you get the basic ideas from Openzepppelin blog on upgradable contracts [here](https://blog.openzeppelin.com/proxy-patterns/)


### *General Concept*
*"All three patterns rely on low-level delegatecalls. Although Solidity provides a delegatecall function, it only returns true/false whether the call succeeded and doesn’t allow you to manage the returned data.*

*When a function call to a contract is made that it does not support, the fallback function will be called. You can write a custom fallback function to handle such scenarios. The proxy contract a custom fallback function to redirect calls to other contract implementations.*

*Whenever a contract A delegates a call to another contract B, it executes the code of contract B in the context of contract A. This means that msg.value and msg.sender values will be kept and every storage modification will impact the storage of contract A.*

### *Upgradeability using Unstructured Storage*
*The Unstructured Storage pattern is similar to Inherited Storage but doesn’t require the logic contract to inherit any state variables associated with upgradeability. This pattern uses an unstructured storage slot defined in the proxy contract to save the data required for upgradeability.*

*In the proxy contract we define a constant variable that, when hashed, should give a random enough storage position to store the address of the logic contract that the proxy should call to.*

`bytes32 private constant implementationPosition = keccak256("org.zeppelinos.proxy.implementation");`

*Since constant state variables do not occupy storage slots, there’s no concern of the implementationPosition being accidentally overwritten by the logic contract. Due to how Solidity lays out its state variables in storage there is extremely little chance of collision of this storage slot being used by something else defined in the logic contract.*

*By using this pattern, none of the logic contract versions have to know about the storage structure of the proxy, however all future logic contracts must inherit the storage variables declared by their ancestor versions. Just like in Inherited Storage pattern, future upgraded token logic contracts can upgrade existing functions as well as introduce new functions and new storage variables.*

*This implementation provided in the Zeppelin’s labs repository also uses the concept of proxy ownership. A proxy owner is the only address that can upgrade a proxy to point to a new logic contract, and the only address that can transfer ownership.*

### *How to Initialize*
- *Deploy an OwnedUpgradeabilityProxy instance*
- *Deploy an initial version of your contract (v1)* 
- *Call your OwnedUpgradeabilityProxy instance to upgrade to the address of your initial version*

*If your logic contract relies on its constructor to set up some initial state, that would have to be redone after its linked to the proxy since the proxy’s storage doesn’t know about those values.  OwnedUpgradeabilityProxy has a function upgradeToAndCall specifically to call some function on your logic contract to redo the setup after the proxy upgrades to it.*

### *How to Upgrade*
- *Deploy a new version of your contract (v2) making sure it inherits the state variable structures used in previous versions.*
- *Call your OwnedUpgradeabilityProxy instance to upgrade to the address of your new contract version.*

*The upgradable contract architecture based on unstructured storage pattern has been further devlopped using transparent proxies to avoid potential function clashes [here](https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies?utm_source=zos&utm_medium=blog&utm_campaign=proxy-pattern)*

### *Transparent Proxies and Function Clashes*
*As described in the previous sections, upgradeable contract instances (or proxies) work by delegating all calls to a logic contract. However, the proxies need some functions of their own, such as upgradeTo(address) to upgrade to a new implementation. This begs the question of how to proceed if the logic contract also has a function named upgradeTo(address): upon a call to that function, did the caller intend to call the proxy or the logic contract?*

*Clashing can also happen among functions with different names. Every function that is part of a contract’s public ABI is identified, at the bytecode level, by a 4-byte identifier. This identifier depends on the name and arity of the function, but since it’s only 4 bytes, there is a possibility that two different functions with different names may end up having the same identifier. The Solidity compiler tracks when this happens within the same contract, but not when the collision happens across different ones, such as between a proxy and its logic contract. Read this article for more info on this.*
*The way OpenZeppelin Upgrades deals with this problem is via the transparent proxy pattern. A transparent proxy will decide which calls are delegated to the underlying logic contract based on the caller address (i.e., the msg.sender):*

*If the caller is the admin of the proxy (the address with rights to upgrade the proxy), then the proxy will not delegate any calls, and only answer any messages it understands.*

*If the caller is any other address, the proxy will always delegate a call, no matter if it matches one of the proxy’s functions.*

*Assuming a proxy with an owner() and an upgradeTo() function, that delegates calls to an ERC20 contract with an owner() and a transfer() function, the following table covers all scenarios:*

| msg.sender | owner() | upgradeto() | transfer() |
| ----------- | ----------- | ----------- | ----------- |
| Owner | returns proxy.owner() | returns proxy.upgradeTo() | fails |
| Other | returns erc20.owner() | fails | returns erc20.transfer() |

*Fortunately, OpenZeppelin Upgrades accounts for this situation, and creates an intermediary ProxyAdmin contract that is in charge of all the proxies you create via the Upgrades plugins. Even if you call the deploy command from your node’s default account, the ProxyAdmin contract will be the actual admin of all your proxies. This means that you will be able to interact with the proxies from any of your node’s accounts, without having to worry about the nuances of the transparent proxy pattern. Only advanced users that create proxies from Solidity need to be aware of the transparent proxies pattern.*




Hardhat is used as development and test environment.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```