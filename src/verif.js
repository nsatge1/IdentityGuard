const random = 4321;
document.getElementById('RandomNum').textContent = `Code : ${random}`;
    async function verifyData() {
        const contractAddress = document.getElementById('contractAddress').value;// Replace with your actual contract address
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
  ];

    const web3 = new Web3('http://localhost:8545'); // Assurez-vous que cela pointe vers votre réseau Ganache
    const contract = new web3.eth.Contract(contractABI, contractAddress);

        try {
            const test =  await contract.methods.verifyCode(random).call();
            console.log(test);
            if(test){
                const result = await contract.methods.getAge().call();
                document.getElementById('verificationResult').textContent = `La vérification est ${result}`;
            } else {
                document.getElementById('verificationResult').textContent = `Le code est incorrect`;
            }
            
        } catch (error) {
            console.error('Erreur lors de la vérification :', error);
        }
    }