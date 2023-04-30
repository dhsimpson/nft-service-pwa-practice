import { SetStateAction, useState } from "react";
import { UseFormRegister, FieldValues, FieldErrors } from "react-hook-form";

// interface UploadExcelProps {
//     register: UseFormRegister<FieldValues>;
//     errors: FieldErrors<FieldValues>;
// }

export default function UploadExcel({ setExcelFile }: {setExcelFile: (value: SetStateAction<File | null>) => void}) {
    
    return (
        <>
            <label htmlFor="excel-file-upload">Upload Excel File: </label>
            <input type="file" id="excel-file-upload" accept=".xlsx, .xls" onChange={(event) => {
                if (!event.target.files?.length) {
                    return;
                }
                const excelFile = event.target.files[0];
                setExcelFile(excelFile);
            }} />
        </>
    )
}