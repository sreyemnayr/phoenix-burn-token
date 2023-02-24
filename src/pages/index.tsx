import Flames from '@/components/Flames';
import GabeText from '@/components/GabeText';
import NumericDisplay from '@/components/NumericDisplay';
import { CustomConnectButton } from '@/components/CustomConnectButton';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useAccount, useContract, useContractReads, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { RpcError } from 'wagmi';
import pbtABI from '@/data/pbtabi.json'

import {useEffect, useState} from "react";
import Image from 'next/image';

const Home: NextPage = () => {

  const { address, isConnected } = useAccount()

  const [phoenixes, setPhoenixes] = useState<number[]>([]);
  const [souls, setSouls] = useState(0);
  const [phoenixesToBurn, setPhoenixesToBurn] = useState<number[]>([])

  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const contract = {
    address: '0x5caf53fe97a0E2e1568FEAc340D78f7a5B3daD1a' as `0x${string}`,
    abi: pbtABI,
  }

  const clickPhoenix = (tokenId: number) => {
    if(phoenixesToBurn.includes(tokenId)){
      setPhoenixesToBurn((cur)=>cur.filter((tid)=>tid!==tokenId))
    } else {
      setPhoenixesToBurn((cur)=>([...cur, tokenId]))
    }
  }

  const { config } = usePrepareContractWrite({
    ...contract,
    functionName: 'returnToDust',
    args: [
        phoenixesToBurn
    ],
    onError(error: any) {
      console.log("ERRORING")
      console.log(JSON.stringify(error))
      console.log(error?.code)
      setErrorMessage(error?.code)
  },
  onSuccess(d) {
      console.log("SUCCESSING")
      console.log(d)
      setErrorMessage("")
  }
})


const [txHash, setTxHash] = useState<`0x${string}` | null>(null)

const {
    data:txData,
    write,
    isLoading:txIsLoading,
    isError:txIsError,
    error:txError,
    isSuccess:txIsSuccess,
} = useContractWrite({
    ...config,
    onSuccess(data) {
        setTxHash(data.hash)
    },
    onError(error) {
        setErrorMessage(error?.message)
    }
})

const { data: pendingTxData, status: txStatus} = useWaitForTransaction({
    hash: txData?.hash,
    onError(error) {
      console.log("ERROR")
        console.log(error)
        setErrorMessage(error.message)
    },
    onSuccess(data){
        setPhoenixesToBurn([])
        refetch?.()
    }
})

  const { data, isError, isLoading, refetch } = useContractReads({
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
      {
        ...contract,
        functionName: 'tokensOfOwner',
        args: [address]
      }
    ],
    enabled: isConnected,
  })

  useEffect(() => {
    
    if(data){
      console.log(data?.[0], data?.[1], data?.[2]);
      
        setPhoenixes(data?.[2] as number[] || [])
        setSouls(Number(data?.[1] || 0))
      

    }
    
    
  }, [data, address])

  return (
    <div className={styles.container}>
      <Head>
        <title>Hell</title>
        <meta
          name="description"
          content="Burn your Phoenix Burn Tokens for Perks"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        { isConnected ? (
          <>
        <div className="flex justify-between h-[30vh] w-full fixed top-10 left-0 p-2 px-10">
          <div className="flex flex-col ">
            <div className="flex flex-row justify-center">
            <NumericDisplay value={phoenixes.length} />
            {phoenixesToBurn.length > 0 && (
              <div className="h-[4vh] flex flex-row justify-around ml-3 text-flame-orange">
                <GabeText value="Minus" size="w-[2vh]" /><NumericDisplay value={phoenixesToBurn.length} size="ml-3 h-[6vh]" />
              </div>
            )}
            </div>
            <GabeText value={phoenixes.length === 1 ? "Phoenix": "Phoenixes"} size="h-[10vh] max-w-[40vw]" />
            <div className="flex justify-around flex-wrap max-w-[40vw]">
              {phoenixes.filter((p)=>!phoenixesToBurn.includes(p)).map((p) => (
                
                <button key={`phoenix_number_${p}`} onClick={()=>{clickPhoenix(p)}} >
                  <Image
                    src={`/img/flying_phoenix_small.gif`}
                    alt={`Phoenix Burn Token #${p}`}
                    unoptimized
                    height="65"
                    width="40"
                    className="glitchText"
                   />
                  
                  <NumericDisplay value={p} size="h-[3vh]" /></button>
                
              ))}
            </div>
          </div>
          <div className="grow text-center align-baseline flex justify-center">
            
          </div>
          <div className="flex flex-col ">
          <div className="flex flex-row justify-center">
            <NumericDisplay value={souls} />
            {phoenixesToBurn.length > 0 && (
              <div className="h-[4vh] flex flex-row justify-around ml-3 text-flame-orange">
                <GabeText value="Plus" size="w-[2vh] " /><NumericDisplay value={phoenixesToBurn.length} size="ml-3 h-[6vh]" />
              </div>
            )}
            </div>
            <GabeText value={souls === 1 ? "Soul": "Souls"} size="h-[10vh] max-w-[40vw]" />
            <div className="flex justify-around flex-wrap max-w-[40vw]">
              {phoenixesToBurn.map((p) => (
                
                <button key={`phoenix_to_burn_number_${p}`} onClick={()=>{clickPhoenix(p)}} className={'saturate-50'}>
                  <Image
                    src={`/img/burning_phoenix_small.gif`}
                    alt={`Phoenix Burn Token #${p}`}
                    unoptimized
                    height="65"
                    width="40"
                    className="glitchText" />
                  
                  <NumericDisplay value={p} size="h-[3vh]" /></button>
                
              ))}
            </div>
          </div>
          
        </div>
        <div className="col-span-3 w-full text-center flex flex-col justify-around absolute bottom-0 mb-[30vh]">
          {phoenixesToBurn.length > 0 && !(["loading", "error", "success"].includes(txStatus)) && (
            
              <button className="mx-auto align-baseline text-gabe-black hover:text-flame-yellow hover:stroke-flame-orange hover:stroke-2">
                <GabeText value="Burn" size="h-[20vh] text-center" />
              </button>
            )}
            {errorMessage !== "" && (
              <div className="z-999 bg-flame-yellow w-full text-2xl text-gabe-black">ERROR: {errorMessage}</div>
            )}
            {txStatus === 'loading' && (
              <>
              <Image
                    src={`/img/burning_phoenix_small.gif`}
                    alt={`Phoenix Burn Token`}
                    unoptimized
                    height="195"
                    width="120"
                    className="glitchText" />
              <div>Verifying Transaction <a href={`https://etherscan.io/tx/${txHash}`}>etherscan</a></div>
              </>
            )}
            {txStatus === 'success' && (
              <>
              <div>Burned! <a href={`https://etherscan.io/tx/${txHash}`}>etherscan</a></div>
              </>
            )}
          </div>
        </>
        
        ) : (
        <CustomConnectButton />
        )}

        
      </main>

      <footer className={styles.footer}>
      
        <a href="https://twitter.com/sreyemNayr" target="_blank" rel="noopener noreferrer">
          Made with ❤️ by Ryan Meyers 
        </a>
       
        <span className="text-flame-orange text-flame-orange-2 text-flame-pink text-flame-yellow text-flame-deep-red">

        </span>
      </footer>
      <div className="fixed bottom-1 right-1 z-999 ">
      { isConnected && (
        <CustomConnectButton />
       )}
       </div>
      <Flames />
    </div>
  );
};

export default Home;
