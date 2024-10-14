import zlib from 'node:zlib';
import { createReadStream, createWriteStream } from 'node:fs';
const brotli = zlib.createBrotliCompress();

export function compressFunction(pathFile, pathDestination) {
  const readStream = createReadStream(pathFile);
  const writeStream = createWriteStream(pathDestination+'.br');

  readStream.on('error',  () => console.log('Operation failed') )
  readStream.pipe(brotli).pipe(writeStream);
}