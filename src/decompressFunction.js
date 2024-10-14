import zlib from 'node:zlib';
import { createReadStream, createWriteStream } from 'node:fs';
import { join } from 'node:path';
const brotli = zlib.createBrotliDecompress();

export function decompressFunction(pathFile, pathDestination) {
  const arrPathFile = pathDestination.split('.')
  const [fileName, firstExtension ] = arrPathFile
  const stringFile = fileName+ '.'+ firstExtension


  const readStream = createReadStream(pathFile);
  const writeStream = createWriteStream(stringFile);

  readStream.on('error',  () => console.log('Operation failed') )
  readStream.pipe(brotli).pipe(writeStream);
}