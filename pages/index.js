import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Countdown from "react-countdown";
import {gsap} from "gsap";

//INTERNAL IMPORT
import { VotingContext } from "../context/Voter";
import Style from "../styles/index.module.css";
import Card from "../components/card/card";
import image from "../assets/creator1.png";

const index = () => {
  const {
    getNewCandidate,
    candidateArray,
    giveVote,
    checkIfWalletIsConnected,
    candidateLength,
    getAllVoterData,
    currentAccount,
    voterLength,
    getWinner,
    winner
  } = useContext(VotingContext);

  useEffect(() => {
    // getNewCandidate();
    // console.log(candidateArray);/
    checkIfWalletIsConnected();
    getAllVoterData();
  }, []);

  useEffect(() => {

    let ctx = gsap.context(() => {
       const tl = gsap.timeline({
       });
       tl.to("#winnerbutton",{scaleX:"1.2"},'b').to("#winnerbutton",{scaleY:"1.2",background:"white",color:"black"},'b');
       tl.pause();
       const button = document.querySelector("#winnercontainer");
       button.addEventListener("mouseenter",()=>{
        tl.play();
       });
       button.addEventListener("mouseleave",()=>{
        tl.reverse();
       })
    });
    return () => ctx.revert(); 
    
  }, []); // Added an empty dependency array here

  return (
    <div className={Style.home}>
      {currentAccount && (
        <div className={Style.winner}>
          <div className={Style.winner_info}>
            <div className={Style.candidate_list}>
              <p>
                No Candidate:<span>{candidateLength}</span>
              </p>
            </div>
            <div className={Style.candidate_list}>
              <p>
                Number of Voter:<span>{voterLength}</span>
              </p>
            </div>
          </div>
          <div className={Style.winner_message}>
            <small>
              <Countdown date={Date.now() + 10000000} />
            </small>
          </div>
        </div>
      )}

      {/* <Card candidateArray={candidateArray} giveVote={giveVote} /> */}
      <div id="winnercontainer" className={Style.winner_container} >
         <button id="winnerbutton" onClick={getWinner} className={Style.winner_button} >
            {winner?`${winner}`:<div>Find Current Winner</div>}
         </button>
      </div>
    </div>
  );
};

export default index;
