
import React, { useState, useRef } from "react";
import { CSSProperties } from "react";
import './app.css';
import Table from './components/table/Table.tsx';
import Title from './components/title/Title.jsx';
import ContractTag from './components/contractTag/ContractTag.jsx';
import Main from "./components/Main/Main.tsx";
import { Address, createPublicClient, hexToNumber, http, publicActions, createWalletClient, decodeEventLog, walletActions, custom, decodeFunctionData, decodeFunctionResult, parseEther, formatEther } from 'viem';
import { mainnet } from 'viem/chains';
import ClipLoader from "react-spinners/ClipLoader";
import Feedback from "./components/feedback/Feedback.jsx";






function App() {



  const [color, setColor] = useState("#ffffff");



  const override: CSSProperties = {
    display: "block",
    margin: "10vh 0",
    borderColor: "red",


  };



  const div6Ref = useRef(null);


  const scrollToDiv = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };


  const handleScroll = () => {
    scrollToDiv(div6Ref)
  }




  

  const [resetFunc, setResetFunc] = useState(false)

  const handleChildAction = () => {
    // Do something when the child action is triggered
 
    triggerChildAction();
    
  };


  const triggerChildAction = () => {
    // Do something in the parent component
    setResetFunc(true);
  };









  const [dataFromChild, setDataFromChild] = useState(0);

  const handleDataFromChild = (data) => {
    // Do something with the data received from the child
    setDataFromChild(data);
    
  };


  return (


    <div className="app">


      <Title />






      <Main TOTAL1={dataFromChild} onClickFunc={handleScroll} onChildAction={handleChildAction} />








      <div style={dataFromChild === 0 ? { display: "none", width: "90%" } : { display: "flex", width: "88%" }} >
        <ContractTag />
      </div>


      <ClipLoader
        color={color}
        loading={dataFromChild === 0}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />



      <div style={dataFromChild === 0 ? { display: "none" } : { display: "flex" }} className="tableCont">

        <Table onDataFromChild={handleDataFromChild} resetFunction={resetFunc}/>





      </div>


      <div className="feedbackCont" ref={div6Ref} >


        <Feedback />



      </div>










    </div>

  );
}

export default App;
