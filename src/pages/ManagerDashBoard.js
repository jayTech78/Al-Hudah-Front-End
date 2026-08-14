import React from 'react'
import logo from '../logo-removebg-preview.png'
import Image from 'next/image'
import Link from "next/link";
import style from '../styles/SignUp.module.css'
import { useState } from 'react';
import ManagerNavBar from '@/Components/ParentNavBar';
import SideNav from '@/Components/SideNav';

const ManagerDashBoard = () => {
  const [show,setShow] = useState(false)
  return (
    <div>
     <ManagerNavBar></ManagerNavBar>
     <SideNav/>
    </div>
  );
}

export default ManagerDashBoard