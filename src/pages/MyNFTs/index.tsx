import ShowNFT from "@/components/NFT/ShowNFT";
import useWallet from "@/hooks/useWallet";

export default function MyNFTs() {
    const { web3, contract, account }= useWallet();

    return <ShowNFT contract={contract} account={account} />
}