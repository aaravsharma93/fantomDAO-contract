// @dev. This script will deploy this V1.1 of XYZDAO. It will deploy the whole ecosystem except for the LP tokens and their bonds. 
// This should be enough of a test environment to learn about and test implementations with the XYZDAO as of V1.1.
// Not that the every instance of the Treasury's function 'valueOf' has been changed to 'valueOfToken'... 
// This solidity function was conflicting w js object property name

const { ethers } = require("hardhat");

async function main() {

    const { network, ethers } = hre;
    const [deployer, MockDAO] = await ethers.getSigners();
    // if (network.name != "development") {

    //     //TODO :: L-89 MockXYZDAOTreasury - Treasury and for that create Pair using any swap i.e spiritswap and supply para 
    //     console.log("Check TODO before Mainnet ");
    //     return;
    // }
    // const [deployer, MockDAO] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    // Initial staking index
    const initialIndex = '7675210820';

    // First block epoch occurs
    // const firstEpochBlock = '8961000';
    const blockNumber = await ethers.provider.getBlockNumber();
    const firstEpochBlock = blockNumber + 100;

    // What epoch will be first epoch
    const firstEpochNumber = '22';

    // How many blocks are in each epoch
    const epochLengthInBlocks = '28800';

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

    // Deploy OHM
    const OHM = await ethers.getContractFactory('XYZDAOERC20Token');
    // const ohm = await OHM.deploy();
    const ohm = OHM.attach("0x59a1BffBbb1d7b5bd21A3495b0C85027C888cE78");    
    console.log( "OHM   Contract: " + ohm.address );

    // Deploy DAI
    const DAI = await ethers.getContractFactory('DAI');
    // const dai = await DAI.deploy( 250 );
    const dai = DAI.attach("0xE507e671B2c205073ad49DcccB0822fA03849573");
    console.log( "DAI   Contract: " + dai.address );
    
    // Deploy Frax
    const Frax = await ethers.getContractFactory('FRAX');
    // const frax = await Frax.deploy( 250 );
    const frax = Frax.attach("0xCa40d22b60F1999820C943d197e82ee5a55e8690");
    console.log( "Frax  Contract: " + frax.address );

    // Deploy 10,000,000 mock DAI and mock Frax
    // await dai.mint( deployer.address, initialMint );
    // await frax.mint( deployer.address, initialMint );
    console.log("Miniting Done");
    
    // Deploy treasury
    //@dev changed function in treaury from 'valueOf' to 'valueOfToken'... solidity function was coflicting w js object property name
    const Treasury = await ethers.getContractFactory('XYZDAOTreasury'); 
    // const treasury = await Treasury.deploy( ohm.address, dai.address, frax.address, 0 );
    // const treasury = Treasury.attach("0x1E96E4BA3cAfdbdeEC6fa9E2B8E8232CC9d7d618"); // Privious treasury
    const treasury = Treasury.attach("0x7c8d92eefec8a736e94ded4cd08de444dd994c41"); //  use in distributor
    console.log( "Treasury  Contract: " + treasury.address );
    
    // Deploy bonding calc
    const XYZDAOBondingCalculator = await ethers.getContractFactory('XYZDAOBondingCalculator');
    // const xyzDAOBondingCalculator = await XYZDAOBondingCalculator.deploy( ohm.address );
    const xyzDAOBondingCalculator = XYZDAOBondingCalculator.attach("0xBbe4C5919b33A404eDc5EAF292F2011F8D86ce3E");
    console.log( "Calc  Contract: " + xyzDAOBondingCalculator.address );
    
    // Deploy staking distributor
    const Distributor = await ethers.getContractFactory('Distributor');
    // const distributor = await Distributor.deploy(treasury.address, ohm.address, epochLengthInBlocks, firstEpochBlock);
    const distributor = Distributor.attach("0x29Df3d540292684b8889C10F1D86ef496c9862FB");
    console.log( "Distributor   Contract " + distributor.address);
    
    // Deploy sOHM
    const SOHM = await ethers.getContractFactory('sXYZDAO');
    // const sOHM = await SOHM.deploy();
    const sOHM = SOHM.attach("0xAE0D27b0619897F03e8f21Ea5bfbECbB206A3a1d");
    console.log( "sOHM  Contract: " + sOHM.address );
    
    // Deploy Staking
    const Staking = await ethers.getContractFactory('XYZDAOStaking');
    // const staking = await Staking.deploy( ohm.address, sOHM.address, epochLengthInBlocks, firstEpochNumber, firstEpochBlock );
    const staking = Staking.attach("0x66E9cB939990e0046f7Ed919ec462F3036b12B86");
    console.log( "Staking   Contract: " + staking.address );
    
    // Deploy staking warmpup
    const StakingWarmpup = await ethers.getContractFactory('StakingWarmup');
    // const stakingWarmup = await StakingWarmpup.deploy(staking.address, sOHM.address);
    const stakingWarmup = StakingWarmpup.attach("0x079b00e33d565ee4762DC636202B681b37f70F13");
    console.log( "Staking Wawrmup   Contract " + stakingWarmup.address);
    
    // Deploy staking helper
    const StakingHelper = await ethers.getContractFactory('StakingHelper');
    // const stakingHelper = await StakingHelper.deploy(staking.address, ohm.address);
    const stakingHelper = StakingHelper.attach("0x652c9551165ABBCc48c0670d57e248eD13d890d7");
    console.log( "Staking Helper   Contract " + stakingHelper.address);
   
    
    // Deploy DAI bond
    //@dev changed function call to Treasury of 'valueOf' to 'valueOfToken' in BondDepository due to change in Treausry contract
    const DAIBond = await ethers.getContractFactory('XYZDAOBondDepository');
    // const daiBond = await DAIBond.deploy(ohm.address, dai.address, treasury.address, MockDAO.address, zeroAddress);
    // const daiBond = DAIBond.attach("0xEaB519dCF651EA8bC219eD937D3240F1745A457c"); // TRY3 file with 0x1E96E4BA3cAfdbdeEC6fa9E2B8E8232CC9d7d618 treasury
    const daiBond = DAIBond.attach("0x21F6457BF1C18CBaEb5E92D9469696B20D37fB23");
    console.log("DAI Bond   Contract: " + daiBond.address);
    
    // Deploy Frax bond
    //@dev changed function call to Treasury of 'valueOf' to 'valueOfToken' in BondDepository due to change in Treausry contract
    const FraxBond = await ethers.getContractFactory('XYZDAOBondDepository');
    // const fraxBond = await FraxBond.deploy(ohm.address, frax.address, treasury.address, MockDAO.address, zeroAddress);
    // const fraxBond = FraxBond.attach("0x709D2e1f3EA8e057642E1Ba920B070f46104d0A1"); //TRY3 file with 0x1E96E4BA3cAfdbdeEC6fa9E2B8E8232CC9d7d618 treasury
    const fraxBond = FraxBond.attach("0xBFdc38F89BbeC26A2FEE525699BCd58511672938");
    console.log("Frax Bond  Contract: " + fraxBond.address);
    
    
    // queue and toggle DAI and Frax bond reserve depositor
    
    // await treasury.queue('0', daiBond.address);
    // await treasury.queue('0', fraxBond.address);
    // await treasury.toggle('0', daiBond.address, zeroAddress);  // Done checked
    // await treasury.toggle('0', fraxBond.address, zeroAddress); // Done Checked
    
    console.log("Queue - Toggle Bond");
    
    // Set DAI and Frax bond terms
    
    // await daiBond.initializeBondTerms(daiBondBCV, bondVestingLength, minBondPrice, maxBondPayout, bondFee, maxBondDebt, intialBondDebt);
    // await fraxBond.initializeBondTerms(fraxBondBCV, bondVestingLength, minBondPrice, maxBondPayout, bondFee, maxBondDebt, intialBondDebt);
    console.log("initializeBondTerms ");
    
    // Set staking for DAI and Frax bond
    
    // await daiBond.setStaking(staking.address, stakingHelper.address);
    // await fraxBond.setStaking(staking.address, stakingHelper.address);
    console.log("Bonds Set Staking");
    
    // Initialize sOHM and set the index
    
    // await sOHM.initialize(staking.address);
    // await sOHM.setIndex(initialIndex);
    console.log("Staked MUSH Init");
    
    // set distributor contract and warmup contract
    
    // await staking.setContract('0', distributor.address);
    // await staking.setContract('1', stakingWarmup.address);
    console.log("Staking Set Contract");
   
    // Set treasury for OHM token
    
    // await ohm.setVault(treasury.address);
    console.log("OHM SetVault");
    

    // Add staking contract as distributor recipient
    
    // await distributor.addRecipient(staking.address, initialRewardRate);
    
    console.log("Distributor addRecipient");
    
    // queue and toggle reward manager
    
    // await treasury.queue('8', distributor.address);
    // await treasury.toggle('8', distributor.address, zeroAddress);  // Done checked
    console.log("Treasury Queue - Toggle Distributor");
    
    // queue and toggle deployer reserve depositor
    
    // await treasury.queue('0', deployer.address);
    // await treasury.toggle('0', deployer.address, zeroAddress);   // Done checked
    console.log("Treasury Queue - Toggle Token depositor");
    
    // queue and toggle liquidity depositor
    
    // await treasury.queue('4', deployer.address, );
    // await treasury.toggle('4', deployer.address, zeroAddress);   // Done checked
    console.log("Treasury Queue - Toggle Liquid depositor");
    
    // Approve the treasury to spend DAI and Frax
    
    // await dai.approve(treasury.address, largeApproval );
    // await frax.approve(treasury.address, largeApproval );
    console.log("Approve Stable Coin for Treasury");
    
    // Approve dai and frax bonds to spend deployer's DAI and Frax
    
    // await dai.approve(daiBond.address, largeApproval );
    // await frax.approve(fraxBond.address, largeApproval );
    console.log("Approve Stable Coin for Bond");
    
    // Approve staking and staking helper contact to spend deployer's OHM
    
    // await ohm.approve(staking.address, largeApproval);
    // await ohm.approve(stakingHelper.address, largeApproval);
    console.log("Approve XYZ Token");
   
    // Deposit 9,000,000 DAI to treasury, 600,000 OHM gets minted to deployer and 8,400,000 are in treasury as excesss reserves
    
    // await treasury.deposit('9000000000000000000000000', dai.address, '8400000000000000');
    console.log("jay 1");
    
    // Deposit 5,000,000 Frax to treasury, all is profit and goes as excess reserves
    
    // await treasury.deposit('5000000000000000000000000', frax.address, '5000000000000000');
    console.log("jay 2");
   
    // Stake OHM through helper
    
    // await stakingHelper.stake('100000000000');
    console.log("jay 3");

   
    
    // Bond 1,000 OHM and Frax in each of their bonds
    
    // await daiBond.deposit('1000000000000000000000', '60000', deployer.address );
    // await fraxBond.deposit('1000000000000000000000', '60000', deployer.address );
    console.log("Bind Deposit");
    
    // UnStack Call
    await staking.unstake('50000000000',false);
    console.log("jay unstack done");
    // return;
    // return;
    console.log( "OHM: " + ohm.address );
    console.log( "DAI: " + dai.address );
    console.log( "Frax: " + frax.address );
    console.log( "Treasury: " + treasury.address );
    console.log( "Calc: " + xyzDAOBondingCalculator.address );
    console.log( "Staking: " + staking.address );
    console.log( "sOHM: " + sOHM.address );
    console.log( "Distributor " + distributor.address);
    console.log( "Staking Wawrmup " + stakingWarmup.address);
    console.log( "Staking Helper " + stakingHelper.address);
    console.log("DAI Bond: " + daiBond.address);
    console.log("Frax Bond: " + fraxBond.address);
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})