import { useState, useEffect } from "react";
import * as XLSX from 'xlsx';

interface DataFromExcel {
    address: string;
    phone: string;
    name: string;
}

export default function useUploadExcel() {

    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<DataFromExcel[]>([]);

    useEffect(() => {
        if (!excelFile) {
            return;
        }
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = e.target?.result;
            if (typeof data === 'string') {
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                const jsonData = XLSX.utils.sheet_to_json<DataFromExcel>(sheet);
                setParsedData(jsonData);
            }
        };

        reader.readAsBinaryString(excelFile);
    }, [excelFile]);

    return { parsedData, setExcelFile };
}