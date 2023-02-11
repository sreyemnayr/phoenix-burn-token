import Flames from '@/components/Flames';
import GabeText from '@/components/GabeText';
import NumericDisplay from '@/components/NumericDisplay';
import { CustomConnectButton } from '@/components/CustomConnectButton';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useAccount, useContract, useContractReads } from 'wagmi'
import pbtABI from '@/data/pbtabi.json'

import {useEffect, useState} from "react";

const Home: NextPage = () => {

  const { address, isConnected } = useAccount()

  const [phoenixes, setPhoenixes] = useState(0);
  const [souls, setSouls] = useState(0);

  const contract = {
    address: '0x5caf53fe97a0E2e1568FEAc340D78f7a5B3daD1a',
    abi: pbtABI,
  }

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...contract,
        functionName: 'balanceOf',
        args: [address]
      },
      {
        ...contract,
        functionName: 'phoenixSoulBalance',
        args: [address]
      },
    ],
    enabled: isConnected,
  })

  useEffect(() => {
    console.log(data?.[0], data?.[1]);
    setPhoenixes(Number(data?.[0] || 0 ))
    setSouls(Number(data?.[1] || 0))
  }, [data])

  return (
    <div className={styles.container}>
      <Head>
        <title>Hell</title>
        <meta
          name="description"
          content="Generated by @rainbow-me/create-rainbowkit"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        { isConnected ? (
        <div className="flex justify-between h-[30vh] w-full fixed top-10 left-0 p-2 px-10">
          <div className="flex flex-col ">
            <NumericDisplay value={phoenixes} />
            <GabeText value={phoenixes === 1 ? "Phoenix": "Phoenixes"} />
          </div>
          <div className="grow"></div>
          <div className="flex flex-col ">
            <NumericDisplay value={souls} />
            <GabeText value={souls === 1 ? "Soul": "Souls"} />
          </div>
        </div>
        ) : (
        <CustomConnectButton />
        )}

        
      </main>

      <footer className={styles.footer}>
      
        <a href="https://twitter.com/sreyemNayr" target="_blank" rel="noopener noreferrer">
          Made with ❤️ by Ryan Meyers 
        </a>
       
        <span className="text-flame-orange text-flame-orange-2 text-flame-pink text-flame-yellow text-flame-deep-red"></span>
      </footer>
      <Flames />
    </div>
  );
};

export default Home;