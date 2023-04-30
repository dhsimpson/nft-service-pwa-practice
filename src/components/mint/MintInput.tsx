import { Dispatch, SetStateAction, useState } from 'react';
import { FieldValues, UseFormRegister, useForm } from "react-hook-form";
// import { AddressItem } from "./MintForm";

export function validateEthereumAddress(address: string) {
    // Ethereum address format: 0x followed by 40 hexadecimal characters
    const regex = /^0x[a-fA-F0-9]{40}$/;
    return regex.test(address);
}
export default function MintInput(
        { register, idx }:
        { register: UseFormRegister<FieldValues>, idx: number}
) {
    const [validText, setValidText] = useState('');
    return (
        <>
            <div>
                <label htmlFor={`address${idx}`}>지갑주소</label>
                <input type="text" id={`address[${idx}]`} {...register(`address[${idx}]`)} onChange={(event) => {
                    const isValid = validateEthereumAddress(event.currentTarget.value);
                    setValidText(isValid ? '' : '올바른 지갑주소를 입력해 주세요.')
                }} />
                {validText && <p>{validText}</p>}
            </div>
            {/* <div>
                <label htmlFor={`phone_${idx}`}>전화번호</label>
                <input type="text" id={`phone_[${idx}]`} {...register(`phone_[${idx}]`)}/>
            </div>
            <div>
                <label htmlFor={`name_${idx}`}>이름 (?)</label>
                <input type="text" id={`name_[${idx}]`} {...register(`name_[${idx}]`)}/>
            </div> */}
        </>
    )
}