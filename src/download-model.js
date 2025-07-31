import https from 'https';
import fs from 'fs';

const url = 'https://www.dropbox.com/scl/fi/xr24prgkhvqgin0gqkz4l/model.onnx?rlkey=kqnx19vlbbqz5hypxzuyxxbow&st=3kyuqn5e&dl=1';
const DEST_PATH = './model.onnx';

const file = fs.createWriteStream(DEST_PATH);

https.get(url, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to download. Status code: ${response.statusCode}`);
    return;
  }

  response.pipe(file);

  file.on('finish', () => {
    file.close(() => {
      console.log('✅ model.onnx downloaded successfully!');
    });
  });
}).on('error', (err) => {
  fs.unlink(DEST_PATH, () => {});
  console.error('Download error:', err.message);
});
