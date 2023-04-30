import axios from "axios";
import { useState, FormEvent, ChangeEvent, useEffect, useReducer } from "react";
import { useForm } from "react-hook-form";
import Web3 from "web3";
import { Contract } from 'web3-eth-contract';
import MintInput, { validateEthereumAddress } from "./MintInput";
import UploadImage from "./UploadImage";
import UploadExcel from "./UploadExcel";
import useUploadExcel from "@/hooks/useUploadExcel";
import { mint } from "@/utils/nft";

export interface MintFormProps {
    //todo : 이 녀석들은 전역 객체로 만들자
    web3: Web3 | null; 
    contract: Contract | null; 
    account: string | null;
}


export default function MintForm({ 
    web3,
    contract,
    account
}: MintFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const [listCount, setListCount] = useState(1);

    const { parsedData, setExcelFile } = useUploadExcel();
    const mergeAddressList = (addressList: string[]) => {
        const addressListFromExcel = parsedData.map(data => data.address);
        return [...addressListFromExcel, ...addressList];
    }
    return (
        <>
            <form onSubmit={handleSubmit(async ({ image, address: addressList }) => mint({
                web3, contract, account, addressList: mergeAddressList(addressList), image
            }))}>
                <UploadImage register={register} errors={errors} />
                <br />
                <UploadExcel setExcelFile={setExcelFile} />
                <ul>
                    {Array(listCount).fill(0).map((_, index) => <MintInput key={index} idx={index} register={register} />)}
                </ul>
                <button type="submit">MINT</button>
            </form>
            <button type="button" onClick={() => setListCount(listCount + 1)}>지갑주소 추가</button>
        </>
    )
}