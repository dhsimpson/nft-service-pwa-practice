/* eslint-disable react-hooks/rules-of-hooks */
import Image from 'next/image';
import { Contract } from 'web3-eth-contract';
import useGetNftUrls from '@/hooks/useGetNftUrls';

export interface ShowNFTProps {
    contract: Contract | null;
    account: string | null;
}

export default function ShowNFT({ contract, account }: ShowNFTProps) {
    const { nftList } = useGetNftUrls({ contract, account });

    console.log('nftList')
    console.log(nftList)
    if (!account || !contract || nftList.length < 1) {
        return null;
    }
    return (
        <>
            <div>
                {nftList.map(url => <Image src={url} alt={url} key={url} width={300} height={300}/>)}
            </div>
        </>
        // <button onClick={()=>getUserNFTs(contract!)}>
        //     내 nft 로그찍기
        // </button>
    )
}