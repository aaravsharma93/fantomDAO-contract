// @dev. This script will deploy this V1.1 of XYZDAO. It will deploy the whole ecosystem except for the LP tokens and their bonds. 
// This should be enough of a test environment to learn about and test implementations with the XYZDAO as of V1.1.
// Not that the every instance of the Treasury's function 'valueOf' has been changed to 'valueOfToken'... 
// This solidity function was conflicting w js object property name

const { ethers } = require("hardhat");

async function main() {

    

    const { network, ethers } = hre;
    const [deployer, MockDAO] = await ethers.getSigners();
    if (network.name == "fantom") {

        //TODO :: L-89 MockXYZDAOTreasury - Treasury and for that create Pair using any swap i.e spiritswap and supply para 
        console.log("Check TODO before Mainnet ");
        return;
    }
    console.log('Deploying contracts with the account: ' + deployer.address);
    console.log(MockDAO.address);
    return;
    // Initial staking index
    const initialIndex = '7675210820';

    // First block epoch occurs
    const blockNumber = await ethers.provider.getBlockNumber();
    const firstEpochBlock = blockNumber + 100;

    // What epoch will be first epoch
    const firstEpochNumber = '1';

    // How many blocks are in each epoch
    const epochLengthInBlocks = '9600';

    // Initial reward rate for epoch
    const initialRewardRate = '3000';

    // Ethereum 0 address, used when toggling changes in treasury
    const zeroAddress = '0x0000000000000000000000000000000000000000';

    // Large number for approval for Frax and DAI
    const largeApproval = '100000000000000000000000000000000';

    // Initial mint for Frax and DAI (10,000,000)
    const initialMint = '10000000000000000000000000';

    // DAI bond BCV
    const daiBondBCV = '369';

    // Frax bond BCV
    const fraxBondBCV = '690';

    // Bond vesting length in blocks. 33110 ~ 5 days
    const bondVestingLength = '33110';

    // Min bond price
    const minBondPrice = '50000';

    // Max bond payout
    const maxBondPayout = '50'

    // DAO fee for bond
    const bondFee = '10000';

    // Max debt bond can take on
    const maxBondDebt = '1000000000000000';

    // Initial Bond debt
    const intialBondDebt = '0'

    // Deploy XYZ
    const XYZ = await ethers.getContractFactory('XYZDAOERC20Token');
    const XYZ = await XYZ.deploy();
    // const XYZ = XYZ.attach("0xD5C7Be8a684EaA8f342Efa7C5Ed7f811BB74FCC1")
    console.log("XYZ Contract: ", XYZ.address);

    // Deploy DAI
    const DAI = await ethers.getContractFactory('DAI');
    const dai = await DAI.deploy( 4002 );
    console.log("DAI Contract: ", dai.address);

    // Deploy Frax
    const Frax = await ethers.getContractFactory('FRAX');
    const frax = await Frax.deploy( 4002 );
    console.log("frax Contract: ", frax.address);

    // Deploy 10,000,000 mock DAI and mock Frax
    await dai.mint( deployer.address, initialMint );
    await frax.mint( deployer.address, initialMint );

    // TODO :: Apply this before Mainnet 
    // const uniswapFactoryAddr = "FactoryAdd"
    // const uniswapFactory = new ethers.Contract(
    //     uniswapFactoryAddr,
    //     UniswapV2ABI,
    //     deployer
    // )
    // await (await uniswapFactory.createPair(XYZ.address, dai.address)).wait(1)
    // const lpAddress = await uniswapFactory.getPair(XYZ.address, dai.address)
    // const lpAddress = "here copy created pair address if done from outside script"
    // console.log('LP created: ' + lpAddress)

    // const Treasury = await ethers.getContractFactory('MockXYZDAOTreasury'); 
    // const treasury = await Treasury.deploy( XYZ.address, dai.address, frax.address,lpAddress, 0 );

    // Deploy treasury
    //@dev changed function in treaury from 'valueOf' to 'valueOfToken'... solidity function was coflicting w js object property name
    
    
    const Treasury = await ethers.getContractFactory('MockXYZDAOTreasury'); 
    const treasury = await Treasury.deploy( XYZ.address, dai.address, frax.address, 0 );
    console.log("Treasury Contract: ", treasury.address);

    // Deploy bonding calc
    const XYZDAOBondingCalculator = await ethers.getContractFactory('XYZDAOBondingCalculator');
    const XYZDAOBondingCalculator = await XYZDAOBondingCalculator.deploy( XYZ.address );
    console.log("BondingCalculator Contract: ", XYZDAOBondingCalculator.address);

    // Deploy staking distributor
    const Distributor = await ethers.getContractFactory('Distributor');
    const distributor = await Distributor.deploy(treasury.address, XYZ.address, epochLengthInBlocks, firstEpochBlock);
    console.log("Distributor Contract: ", distributor.address);

    // Deploy sXYZ
    const SXYZ = await ethers.getContractFactory('sXYZDAO');
    const sXYZ = await SXYZ.deploy();
    console.log("sXYZ Contract: ", sXYZ.address);

    // TODO :: ADD wsXYZ deploye code
    
	const WSXYZ = await ethers.getContractFactory("wsXYZ");
        
	const wsXYZ = await WSXYZ.deploy(sXYZ.address);

	console.log("wsXYZ Contract deployed at:", wsXYZ.address);

    // Deploy Staking
    const Staking = await ethers.getContractFactory('XYZDAOStaking');
    const staking = await Staking.deploy( XYZ.address, sXYZ.address, epochLengthInBlocks, firstEpochNumber, firstEpochBlock );
    console.log("Staking Contract: ", staking.address);

    // Deploy staking warmpup
    const StakingWarmpup = await ethers.getContractFactory('StakingWarmup');
    const stakingWarmup = await StakingWarmpup.deploy(staking.address, sXYZ.address);
    console.log("StakingWarmpup Contract: ", stakingWarmup.address);

    // Deploy staking helper
    const StakingHelper = await ethers.getContractFactory('StakingHelper');
    const stakingHelper = await StakingHelper.deploy(staking.address, XYZ.address);
    console.log("StakingHelper Contract: ", stakingHelper.address);

    // Deploy DAI bond
    //@dev changed function call to Treasury of 'valueOf' to 'valueOfToken' in BondDepository due to change in Treausry contract
    const DAIBond = await ethers.getContractFactory('XYZDAOBondDepository');
    const daiBond = await DAIBond.deploy(XYZ.address, dai.address, treasury.address, MockDAO.address, zeroAddress);
    console.log("DAIBond Contract: ", daiBond.address);

    // Deploy Frax bond
    //@dev changed function call to Treasury of 'valueOf' to 'valueOfToken' in BondDepository due to change in Treausry contract
    const FraxBond = await ethers.getContractFactory('XYZDAOBondDepository');
    const fraxBond = await FraxBond.deploy(XYZ.address, frax.address, treasury.address, MockDAO.address, zeroAddress);
    console.log("FraxBond Contract: ", fraxBond.address);

    // Deploy redeem helper
    const RedemmHelper = await ethers.getContractFactory('RedeemHelper');
    const redemmHelper = await RedemmHelper.deploy();
    // const redemmHelper = RedemmHelper.attach("0xc108B433092c00dB9b1846E8B17d5b3a764B3030")
   console.log("RedemmHelper Contract: ", redemmHelper.address);

    await redemmHelper.addBondContract(daiBond.address);
    await redemmHelper.addBondContract(fraxBond.address);
    // await redemmHelper.addBondContract(daiRABond.address);

    // TODO :: In client Code this was developed why? Deploy RACirculatingSupply helper 

    // queue and toggle DAI and Frax bond reserve depositor
    await treasury.queue('0', daiBond.address);
    await treasury.queue('0', fraxBond.address);
    await treasury.toggle('0', daiBond.address, zeroAddress);
    await treasury.toggle('0', fraxBond.address, zeroAddress);

    console.log("Queue - Toggle Bond");

    // Set DAI and Frax bond terms
    await daiBond.initializeBondTerms(daiBondBCV, bondVestingLength, minBondPrice, maxBondPayout, bondFee, maxBondDebt, intialBondDebt);
    await fraxBond.initializeBondTerms(fraxBondBCV, bondVestingLength, minBondPrice, maxBondPayout, bondFee, maxBondDebt, intialBondDebt);

    
    // Set staking for DAI and Frax bond
    await daiBond.setStaking(staking.address, stakingHelper.address);
    await fraxBond.setStaking(staking.address, stakingHelper.address);
    console.log("Bonds Set Staking");


    // Initialize sXYZ and set the index
    await sXYZ.initialize(staking.address);
    await sXYZ.setIndex(initialIndex);
    console.log("Staked MUSH Init");


    // set distributor contract and warmup contract
    await staking.setContract('0', distributor.address);
    await staking.setContract('1', stakingWarmup.address);
    console.log("Staking Set Contract");

    // Set treasury for XYZ token
    await XYZ.setVault(treasury.address);

    // Add staking contract as distributor recipient
    await distributor.addRecipient(staking.address, initialRewardRate);
    console.log("Distributor addRecipient");

    // queue and toggle reward manager
    let tx = await treasury.queue('8', distributor.address);
    await tx.wait(1)
    await treasury.toggle('8', distributor.address, zeroAddress);
    console.log("Treasury Queue - Toggle Distributor");

    // queue and toggle deployer reserve depositor
    tx = await treasury.queue('0', deployer.address);
    await tx.wait(1)
    await treasury.toggle('0', deployer.address, zeroAddress);
    console.log("Treasury Queue - Toggle Token depositor");

    // queue and toggle liquidity depositor
    tx = await treasury.queue('4', deployer.address, );
    await tx.wait(1)
    await treasury.toggle('4', deployer.address, zeroAddress);
    console.log("Treasury Queue - Toggle Liquid depositor");

    // Approve the treasury to spend DAI and Frax
    await dai.approve(treasury.address, largeApproval );
    await frax.approve(treasury.address, largeApproval );
    console.log("Approve Stable Coin for Treasury");

    // Approve dai and frax bonds to spend deployer's DAI and Frax
    await dai.approve(daiBond.address, largeApproval );
    await frax.approve(fraxBond.address, largeApproval );
    console.log("Approve Stable Coin for Bond");

    // Approve staking and staking helper contact to spend deployer's XYZ
    await XYZ.approve(staking.address, largeApproval);
    await XYZ.approve(stakingHelper.address, largeApproval);
    console.log("Approve XYZ Token");

    // Set XYZ for OHM token
    await XYZ.setVault(deployer.address);
    console.log("MUSH Token Set Vault For Deployer");

    await XYZ.setVault(treasury.address);
    console.log("XYZ Token Set Vault For Deployer");

    // Deposit 9,000,000 DAI to treasury, 600,000 XYZ gets minted to deployer and 8,400,000 are in treasury as excesss reserves
    await treasury.deposit('9000000000000000000000000', dai.address, '8400000000000000');
    console.log("jay 1");
    // Deposit 5,000,000 Frax to treasury, all is profit and goes as excess reserves
    await treasury.deposit('5000000000000000000000000', frax.address, '5000000000000000');
    console.log("jay 2");
    // Stake XYZ through helper
    await stakingHelper.stake('100000000000');
    console.log("jay 3");

    // Bond 1,000 XYZ and Frax in each of their bonds
    // await daiBond.deposit('1000000000000000000000', '60000', deployer.address );
    // await fraxBond.deposit('1000000000000000000000', '60000', deployer.address );

    console.log( "XYZ: " + XYZ.address );
    console.log( "DAI: " + dai.address );
    console.log( "Frax: " + frax.address );
    console.log( "Treasury: " + treasury.address );
    console.log( "Calc: " + XYZDAOBondingCalculator.address );
    console.log( "Staking: " + staking.address );
    console.log( "sXYZ: " + sXYZ.address );
    console.log( "wsXYZ :", wsXYZ.address);
    console.log( "Distributor " + distributor.address);
    console.log( "Staking Warmup " + stakingWarmup.address);
    console.log( "Staking Helper " + stakingHelper.address);
    console.log("DAI Bond: " + daiBond.address);
    console.log("Frax Bond: " + fraxBond.address);
    console.log("RedemmHelper Contract: ", redemmHelper.address);
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})
