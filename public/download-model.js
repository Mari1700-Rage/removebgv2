import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { pipeline } from 'stream';
import { promisify } from 'util';

const streamPipeline = promisify(pipeline);

const FILE_ID = '10qIvh0dehhlTc5tg8DJZbF3Qt5LuCocg';
const baseUrl = 'https://drive.google.com/uc?export=download';
const destPath = path.join(process.cwd(), 'public', 'model.onnx');

async function downloadFile() {
  console.log('⏳ Fetching confirmation token from Google Drive...');
  const initialRes = await fetch(`${baseUrl}&id=${FILE_ID}`, { method: 'GET' });
  const html = await initialRes.text();

  const confirmMatch = html.match(/confirm=([0-9A-Za-z_]+)&amp;id=/);
  if (!confirmMatch) {
    throw new Error('❌ Could not find confirmation token. Google may have changed the page format.');
  }

  const confirmToken = confirmMatch[1];
  const finalUrl = `${baseUrl}&confirm=${confirmToken}&id=${FILE_ID}`;

  console.log('⬇️ Downloading model.onnx...');

  const downloadRes = await fetch(finalUrl);
  if (!downloadRes.ok) throw new Error(`Download failed: ${downloadRes.statusText}`);

  await streamPipeline(downloadRes.body, fs.createWriteStream(destPath));
  console.log('✅ model.onnx downloaded to public/');
}

downloadFile().catch(err => {
  console.error('Download failed:', err.message);
});
