import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import getTestAbi from '@/abi/TestNFT.json';
import { contractAddress, envName } from '@/consts/env';


const NFT_ABI = () => {
    console.log('process.env.CONTRACT_ADDRESS')
    console.log(contractAddress)
    console.log(envName)
    if (envName === 'dev') {
        return getTestAbi;
    }
    if (envName === 'staging') {
        return getTestAbi;
    }
    if (envName === 'prod') {
        return getTestAbi;
    }
    throw new Error("no env name!");
}

export default function useWallet() {
    const contractABI: any[] = NFT_ABI().abi;
    
    const [web3, setWeb3] = useState<Web3 | null>(null);
    const [contract, setContract] = useState<Contract | null>(null);
    const [account, setAccount] = useState<string | null>(null);

    const updateWallet = async () => {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
    }
    
    const initWeb3 = async () => {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        updateWallet();

        const nftContract = new web3Instance.eth.Contract(contractABI, contractAddress);
        setContract(nftContract);
    }

    useEffect(() => {
        if (window.ethereum) {
            initWeb3();
        }

        // 이더리움 지갑 주소 변경 이벤트를 감지하고, updateWalletAddress 함수를 호출
        window.ethereum.on('accountsChanged', updateWallet);

        // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거
        return () => {
            const removeListener = window.ethereum.removeListener || window.ethereum.off;
            if (removeListener) {
                removeListener('accountsChanged', updateWallet);
            }
        };
    }, []);

    return {
        web3, contract, account
    }
}