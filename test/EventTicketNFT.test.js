const EventTicketNFT = artifacts.require('./EventTicketNFT.sol')

const chai = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-things'))
  .should()

var expect = chai.expect;

contract('EventTicketNFT', ([organizer, buyer1, buyer2]) => {
  let contract

  before(async () => {
    contract = await EventTicketNFT.deployed();
  })

  describe('deployment', async () => {
    
    it('deploys successfully', async () => {
      const address = contract.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
    

    it('has a name', async () => {
      const name = await contract.eventName()
      assert.equal(name, 'CONFERENCE')
    })

    it('has a symbol', async () => {
      const symbol = await contract.eventSymbol()
      assert.equal(symbol, 'NFTC')
    })
    it('has a desc', async () => {
        const desc = await contract.description()
        assert.equal(desc, 'NFT Conference')
      })
      it('has a uri', async () => {
        const uri = await contract.eventURI()
        assert.equal(uri, 'https://ipfs.infura.io/ipfs/QmRdpJFLt3XAzezRMGB4PMuqUveLiMqJaEgaXesZ8p8eRn')
      })
      it('has a total', async () => {
        const total = await contract.ticketSupply()
        assert.equal(total, 1)
      })
      it('has a price', async () => {
        const price = await contract.ticketPrice()
        assert.equal(price, 2)
      })
  })

  describe('NFT minting', async () => {

    it('Status', async () => {
        const status1 = await contract.getStatus() 
        assert.equal(status1, Boolean(false))
      })

    it('creates a new token', async () => {
        // Transfer extra ether to investor1's account for testing
        const n= 2;
        await web3.eth.sendTransaction({ from: buyer1, to: contract.address, value: n })
        const balance = await contract.balanceOf(buyer1)
        assert.equal(balance, 1)
      });

      it('balance', async () => {
        const b = await web3.eth.getBalance(contract.address)
        assert.equal(b, 2)
      })
  })

  describe('Withdraw', async () => {

    it('Withdraw Balance', async () => {
        const b1 = await web3.eth.getBalance(organizer)
        
        await contract.withdrawBalance() 
        const b2 = await web3.eth.getBalance(organizer)
        var total = b1+b2;
        assert.notEqual(b1, b2)
      })

   
  })
  


})