// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


contract EventTicketNFT is ERC721URIStorage, ReentrancyGuard, Ownable {
    using SafeMath for uint;
    
    //State variables to store event details
    string public eventName;
    string public eventSymbol;
    string public description;
    string public eventURI;
    uint64 public ticketSupply;
    uint256 public ticketPrice;
    bool public saleEnd;
    address payable withdrawalAddress;

    //Ticketcount vaiable is used to maintain the number tickets sold
    uint ticketCount;

    //Set the event details when deploying the smart contract
    constructor(
        string memory _eventName, 
        string memory _eventSymbol,
        string memory _description,
        string memory _eventURI,
        uint64 _ticketSupply, 
        uint256 _ticketPrice
    ) ERC721(_eventName, _eventSymbol)
    {
        eventName = _eventName;
        eventSymbol = _eventSymbol;
        description = _description;
        eventURI = _eventURI;
        ticketSupply = _ticketSupply;
        ticketPrice = _ticketPrice;
        
        //Set saleend to false until total supply tickets sold
        saleEnd = false;
        
        //Set the withdraw address as deployer address
        withdrawalAddress = payable(msg.sender);
    }
    
    event BalanceWithdrawn(address _by, address _to, uint256 _amount);
    
    //Modifier to check the totalsypply tickets are sold
    modifier isOpen() {
        require (saleEnd == false , "All tickets Sold");
        _;
    } 

    //Payable fucntion to mint new ticket whenever user sends Ether this smart contrct address
    function buyEventTicket() 
    external 
    payable 
    isOpen
    nonReentrant 
    {  
         
        require((msg.value >= ticketPrice),"not enough money");
        //this fucntion sell one ticket per user - transfer the remaining ether to the sender itself
        if(msg.value > ticketPrice)
        {
            address payable senderAddress = payable(msg.sender);
            senderAddress.transfer(msg.value.sub(ticketPrice));
        }
        //increment the ticket count
        ticketCount ++;

        //Check still tickets are available - if not set the saleEnd to true
        uint tempCount = ticketCount + 1;
        if (tempCount > ticketSupply)
        {
             saleEnd = true;
        }

        //Mint the new ticket for the sender
        _safeMint(msg.sender, ticketCount);

        //Assign the eventURI to the minted ticket
        _setTokenURI(ticketCount, eventURI);
        
    }

    //Returns the status of Eventticket sale
    function getStatus() 
    public 
    view 
    returns (bool) 
    {
        return saleEnd;
    }
   
    //Event organizer who added the event can call this fucntion and withdraw the ether for the sold tickets
    function withdrawBalance() 
    public 
    onlyOwner 
    {
        uint256 _contractBalance = uint256(address(this).balance);
        withdrawalAddress.transfer(_contractBalance);
        emit BalanceWithdrawn(msg.sender,withdrawalAddress,_contractBalance);
    }

}