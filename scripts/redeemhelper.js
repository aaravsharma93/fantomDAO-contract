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
        
	const diaBond = '0x21F6457BF1C18CBaEb5E92D9469696B20D37fB23';
	const fraxBond = '0xBFdc38F89BbeC26A2FEE525699BCd58511672938';
	const RedemmHelper = await ethers.getContractFactory('RedeemHelper');
     const redemmHelper = await RedemmHelper.deploy();
    //  const redemmHelper = RedemmHelper.attach("0x943B32F40D0d5b31E93C60Fc84Addd8cC31E6948")
    console.log("RedemmHelper Contract: ", redemmHelper.address);
 
     await redemmHelper.addBondContract(diaBond);
     await redemmHelper.addBondContract(fraxBond);
	console.log("Contract bond added:");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
	console.error(error);
	process.exit(1);
  });