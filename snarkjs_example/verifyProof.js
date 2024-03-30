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
        "internalType": "uint256[1]",
        "name": "_pubSignals",
        "type": "uint256[1]"
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

const newLocal = '0x608060405234801561001057600080fd5b506105f3806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c806343753b4d14610030575b600080fd5b61004a60048036038101906100459190610522565b610060565b6040516100579190610596565b60405180910390f35b600061048c565b7f30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd478110610098576000805260206000f35b50565b600060405183815284602082015285604082015260408160608360076107d05a03fa9150816100ce576000805260206000f35b825160408201526020830151606082015260408360808360066107d05a03fa9150816100fe576000805260206000f35b505050505050565b600060808601600087017f127f34112137066e136ec091db3b90b1aa7847d1c69caf0219d038cc6c78482381527f2661ae40fc60205a817b8408311e68fad17b0fad879a1fb9f355506b3ea503fa60208201526101a960008801357f0f62d9488bed1cef4c3bdb9bf1b2df7015935745e126b4539b2644b3204513267f264207ca5a35c714f061f0a438eddd04443715de1e2029f7598b5d1e9868f83f8461009b565b833582527f30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd4760208501357f30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd4703066020830152843560408301526020850135606083015260408501356080830152606085013560a08301527f2ab7a7156d315e48ed805049f38b78ae183947baeecb92dd88b3e2932a52c76660c08301527f1cc1cd064370b48dd9e4110c261e6a05b26cb7cbbf89a67bf92079695218fc6360e08301527f1ff21b3e37674546a19735c4ac0592bf7c448174b8e09f1f64743c2ce71e133e6101008301527f09922e8c8359fbb5e0d8ffc723240c7ae047468f87618dc085f350d155ae82b06101208301527f0745609e8a14fc9b960a3d6875ed025cbba80b484ecd4035f84ca9f9c51634636101408301527f1e59427e80393eed057642df1ff649c4f84f1f779ffff4cfa0639006c8d1ea9a610160830152600088015161018083015260206000018801516101a08301527f198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c26101c08301527f1800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed6101e08301527f090689d0585ff075ec9e99ad690c3395bc4b313370b38ef355acdadcd122975b6102008301527f12c85ea5db8c6deb4aab71808dcb408fe3d1e7690c43d37b4ce6cc0166fa7daa610220830152853561024083015260208601356102608301527f0d03cf42076409dee7e520d101af0fd7b2a5ca2215bc7a18df509a0a0ef7b2c56102808301527f2a824ca39a4d00e073828ffd840b48a29a436897d0dee4749c126358baa2ffd06102a08301527e502ee98c6b130e3d43feee0e83ade4f4ba52327a08ac213975ffe2fb426c0b6102c08301527f27851adb0e4f9a5b0b97dee1d41cbf11b441683b55f35fc5d4f89dfcc6f4f2e16102e08301526020826103008460086107d05a03fa82518116935050505095945050505050565b60405161038081016040526104a46000840135610067565b6104b16020840135610067565b6104be818486888a610106565b8060005260206000f35b6000819050826040600202820111156104e057600080fd5b92915050565b6000819050826020600102820111156104fe57600080fd5b92915050565b60008190508260206002028201111561051c57600080fd5b92915050565b600080600080610120858703121561053957600080fd5b600061054787828801610504565b9450506040610558878288016104c8565b93505060c061056987828801610504565b92505061010061057b878288016104e6565b91505092959194509250565b610590816105b1565b82525050565b60006020820190506105ab6000830184610587565b92915050565b6000811515905091905056fea264697066735822122092c2d16d9cf7401a812621370557258e90f7bf52a8c48d84673554e94eda958764736f6c63430008000033';
const contractBytecode = newLocal;

// Create a contract instance without bytecode
async function groth16Verify(r1csFilename, wtnsFilename) {
  accountNumber = '0x4c99A3D5D404C6f7F4Db4c39a564c1cC4691a241';
  try {
    const ptauFilename = path.join("./", "pot14_final.ptau");

    const zkeyFilename = { type: "mem" };
    // Generate Groth16 proof
    await snarkjs.zKey.newZKey(r1csFilename, ptauFilename, zkeyFilename);
    const { proof, publicSignals } = await snarkjs.groth16.prove(zkeyFilename, wtnsFilename);

    let data = `{ "proof": ${JSON.stringify(proof)}, "publicInput": ${JSON.stringify(publicSignals)} }`;
    console.log(data);

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

    // Generate Groth16 verifier solidity file
    //const templates = {}; // Assume you have loaded the templates
    //const verifierCode = await snarkjs.zKey.exportSolidityVerifier(zkeyFilename, templates);
   // fs.writeFileSync(solidityVerifierFilename, verifierCode, "utf-8");

 

    // Call the verification function on the smart contract
    const result = await deployedContract.methods.verifyProof(proofA, proofB, proofC, publicSignals).call({
      from: accountNumber,
      gas: '4700000', // Adjust the gas limit as needed
    });

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
