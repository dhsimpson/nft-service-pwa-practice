// pages/api/submit.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { IncomingForm, Fields, Files } from 'formidable';
import fs from 'fs';
import type { ImportCandidate } from 'ipfs-core-types/src/utils';
import { create } from 'ipfs-http-client'
import { IPFS_HOST, IPFS_PORT, IPFS_PROTOCOL } from '@/consts/env';

//C.F. ipfs 데스크탑은 포트가 변경되는 경우가 종종 발생함
const ipfs = create({ host: IPFS_HOST, port: Number.parseInt(IPFS_PORT ?? '8080'), protocol: IPFS_PROTOCOL });

async function parseFormData(req: NextApiRequest): Promise<{ fields: Fields; files: Files }> {
    return new Promise((resolve, reject) => {
        const form = new IncomingForm();
      
        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({ fields, files });
        });
  });
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

        const readStream = fs.createReadStream(image.filepath);

        const fileForIPFS: ImportCandidate = {
            path: image.originalFilename ?? '',
            content: readStream as unknown as AsyncIterable<Uint8Array>,
        };
        
        const {cid} = await ipfs.add(fileForIPFS);

        res.status(200).json({ success: true, CID: cid.toString() });
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