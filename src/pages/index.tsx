import MintForm from '@/components/mint/MintForm';
import usePopupMetamask from '@/hooks/usePopupMetamask';
import useWallet from '@/hooks/useWallet';

export default function Home() {
    const { web3, contract, account } = useWallet();
    const { metamaskMessage, popupMetamask } = usePopupMetamask({web3, account});
    return (
        <div>
            <h2>nft mint service</h2> 
            <MintForm web3={web3} contract={contract} account={account} />
            <button onClick={popupMetamask}>Popup metamask</button>
            <p>{metamaskMessage}</p>
      </div>
  )
}
