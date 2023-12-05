async function main() {

	const [deployer] = await ethers.getSigners();

	console.log(
	"Deploying contracts with the account:",
	deployer.address
	);

	console.log("Account balance:", (await deployer.getBalance()).toString());
	// TestNet
    // const XYZ = "0x01003Bc1B1e9Be3e792b4EDcBaCeCaCdb7ee2c39";
	// const WSXYZ = await ethers.getContractFactory("XYZCirculatingSupplyConrtact");
        
	// MainNet
	const XYZ = "0x59a1BffBbb1d7b5bd21A3495b0C85027C888cE78";
	const WSXYZ = await ethers.getContractFactory("XYZCirculatingSupplyConrtact");
	const wsXYZ = await WSXYZ.deploy(deployer.address);
	// const XYZ = WSXYZ.attach("0x80016c564bc2FBb2092B51Ec39f65039D011123C")
	await wsXYZ.initialize(XYZ);
	console.log("Contract deployed at:", wsXYZ.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
	console.error(error);
	process.exit(1);
  });