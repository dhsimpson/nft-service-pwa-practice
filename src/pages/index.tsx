import MintForm from '@/components/mint/MintForm';
import useWallet from '@/hooks/useWallet';

export default function Home() {
    const { web3, contract, account }= useWallet();

    return (
        <div>
            <h2>nft mint service</h2> 
            <MintForm web3={web3} contract={contract} account={account} />
      </div>
  )
}
