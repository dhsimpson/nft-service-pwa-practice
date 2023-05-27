import { useState } from "react";
import Web3 from "web3";

export default function usePopupMetamask({web3, account}: {web3: Web3 | null, account: string | null}) {
    const [metamaskMessage, setMetamaskMessage] = useState('');

    async function popupMetamask() {
          // MetaMask Provider API를 사용하여 MetaMask와 상호작용
        if (window.ethereum && web3 && account) {
            try {
                // MetaMask 계정 연결 요청
                // await window.ethereum.request({ method: 'eth_requestAccounts' });
                // const accounts = await window.ethereum.enable();
                const weiAmount = web3.utils.toWei('0.00000001', 'ether');

                // 트랜잭션 생성 및 전송
                const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [
                    {
                    from: account,
                    to: '0xFBE2e8B6074e4a984abFfAa89a8e0eEb82fd487C',
                    value: '0x' + weiAmount.toString(),
                    },
                ],
                });
                setMetamaskMessage('MetaMask 연결 완료');
                // 여기서부터 MetaMask와 상호작용할 수 있습니다.
            } catch (error) {
                console.error(error);
                setMetamaskMessage('error!!');
            }
        } else {
            setMetamaskMessage('MetaMask 를 설치해 주세요');
        }
    }

    return {metamaskMessage, popupMetamask}
}