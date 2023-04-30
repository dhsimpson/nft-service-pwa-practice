import { MintFormProps } from "@/components/mint/MintForm";
import { validateEthereumAddress } from "@/components/mint/MintInput";
import axios from "axios";

interface MintProps extends MintFormProps{
    addressList: string[],
    image: File[]
}

export const mint = async ({ web3, contract, account, addressList, image }: MintProps) => {

    if (!addressList?.length || !image) {
        return;
    }
    
    addressList = addressList.filter(address => validateEthereumAddress(address));

    const formData = new FormData();
    formData.append('image', image[0]);
    const resData = await axios.post('/api/registImage', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (!resData.data.success) {
        return;
    }

    const cid = resData.data.CID;

    if (web3 && contract && account) {
        try {
            await contract.methods.mintBatch(addressList, cid).send({ from: account });
            console.log('NFT minted successfully!');
            alert('NFT minted successfully!');
        } catch (error) {
            console.error('Error minting NFT:', error);
            alert(`Error minting NFT: ${error}`, );

            //TODO : 실패시 ipfs 에서 이미지 삭제 로직 호출
        }
    }
}