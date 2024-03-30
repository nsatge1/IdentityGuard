const fs = require('fs');
const path = require('path');
const Web3 = require('web3');
const snarkjs = require('snarkjs');


// Connect to a local Ethereum node (replace with your actual provider)
const web3 = new Web3('http://localhost:8545');

// Replace with your deployed contract ABI
const contractABI = [
  {
    "inputs": [
      {
        "internalType": "uint256[2]",
        "name": "_pA",
        "type": "uint256[2]"
      },
      {
        "internalType": "uint256[2][2]",
        "name": "_pB",
        "type": "uint256[2][2]"
      },
      {
        "internalType": "uint256[2]",
        "name": "_pC",
        "type": "uint256[2]"
      },
      {
        "internalType": "uint256[2]",
        "name": "_pubSignals",
        "type": "uint256[2]"
      }
    ],
    "name": "verifyProof",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];

const newLocal = '0x608060405234801561001057600080fd5b50610631806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063f5c9d69e14610030575b600080fd5b61004a60048036038101906100459190610560565b610060565b60405161005791906105d4565b60405180910390f35b60006104db565b7f30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd478110610098576000805260206000f35b50565b600060405183815284602082015285604082015260408160608360076107d05a03fa9150816100ce576000805260206000f35b825160408201526020830151606082015260408360808360066107d05a03fa9150816100fe576000805260206000f35b505050505050565b600060808601600087017f24b39187b522368f4ac46cf7997b1a3a1d326535961a7d99cfea3d3551acb8fc81527f1700c135a4a4e654854d9ccebf8c02865c69617f239fc97e576b3a60b7c40cbd60208201526101a960008801357f1d1819e7ca5bb9d0a560bd1e87e8d0c2544c7c59a3b5b4245d40789fda5435b77f1e1e246c42681fee714d623f5ca4241897d1784d4f97a18db0dd4b72344e18c88461009b565b6101f960208801357f10fcf8e161bf5eecfb21489f7e8afbee8851a32fdbe55247d2e7885b8da2fe8b7f0518f16dff8c85c1b90c95f38b975cd97829d7127cfbe7fe42b389db4f6820518461009b565b833582527f30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd4760208501357f30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd4703066020830152843560408301526020850135606083015260408501356080830152606085013560a08301527f255b557061c059930079d874ab5503d8231b50e04a5017b7d3d0cc50dbf3652c60c08301527f286e4781ca0dab2915c76c68991e8c334385452fb54708adbf19ba7172fbbb9060e08301527e9a304852d995113f256e8f2da7adf3e34009a9620be2b3d79662d4197bbbf26101008301527f055ff5a049dab758fd11fc4737391c2035ed0b611ad64f1b1d4a395ee8c8eb476101208301527f0cc325dd37be68a55cfa7a44967b6131ac4f65a1bfae40487b58f5544987542f6101408301527f07fb20e7c222b0e9ed7774dc721c5e36c47e1d01e43964c5db592c230f73b271610160830152600088015161018083015260206000018801516101a08301527f198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c26101c08301527f1800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed6101e08301527f090689d0585ff075ec9e99ad690c3395bc4b313370b38ef355acdadcd122975b6102008301527f12c85ea5db8c6deb4aab71808dcb408fe3d1e7690c43d37b4ce6cc0166fa7daa610220830152853561024083015260208601356102608301527ee8eac7ec6e7f6932531c6f973d1f569f4931d03dbad013c0b9f363759088166102808301527f2e878925ed15af66ed37ff149896443c2d909971e1a356f6f7c0287ab8263d566102a08301527f05a0aebaa8e2f6fe9a9afa9ac40649ed29ed4e07447a9892a814a10ba0f0ddbc6102c08301527f1da2a88404c7213e4872e95e65f29a03fd832feb74a55dc011843f0700a0dbbb6102e08301526020826103008460086107d05a03fa82518116935050505095945050505050565b60405161038081016040526104f36000840135610067565b6105006020840135610067565b61050d6040840135610067565b61051a818486888a610106565b8060005260206000f35b60008190508260406002028201111561053c57600080fd5b92915050565b60008190508260206002028201111561055a57600080fd5b92915050565b600080600080610140858703121561057757600080fd5b600061058587828801610542565b945050604061059687828801610524565b93505060c06105a787828801610542565b9250506101006105b987828801610542565b91505092959194509250565b6105ce816105ef565b82525050565b60006020820190506105e960008301846105c5565b92915050565b6000811515905091905056fea264697066735822122045879d4e11d6e51a1da9e52b5104c32b324cf8fdb74b911d67c866fee9d93f0164736f6c63430008000033';
const contractBytecode = newLocal;

// Create a contract instance without bytecode
async function groth16Verify(r1csFilename, wtnsFilename) {
  accountNumber = '0x4c99A3D5D404C6f7F4Db4c39a564c1cC4691a241';
  try {
    const ptauFilename = path.join("./", "pot14_final.ptau");

    // Generate Groth16 proof

    const { proof, publicSignals } =
    await snarkjs.groth16.fullProve({ "age": "20", "rand": "1" }, "./circuit_js/circuit.wasm", "./circuit_final.zkey");

    const contractInstance = new web3.eth.Contract(contractABI);
    const deployedContract = await contractInstance.deploy({
      data: contractBytecode,
     }).send({
        from: accountNumber,
        gas: '4700000', // Ajustez la limite de gaz selon les besoins
    });


    const proofA = [proof.pi_a[0], proof.pi_a[1]];
    const proofB = [
      [proof.pi_b[0][1], proof.pi_b[0][0]],
      [proof.pi_b[1][1], proof.pi_b[1][0]],
    ];
    const proofC = [proof.pi_c[0], proof.pi_c[1]];


    const result = await deployedContract.methods.verifyProof(proofA, proofB, proofC, publicSignals).call({
      from: accountNumber,
      gas: '4700000', // Adjust the gas limit as needed
    });
    console.log(result);

    if (JSON.stringify(publicSignals).includes('0')) {
      console.log("There is at least one '0' in pbSignals.");//ajout de cette ligne pour indiquer s'il y a un '0' dans pbSignals
    } 

    // Perform assertions based on the verification result
    console.log('Verification Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Replace these with your actual file paths
const r1csFilename = './circuit.r1cs';
const wtnsFilename = './witness.wtns';

// Call the Groth16 verification function
groth16Verify(r1csFilename, wtnsFilename);
