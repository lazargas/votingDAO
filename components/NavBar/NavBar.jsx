import React, { useState, useContext, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiFillLock, AiFillUnlock } from "react-icons/ai";

//INTERNAL IMPORT/
import { VotingContext } from "../../context/Voter";
import Style from "./NavBar.module.css";
import loding from "../../assets/votesafe.png";
import { gsap } from "gsap";
import MetaMaskConnector from "../Metamask/Metamask";
import MetaMaskLogout from "../Metamask/MetamaskLogout";

const NavBar = () => {
  const { connectWallet, error, currentAccount} = useContext(VotingContext);
  const [openNav, setOpenNav] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState(null);
  const drawerRef = useRef(null);

  const openNaviagtion = () => {
    if (openNav) {
      setOpenNav(false);
    } else if (!openNav) {
      setOpenNav(true);
    }
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        "#drawer",
        { scaleY: "0", transformOrigin: "top" },
        { scaleY: 1 }
      );
      const opening = document.querySelector("#drawer");
      window.onload=function(){
        opening.addEventListener("click", () => {
          tl.play();
        });
      } 
    });
    return () => ctx.revert();
  },[]);

  return (
    <div className={Style.navbar}>
      {error === "" ? (
        ""
      ) : (
        <div className={Style.message__Box}>
          <div style={Style.message}>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className={Style.navbar_box}>
        <div className={Style.title}>
          <Link href={{ pathname: "/" }}>
            <Image src={loding} alt="logo" width={150} height={60} />
          </Link>
        </div>
        <div className={Style.connect}>
          {currentAccount ? (
            <div>
              <div className={Style.connect_flex}>
                <button id="navbutton" onClick={() => openNaviagtion()}>
                  {currentAccount.slice(0, 10)}..
                </button>
                {currentAccount && (
                  <span>
                    {openNav ? (
                      <AiFillUnlock onClick={() => openNaviagtion()} />
                    ) : (
                      <AiFillLock onClick={() => openNaviagtion()} />
                    )}
                  </span>
                )}
              </div>

              {openNav && (
                <div ref={drawerRef} className={Style.navigation}>
                  <p>
                    <Link href={{ pathname: "/" }}>
                    <button>Home</button>
                    </Link>
                  </p>

                  <p>
                    <Link href={{ pathname: "candidate-regisration" }}>
                    <button>Registration</button>
                    </Link>
                  </p>
                  <p>
                    <Link href={{ pathname: "allowed-voters" }}>
                    <button>Voter Registration</button>
                    </Link>
                  </p>

                  <p>
                    <Link href={{ pathname: "voterList" }}><button>Voter List</button></Link>
                  </p>

                  <p>
                    <Link href={{ pathname: "voterList" }}><MetaMaskLogout/></Link>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => {connectWallet();}}>
            <MetaMaskConnector setConnectedAddress={setConnectedAddress} />
            {connectedAddress ? (
        <p>Connected Address: {connectedAddress}</p>
      ) : (
        <p>Not Connected</p>
      )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
