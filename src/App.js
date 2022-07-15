import './App.css';
import { create } from "ipfs-http-client";
import {Buffer} from 'buffer';
import {useState } from "react";
import data from "../build/contracts/EventTicketNFT.json";
Buffer.from('anything','base64');
const client = create('https://ipfs.infura.io:5001/api/v0');


const App = () => {
  
  const [file, setFile] = useState(null);
  const [urlArr, setUrlArr] = useState([]);
  const [account, setAccount] = useState(null)
  const [eventName, setName] = useState([]);
  const [desc, setDesc] = useState([]);
  const [symbol, setSymbol] = useState([]);
  const [total, setTotal] = useState([]);
  const [ticketPrice, setTicketPrice] = useState([]);

  // MetaMask Login/Connect
   const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
          
    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      await web3Handler()
    })
    
  }

//Retrive the event image file
  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      console.log("Buffer data: ", Buffer(reader.result));
      setFile(Buffer(reader.result));
    }

    e.preventDefault();  
  }

//Create NFT collection when submittting the form
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      //Upload the eventimage and get the URL 
      const created = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${created.path}`;
      console.log("Buffer data: ", url);
      setUrlArr(prev => [...prev, url]);  
      
      //Read the EventTicket json file
      var jsonFile = "./build/contracts/EventTicketNFT.json";
      
      //Get the ABI of EventTicket smart contract
      var ABI = data.abi;
      
      //Get the bytecode of EventTicket smart contract
      let bytecode = data.bytecode;
      
      //combine bytecode and the constructor parameter
      let payload = {
          data: bytecode,
          arguments : [ eventName,symbol,desc,url,total,ticketPrice ]
      }
      
      //Deploy the smart contract which required user approval in metamask
      const t = await window.ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: account,
                gasPrice: "0x6FC23AC00", // gas price 30000000000 Wei
                gas: "0x7A1200",  //gas limit 8000000
                data: bytecode + "00000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000c8000000000000000000000000000000000000000000000000000000000000000a434f4e464552454e43450000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044e46544300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e4e465420436f6e666572656e6365000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004a68747470733a2f2f697066732e696e667572612e696f2f697066732f516d5264704a464c743358417a657a524d474234504d75715576654c694d714a614567615865735a38703865526e00000000000000000000000000000000000000000000"
              },
            ],
          })  
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="App">
      <header >Event Creator</header>
      
      <div className="Wallet">
        <button onClick={web3Handler} variant="outline-light">Connect Wallet</button>
        <p>Connected account ={account}</p>
      </div>
       
      <div className="display1">
        {urlArr.length !== 0
        ? urlArr.map((el) => <img src={el} alt="nfts"/>)
        : <h3>Upload data</h3>}
      </div>
      <div className="main">
      <form onSubmit={handleSubmit}> 
          <label for="fname">Event name:  </label> <br></br>
          <input type="text" value={eventName} id="fname1" name="fname1" onChange={(e) => setName(e.target.value)}/>   <br></br><br></br>
          <label for="fname">Symbol:      </label>    <br></br>
          <input type="text" value={symbol} id="fname2" name="fname2" onChange={(e) => setSymbol(e.target.value)}/> <br></br><br></br>
          <label for="fname">Decription:  </label>    <br></br>   
          <textarea id="desc" value={desc} name="fname3" rows="4" cols="50" onChange={(e) => setDesc(e.target.value)}> </textarea><br></br><br></br>
          <label for="fname">Event Image: </label><br></br>
          <input type="file" onChange={retrieveFile}/><br></br><br></br>
          <label for="fname">Total No. of Tickets:  </label>    <br></br>   
          <input type="number" value={total} id="fname4" name="fname4" onChange={(e) => setTotal(e.target.value)}/> <br></br><br></br>
          <label for="fname">Ticket Price:  </label>    <br></br> 
          <input type="number" value={ticketPrice} id="fname4" name="fname4" onChange={(e) => setTicketPrice(e.target.value)}/> <br></br><br></br>
          <button type="submit" className="button">Submit</button>
       </form>
      </div>
  </div>
  )
}
export default App;
