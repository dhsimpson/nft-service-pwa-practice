// pages/api/submit.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { IncomingForm, Fields, Files } from 'formidable';
import fs from 'fs';
import type { ImportCandidate } from 'ipfs-core-types/src/utils';
import { create } from 'ipfs-http-client'

const ipfs = create({ host: '127.0.0.1', port: 5001, protocol: 'http' });

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