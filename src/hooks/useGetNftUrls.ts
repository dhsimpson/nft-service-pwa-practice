import { ShowNFTProps } from "@/components/NFT/ShowNFT";
import { useState, useEffect } from "react";
import { Contract } from 'web3-eth-contract';

export default function useGetNftUrls({ contract, account }: ShowNFTProps) {
    const [nftList, setNftList] = useState<string[]>([]);

    useEffect(() => {
        const runAsync = async () => {
            if (contract && account) {
                const nfts = await getUserNFTs(contract, account);
                setNftList(nfts);
            }
        }
        runAsync();
    }, [contract, account]);

    type MyNFT = Contract;

    async function getUserNFTs(contractInstance: MyNFT, account: string): Promise<string[]> {//: Promise<string[]>
        const nftUrls: string[] = [];
        try {
            const nftAmount = await contractInstance.methods.getTotalAmount().call();
            for (let i = nftAmount - 1; i >= 0; i--) {
                const isTokenOwner = await contractInstance.methods.isTokenOwner(i, account).call();
                if (isTokenOwner) {
                    const uri = await contractInstance.methods.tokenURI(i).call();
                    nftUrls.push(uri);
                }
            } 
        } catch (e) {
            console.error('getUserNFTs error')
            console.error(e)
        }
        return nftUrls;
    }

    return { nftList };
}