const EventTicketNFT = artifacts.require("EventTicketNFT.sol");

module.exports = function (deployer) {
  
  deployer.deploy(EventTicketNFT,"CONFERENCE","NFTC","NFT Conference","https://ipfs.infura.io/ipfs/QmRdpJFLt3XAzezRMGB4PMuqUveLiMqJaEgaXesZ8p8eRn","1","2");

};


