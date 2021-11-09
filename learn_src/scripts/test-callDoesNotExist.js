// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const [deployer] = await ethers.getSigners();
  const ContractFactory = await hre.ethers.getContractFactory('Caller');
  const contract = await ContractFactory.deploy();
  const ContractFactory2 = await hre.ethers.getContractFactory('Receiver');
  const contract2 = await ContractFactory2.deploy();

  await contract.deployed();
  await contract2.deployed();

  console.log('Caller Contract deployed to:', contract.address);
  console.log('Receiver Contract deployed to:', contract2.address);
  contract2.on('Received', (caller, amount, message) => {
    console.log(
      `Received() event=> Caller: ${caller}, Amount: ${amount.toString()}, Message: ${message} `,
    );
  });
  contract.on('Response', (success, data) => {
    console.log(`Response() event=> success: ${success}, data: ${parseInt(data, 16)} `);
  });
  try {
    console.log(`Calling testCallFoo(${contract2.address}) with 1 ether`);
    await contract.testCallDoesNotExist(contract2.address);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => {
    setTimeout(() => {
      process.exit(0);
    }, 6000);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
