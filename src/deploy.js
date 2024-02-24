// Mettre c'est variable dans une base de donnée avec id prouveur
let addContract;
let accountNumber;


const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "age",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_age",
          "type": "uint256"
        }
      ],
      "name": "setAge",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_code",
          "type": "uint256"
        }
      ],
      "name": "setVerificationCode",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_code",
          "type": "uint256"
        }
      ],
      "name": "verifyCode",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAge",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
const contractBytecode = '0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555061045d806100606000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063262a9dff146100675780636ecca5b7146100855780638da5cb5b146100a1578063967e6e65146100bf578063bc1b8498146100dd578063d5dcf1271461010d575b600080fd5b61006f610129565b60405161007c919061039c565b60405180910390f35b61009f600480360381019061009a91906102b0565b61012f565b005b6100a96101c7565b6040516100b69190610346565b60405180910390f35b6100c76101eb565b6040516100d4919061039c565b60405180910390f35b6100f760048036038101906100f291906102b0565b6101f5565b6040516101049190610361565b60405180910390f35b610127600480360381019061012291906102b0565b610203565b005b60015481565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146101bd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101b49061037c565b60405180910390fd5b8060028190555050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600154905090565b600060025482149050919050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610291576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102889061037c565b60405180910390fd5b8060018190555050565b6000813590506102aa81610410565b92915050565b6000602082840312156102c257600080fd5b60006102d08482850161029b565b91505092915050565b6102e2816103c8565b82525050565b6102f1816103da565b82525050565b6000610304600d836103b7565b91507f4e6f7420746865206f776e6572000000000000000000000000000000000000006000830152602082019050919050565b61034081610406565b82525050565b600060208201905061035b60008301846102d9565b92915050565b600060208201905061037660008301846102e8565b92915050565b60006020820190508181036000830152610395816102f7565b9050919050565b60006020820190506103b16000830184610337565b92915050565b600082825260208201905092915050565b60006103d3826103e6565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b61041981610406565b811461042457600080fd5b5056fea2646970667358221220019fc171348e7d052ff2d8284ee0bef85f07188c668baf204cee9b7f1be4369564736f6c63430008000033';

const web3 = new Web3('http://localhost:8545');  // Mettez à jour avec le port Ganache



async function deployContract() {
    
    // Obtenez les valeurs des champs du formulaire
    accountNumber = document.getElementById('accountNumber').value;
    const age = document.getElementById('age').value;
    const securityNumber = document.getElementById('securityNumber').value;

    
    const contract = new web3.eth.Contract(contractABI);
    
    const deployedContract = await contract.deploy({
        data: contractBytecode,
    }).send({
        from: accountNumber,
        gas: '4700000', // Ajustez la limite de gaz selon les besoins
    });
    addContract = deployedContract.options.address;
    console.log('Contrat déployé à l\'adresse :', deployedContract.options.address);
    document.getElementById('AddressContract').textContent = `l'address du contract est ${deployedContract.options.address}`;

    // Modifier l'âge
    await deployedContract.methods.setAge(age).send({
        from: accountNumber,
    });

    // Modifier le code de sécurité
    await deployedContract.methods.setVerificationCode(securityNumber).send({
        from: accountNumber,
    });
}

async function setCode(){
    const contractAddress = addContract;
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const securityNumber = document.getElementById('securityNumber').value;
    await contract.methods.setVerificationCode(securityNumber).send({
        from: accountNumber,
    });
}
