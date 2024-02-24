const AgeContrat = artifacts.require("AgeContrat");

module.exports = function (deployer, network, accounts) {
    const deployerAccount = accounts[1]; // Choisissez le compte que vous souhaitez utiliser

    deployer.deploy(AgeContrat, { from: deployerAccount });
};
