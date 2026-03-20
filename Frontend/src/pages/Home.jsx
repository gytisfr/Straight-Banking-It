import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function Tracker() {

  const getToken = () => localStorage.getItem("token");

  return (
    <div>

    <div className="h-screen min-h-screen flex flex-row bg-slate-200">
      {/* left side */}
      <div id="left" className="w-1/5">
      <ul>
        <li>Dashboard</li>
        <li>Withdraw</li>
        <li>Deposit</li>
        <li>Make Payment</li>
      </ul>
      </div>

      {/* right side */}
      <div id="right" className="w-full bg-white  rounded-bl-4xl rounded-tl-4xl shadow-xl">

      </div>


      </div>
    
      {/* bottom divider thing */}
      <div className="w-full h-10 bg-slate-200">
      </div>

      </div>
  );
}
