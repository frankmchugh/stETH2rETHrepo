import React, { useEffect, useState } from 'react'
import "./table.css"
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';


import { ethers } from "ethers";
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { computePoolAddress } from '@uniswap/v3-sdk'
import {
  getMainnetProvider,

} from '../uniTest/libs/providers.ts'

import { formatEther } from 'viem';
import { CurrentConfig } from '../uniTest/libs/config.ts'
import { fromReadableAmount } from '../uniTest/libs/conversion.ts'
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'











const Table = ({ onDataFromChild, resetFunction }) => {






  const apiKey = process.env.REACT_APP_API_KEY;

  const [allTransactions, setAllTransactions] = useState<Array<Log>>([])
  const [rebateTotal, setRebateTotal] = useState(0)
  const [USDCquote, setUSDCquote] = useState<number>(0)
  const [newTransactions, setNewTransactions] = useState<Array<Log>>([]);



  function roundToTwoDecimalPlaces(number) {
    // Using the toFixed method to round to 2 decimal places
    return parseFloat(number.toFixed(2));
  }

  function roundToFiveDecimalPlaces(number) {
    // Using the toFixed method to round to 5 decimal places


    let newNum = Number(number)
    return parseFloat(newNum.toFixed(5));
  }







  function convertTimestampToDate(timestamp) {
    // Convert the timestamp to milliseconds and create a Date object
    var date = new Date(timestamp * 1000);

    let day;
    let month;

    // Get the day, month, and year
    day = date.getDate();
    month = date.getMonth() + 1; // Months are zero-based
    var year = date.getFullYear();

    // Add leading zeros if needed
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    // Format the date as "dd/mm/yyyy"
    var formattedDate = day + '/' + month + '/' + year;

    return formattedDate;
  }








  async function getDataFromApi(apiUrl) {
    try {
      // Using Axios to make the request
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Assuming the API response is an array of objects
      const data = await response.json();
      console.log("This is the response:", data);

      setNewTransactions(data);
      return data;
    } catch (error) {
      console.error('Error fetching data:', error.message);
      // You can handle errors based on your requirements
      return null;
    }
  }

  // Example usage:
  const apiFunction = async () => {


    const apiUrl = 'https://xrchz.net/rrlogs/';
    await getDataFromApi(apiUrl)
      .then(data => {
        if (data) {
          console.log('Data from the API:', data);
          // You can perform further operations with the data here

          setNewTransactions(data);
       
        } else {
          console.log('No data retrieved from the API.');
        }
      })
      .catch(error => console.error('Error:', error));


  }




  useEffect(() => {

  
      apiFunction();

  

  }, [resetFunction])

 




  useEffect(() => {

    if(resetFunction ===  true) {
      getEvents();

    }

  }, [newTransactions])




  const getQuoute = async () => {






    const currentPoolAddress = computePoolAddress({
      factoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
      tokenA: CurrentConfig.tokens.in,
      tokenB: CurrentConfig.tokens.out,
      fee: CurrentConfig.tokens.poolFee,
    })


    const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${apiKey}`)
    const poolContract = new ethers.Contract(
      currentPoolAddress,
      IUniswapV3PoolABI.abi,
      provider
    )



    const quoterContract = new ethers.Contract(
      '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
      Quoter.abi,
      getMainnetProvider()
    )


    const [token0, token1, fee, liquidity, slot0] = await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ])


    const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
      token0, token1, fee,
      fromReadableAmount(
        CurrentConfig.tokens.amountIn,
        CurrentConfig.tokens.in.decimals
      ).toString(),

      0
    )

    let formatted = Number(formatEther(quotedAmountOut));
    let newQuote = 1 / formatted;



    setUSDCquote(newQuote);


  }


  useEffect(() => {


    getQuoute();



  }, [])








  function getLastFiftyElements(arr) {
    // If the array has 50 or fewer elements, return the whole array
    if (arr.length <= 50) {
      return arr;
    }

    // If the array has more than 50 elements, return the last 50 elements
    return arr.slice(arr.length - 50);
  }



  useEffect(() => {

    if (USDCquote !== 0) {
      getEvents();
    }
  }, [USDCquote]);


  /*
  const getRebates = async (arr: Array<object>) => {
  
    let newArr: Array<object> = [];
  
    for (let log of arr) {
      try {
        const transaction = await client.getTransactionReceipt({
          hash: log.transactionHash
        });
  
  
        
        const block = await client.getBlock({
          blockHash: log.blockHash,
          includeTransactions: true
        })
  
        log["effectiveGasPrice"] = transaction.effectiveGasPrice;
        log["gasUsed"] = transaction.gasUsed;
        log["timestamp"] = block.timestamp
  
  
        if(log["eventName"] !== "Drain") {
  
        newArr.push(log)
  
  
        }
  
      } catch (e) {
  
  
        console.log(e)
  
  
        
  
     
  
      }
  
  
    
  
  
  
    }
  
  
    console.log("loop finished")
  
    return newArr;
  
  };*/



  interface Log {
    eventName: string
    txHash: string
    sender: string
    args: {
      ETH: string
      stETH: string
      rETH: string
    }
    gasPrice: string
    gasUsed: string
    timestamp: string

  }


  const getEvents = async () => {


    /*const logs = await client.getContractEvents({
      address: '0xfAaBbE302750635E3F918385a1aEb4A9eb45977a',
      abi: abi,
      fromBlock: 18198548n

    });

    const processedLogs = convertBigIntToJSON(logs);
    const decodedLogs = [];


    console.log("FIRST PART DONE")

    processedLogs.forEach(element => {
      const topics = decodeEventLog({
        abi: abi,
        data: element.data,
        topics: [...element.topics]
      })

    });
*/


    let newLogs = newTransactions;





    let total = 0;

    for (const log of newTransactions) {


      if (log["args"]["stETH"] !== "0") {

        console.log(log.gasUsed)

        let newNum = wei((230000 * Number(log.gasPrice)) - (Number(log.gasUsed) * Number(log.gasPrice))) * USDCquote;
        total = total + newNum;

      } else {

        let newNum = wei((117000 * Number(log.gasPrice)) - (Number(log.gasUsed) * Number(log.gasPrice))) * USDCquote;
        total = total + newNum;

      }

    }


    console.log(total);

    console.log("SECOND BIT DONE");



    setAllTransactions(getLastFiftyElements(newLogs.reverse()));
    setRebateTotal(total);
  }





  const sendDataToParent = () => {
    const data = 'Hello from the child!';
    // Invoke the callback with the data
  };

  useEffect(() => {



    console.log("This is the rebateTotal" + rebateTotal)


    if (rebateTotal !== 0) {

      onDataFromChild(rebateTotal);

    }



  }, [rebateTotal])





  function wei(number) {
    return number * Math.pow(10, -18);
  }


  return (
    <table className="containerForTable">

      <thead>
        <tr>



        
          <th>Ethereum</th>
          <th>stETH</th>
          <th>rETH </th>

          <th>Estimated Rebate</th>
          <th>Transaction Cost</th>

          <th>Date</th>
          <th>Sender</th>
          <th>Transaction Hash</th>


        </tr>
      </thead>
      <tbody>
        {allTransactions?.map((trans, index) => (


          <tr key={"row" + index}  >






           
            <td>{roundToFiveDecimalPlaces(wei(trans.args["ETH"]))}</td>
            <td>{trans.eventName === "Deposit" ? roundToFiveDecimalPlaces(wei(trans.args["stETH"])) : "N/A"}</td>
            <td >{trans.eventName === "Deposit" ? roundToFiveDecimalPlaces(wei(trans.args["rETH"])) : "N/A"}</td>


            {trans.args["stETH"] !== "0" ?
              (<td className="specialTD"> ${roundToTwoDecimalPlaces((wei((230000 * Number(trans.gasPrice)) - (Number(trans.gasUsed) * Number(trans.gasPrice)))) * USDCquote)} </td>) :
              (<td className="specialTD"> ${roundToTwoDecimalPlaces((wei((117000 * Number(trans.gasPrice)) - (Number(trans.gasUsed) * Number(trans.gasPrice)))) * USDCquote)} </td>)
            }

            <td>{roundToFiveDecimalPlaces(wei(Number(trans.gasPrice) * Number(trans.gasUsed)))}</td>

            <td>{convertTimestampToDate(trans.timestamp)}</td>
            <td className="link"><a href={`https://etherscan.io/address/${trans.sender}`}  rel="noreferrer"  target="_blank">{trans.sender}</a></td>
            <td className="link"><a href={`https://etherscan.io/tx/${trans.txHash}`}  rel="noreferrer" target="_blank">{trans.txHash}</a></td>
           
            


          </tr>


        ))}
      </tbody>
    </table>
  )
}

export default Table