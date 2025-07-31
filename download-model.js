import https from 'https';
import fs from 'fs';

const FILE_ID = '10qIvh0dehhlTc5tg8DJZbF3Qt5LuCocg';
const DEST_PATH = './model.onnx';
const url = `https://drive.google.com/uc?export=download&id=${FILE_ID}`;

const file = fs.createWriteStream(DEST_PATH);

https.get(url, (response) => {
  // Google Drive sometimes sends a redirect for large files, handle it:
  if (response.headers.location) {
    https.get(response.headers.location, (redirectedResponse) => {
      redirectedResponse.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Downloaded model.onnx');
      });
    });
  } else {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Downloaded model.onnx');
    });
  }
}).on('error', (err) => {
  fs.unlink(DEST_PATH, () => {});
  console.error('Error downloading file:', err.message);
});
