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
    const ohm = OHM.attach("0x01e86B5dC0075CaFa2f8189C05Be6f4eBF998A2e");    
    console.log( "OHM   Contract: " + ohm.address );

    // Deploy DAI
    const DAI = await ethers.getContractFactory('DAI');
    // const dai = await DAI.deploy( 4002 );
    const dai = DAI.attach("0x55ab32b79c6D6566b13C7cde7602d5716166fa1F");

    console.log( "DAI   Contract: " + dai.address );
    // Deploy Frax
    const Frax = await ethers.getContractFactory('FRAX');
    // const frax = await Frax.deploy( 4002 );
    const frax = Frax.attach("0x0FbD6F83A4EBd074f594C090073FFCf6227bF7e1");
    console.log( "Frax  Contract: " + frax.address );

    // Deploy 10,000,000 mock DAI and mock Frax
    // await dai.mint( deployer.address, initialMint );
    // await frax.mint( deployer.address, initialMint );
    console.log("Miniting Done");
    // Deploy treasury
    //@dev changed function in treaury from 'valueOf' to 'valueOfToken'... solidity function was coflicting w js object property name
    const Treasury = await ethers.getContractFactory('XYZDAOTreasury'); 
    // const treasury = await Treasury.deploy( ohm.address, dai.address, frax.address, 0 );
    const treasury = Treasury.attach("0xCD3C0ce76d0C6605698ed76EF58F602aA7856B1E");
    console.log( "Treasury  Contract: " + treasury.address );
    // Deploy bonding calc
    const XYZDAOBondingCalculator = await ethers.getContractFactory('XYZDAOBondingCalculator');
    // const xyzDAOBondingCalculator = await XYZDAOBondingCalculator.deploy( ohm.address );
    const xyzDAOBondingCalculator = XYZDAOBondingCalculator.attach("0x105b4827012BE2e43CC876B8A409761391C479Cc");
    console.log( "Calc  Contract: " + xyzDAOBondingCalculator.address );
    // Deploy staking distributor
    const Distributor = await ethers.getContractFactory('Distributor');
    // const distributor = await Distributor.deploy(treasury.address, ohm.address, epochLengthInBlocks, firstEpochBlock);
    const distributor = Distributor.attach("0xB486aA25E2043F8Efa093aBA6E7C48817D76b747");
    console.log( "Distributor   Contract " + distributor.address);
    // Deploy sOHM
    const SOHM = await ethers.getContractFactory('sXYZDAO');
    // const sOHM = await SOHM.deploy();
    const sOHM = SOHM.attach("0x58184a4307fA3475e30F0Ef66622D722583D8aAb");
    console.log( "sOHM  Contract: " + sOHM.address );
    // Deploy Staking
    const Staking = await ethers.getContractFactory('XYZDAOStaking');
    // const staking = await Staking.deploy( ohm.address, sOHM.address, epochLengthInBlocks, firstEpochNumber, firstEpochBlock );
    const staking = Staking.attach("0x00F4B3Cd2EEd8c37264a477A45ab7d18828C5AB9");
    console.log( "Staking   Contract: " + staking.address );
    // Deploy staking warmpup
    const StakingWarmpup = await ethers.getContractFactory('StakingWarmup');
    // const stakingWarmup = await StakingWarmpup.deploy(staking.address, sOHM.address);
    const stakingWarmup = StakingWarmpup.attach("0xb1e54E764479503Ddf614d514592DfA02F541A80");
    console.log( "Staking Wawrmup   Contract " + stakingWarmup.address);
    // Deploy staking helper
    const StakingHelper = await ethers.getContractFactory('StakingHelper');
    // const stakingHelper = await StakingHelper.deploy(staking.address, ohm.address);
    const stakingHelper = StakingHelper.attach("0xE7D25d78B904f83ee2c9384CB362D4FB237E9f5d");
    console.log( "Staking Helper   Contract " + stakingHelper.address);
    // Deploy DAI bond
    //@dev changed function call to Treasury of 'valueOf' to 'valueOfToken' in BondDepository due to change in Treausry contract
    const DAIBond = await ethers.getContractFactory('XYZDAOBondDepository');
    // const daiBond = await DAIBond.deploy(ohm.address, dai.address, treasury.address, MockDAO.address, zeroAddress);
    const daiBond = DAIBond.attach("0x37D6300F6cb1Db7eAfc16A97674214DA6aFe3953");
    console.log("DAI Bond   Contract: " + daiBond.address);
    // Deploy Frax bond
    //@dev changed function call to Treasury of 'valueOf' to 'valueOfToken' in BondDepository due to change in Treausry contract
    const FraxBond = await ethers.getContractFactory('XYZDAOBondDepository');
    // const fraxBond = await FraxBond.deploy(ohm.address, frax.address, treasury.address, MockDAO.address, zeroAddress);
    const fraxBond = FraxBond.attach("0xB0007414754Ba5C5f1d20e7F2FC27651B467a95C");
    console.log("Frax Bond  Contract: " + fraxBond.address);
    
    // queue and toggle DAI and Frax bond reserve depositor
    
    // await treasury.queue('0', daiBond.address);
    // await treasury.queue('0', fraxBond.address);
    // await treasury.toggle('0', daiBond.address, zeroAddress);
    // await treasury.toggle('0', fraxBond.address, zeroAddress);
    
    console.log("Queue - Toggle Bond");
    
    // Set DAI and Frax bond terms
    
    // await daiBond.initializeBondTerms(daiBondBCV, bondVestingLength, minBondPrice, maxBondPayout, bondFee, maxBondDebt, intialBondDebt);
    // await fraxBond.initializeBondTerms(fraxBondBCV, bondVestingLength, minBondPrice, maxBondPayout, bondFee, maxBondDebt, intialBondDebt);

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

    // Add staking contract as distributor recipient
    
    // await distributor.addRecipient(staking.address, initialRewardRate);
    
    console.log("Distributor addRecipient");
    
    // queue and toggle reward manager
    
    // await treasury.queue('8', distributor.address);
    // await treasury.toggle('8', distributor.address, zeroAddress);
    console.log("Treasury Queue - Toggle Distributor");
    
    // queue and toggle deployer reserve depositor
    
    // await treasury.queue('0', deployer.address);
    // await treasury.toggle('0', deployer.address, zeroAddress);
    console.log("Treasury Queue - Toggle Token depositor");
    
    // queue and toggle liquidity depositor
    
    // await treasury.queue('4', deployer.address, );
    // await treasury.toggle('4', deployer.address, zeroAddress);
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

    // UnStack Call
    await staking.unstake('50000000000',false);
    console.log("jay unstack done");
    
    // Bond 1,000 OHM and Frax in each of their bonds
    
    // await daiBond.deposit('1000000000000000000000', '60000', deployer.address );
    // await fraxBond.deposit('1000000000000000000000', '60000', deployer.address );

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