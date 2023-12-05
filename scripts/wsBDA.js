async function main() {

	const [deployer] = await ethers.getSigners();

	console.log(
	"Deploying contracts with the account:",
	deployer.address
	);

	console.log("Account balance:", (await deployer.getBalance()).toString());
	// Testnet
    // const sXYZ = "0x526Ee10Eebc05b6bBF945ED47e06633dAB00a630";

	// Mainnet
	const sXYZ = "0xAE0D27b0619897F03e8f21Ea5bfbECbB206A3a1d";
	const WSXYZ = await ethers.getContractFactory("wsXYZ");
        
	const wsXYZ = await WSXYZ.deploy(sXYZ);

	console.log("Contract deployed at:", wsXYZ.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
	console.error(error);
	process.exit(1);
  });