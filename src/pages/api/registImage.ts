// pages/api/submit.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { IncomingForm, Fields, Files } from 'formidable';
import fs from 'fs';
import { IPFS_JWT } from '@/consts/env';
import axios from 'axios';

//C.F. ipfs 데스크탑은 포트가 변경되는 경우가 종종 발생함

async function parseFormData(req: NextApiRequest): Promise<{ fields: Fields; files: Files }> {
    return new Promise((resolve, reject) => {
        const form = new IncomingForm();
      
        form.parse(req, (err, fields, files) => {
            // console.log('files')
            // console.log(files)
            if (err) {
                reject(err);
                return;
            }
            resolve({ fields, files });
        });
  });
}
// Buffer 데이터를 읽어와서 Blob으로 변환합니다.
function bufferToBlob(buffer: any, mimeType: any) {
  const arrayBuffer = new Uint8Array(buffer).buffer;
  return new Blob([arrayBuffer], { type: mimeType });
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
        return;
    }
    try {
        const { files } = await parseFormData(req);
        const image = files.image as formidable.File;
        // const formData = new FormData();

          fs.readFile(image.filepath, async(err, data) => {
            if (err) {
            // 파일 읽기 에러 처리
            return;
            }

            // FormData 객체를 생성합니다.
            const formData = new FormData();

            const blobData = bufferToBlob(data, image.mimetype);

            // 파일 데이터를 FormData에 추가합니다.
            formData.append('file', blobData);

            // FormData를 사용하여 필요한 작업을 수행합니다.
            // ...

            // 파일 업로드 요청 등을 보냅니다.
            // ...

            const metadata = JSON.stringify({
                name: image.originalFilename,
            });
            formData.append('pinataMetadata', metadata);
            
            const options = JSON.stringify({
            cidVersion: 0,
            })
            formData.append('pinataOptions', options);

            const resIPFS = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                maxBodyLength: Infinity,
                headers: {
                'Content-Type': `multipart/form-data;`,
                Authorization: IPFS_JWT
                }
            });
                
            console.log('resIPFS')
              console.log(resIPFS.data.IpfsHash)
            res.status(200).json({ success: true, CID: resIPFS.data.IpfsHash });
              
        });
    } catch (e) {
        console.log('err')
        console.error(e)
        res.status(404);
    }
};

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};