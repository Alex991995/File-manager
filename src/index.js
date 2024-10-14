import { 
  stdin as input, 
  stdout as output, 
  argv , chdir } from 'node:process';
import * as readline from 'node:readline/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { writeFile, rename, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

import displayCurrentDir from './displayCurrentDir.js';
import getAllInDirectory from './getAllInDirectory.js';
import isExist from './isExist.js';
import isExtname from './isExtname.js';
import { osFunction } from './osModule.js';
import { compressFunction } from './compressFunction.js';
import { decompressFunction } from './decompressFunction.js';


const rl = readline.createInterface({ input, output });
const argvCLI = argv.slice(2)
const userName = argvCLI.join('').split(/[--=]/).slice(-1).join('')

input.write(`Welcome to the File Manager, ${userName}!\n\n`)
input.write(`You are currently in directory ${displayCurrentDir()}\n`)


async function main(data) {
  
  if( data === 'up' || data === '..') {
    chdir('..');
    input.write(`\nYou are currently in directory ${displayCurrentDir()}\n`)
  }

  else if(data === 'ls') {
    const res = await getAllInDirectory()
    console.table(res)
    input.write(`\nYou are currently in directory ${displayCurrentDir()}\n`)
  }

  else if( (/cd\s\w+/).test(data) ) {
    const newDir = await isExist(data.slice(3))
    const isFolder = !isExtname(data.slice(3))
    if(isFolder && newDir){
      chdir(newDir)
      input.write(`\nYou are currently in directory ${displayCurrentDir()}\n`)
    }
    else input.write('\nOperation failed\n')
  }

  else if((/cat\s\w+/).test(data) ) {
    const newDir = await isExist(data.slice(4))
    const isFile = isExtname(data.slice(4))

    if(isFile && newDir){
      let readableStream = createReadStream(newDir, 'utf8');
      readableStream.on('data', chunk => {
        console.log(chunk)
        input.write(`\nYou are currently in directory ${displayCurrentDir()}\n`)
      })
    }
    else{
      input.write('\nOperation failed\n')
    }
  }
  else if( (/add\s\w+/).test(data) ){
    const currentDir = join(displayCurrentDir(), data.slice(4))
    try{
      await writeFile(currentDir, '', {flag: 'ax'})
      input.write(`\nYou are currently in directory ${displayCurrentDir()}\n`)
    }
    catch{
      input.write('\nOperation failed\n')
    }
  }
  else if((/rn\s\w+/).test(data) ) {
    const [ pref, oldFile, newFile ] = data.split(' ')
    const pathToOldFile = join(displayCurrentDir(), oldFile)
    const pathToNewFile = join(displayCurrentDir(), newFile)
    try {
      await isExist(pathToOldFile)
      await rename(pathToOldFile, pathToNewFile)
      input.write(`\nYou are currently in directory ${displayCurrentDir()}\n`)
    } catch {
      input.write('\nOperation failed\n')
    }
  }
  else if( data.startsWith('cp')) {
    const [ pref, srcFile, destFile ] = data.split(' ')
    
    const pathSrcFile = join(displayCurrentDir(), srcFile)
    const pathDestFile = join(displayCurrentDir(), destFile, srcFile)
    const readableStream = createReadStream(pathSrcFile);

      readableStream.on("data", data => {
          if(pathSrcFile && pathDestFile){
            let writeableStream = createWriteStream(pathDestFile);
            writeableStream.on('error', err => console.log('Invalid input'))
            writeableStream.write(data)
          }
          input.write(`\nYou are currently in directory ${displayCurrentDir()}\n`)
      })
      readableStream.on("error", err => console.log('Invalid input'))
  }

  else if(data.startsWith('mv')) {
    const [ pref, srcFile, destFile ] = data.split(' ')
    
    const pathSrcFile = join(displayCurrentDir(), srcFile)
    const pathDestFile = join(displayCurrentDir(), destFile, srcFile)
    const readableStream = createReadStream(pathSrcFile);

      readableStream.on("data", async data => {
          if(pathSrcFile && pathDestFile){
            let writeableStream = createWriteStream(pathDestFile);
            writeableStream.on('error', err => console.log('Invalid input'))
            writeableStream.write(data)
          }
          await unlink(pathSrcFile)
          input.write(`\nYou are currently in directory ${displayCurrentDir()}\n`)
      })
      readableStream.on("error", err => console.log('Invalid input'))
  }

  else if(data.startsWith('rm')) {
    const [ pref, pathFile ] = data.split(' ')
      try {
        await unlink(pathFile)
        input.write(`\nYou are currently in directory ${displayCurrentDir()}\n`)
      } catch (error) {
        input.write('\nInvalid input\n')
      }
  }
  else if(data.startsWith('os')) {
    const [ pref, command ]  = data.split('--')
    const res = osFunction(command)
    if(!res) {
      input.write('\nInvalid input\n')
    }
    else{
      console.log(res)
      input.write(`\nYou are currently in directory ${displayCurrentDir()}\n`)
    }
    
  }

  else if(data.startsWith('hash')) {
    const [ pref, file ]  = data.split(' ')

    const pathSrcFile = join(displayCurrentDir(), file)
    const readableStream = createReadStream(pathSrcFile);
    const hash = createHash('sha256');

    readableStream.on('data', data => {
        hash.update(data);
        console.log(`${hash.digest('base64')}`);
        input.write(`\nYou are currently in directory ${displayCurrentDir()}\n`)
    })
    readableStream.on("error", () => input.write('\nInvalid input\n'))

  }

  else if(data.startsWith('compress')) {
    const [ pref, srcFile, destFile ] = data.split(' ')

    if(await isExist(srcFile) && await isExist(destFile) ) {
      const pathSrcFile = join(displayCurrentDir(), srcFile)
      const pathDestFile = join(displayCurrentDir(), destFile, srcFile)
      compressFunction(pathSrcFile, pathDestFile)
      input.write(`\nYou are currently in directory ${displayCurrentDir()}\n`)
    }
    else input.write('\nInvalid input\n')
    
  }

  else if(data.startsWith('decompress')) {
    const [ pref, srcFile, destFile ] = data.split(' ')

    if(await isExist(srcFile) && await isExist(destFile) ) {
      const pathSrcFile = join(displayCurrentDir(), srcFile)
      const pathDestFile = join(displayCurrentDir(), destFile, srcFile)
      decompressFunction(pathSrcFile, pathDestFile)
      input.write(`\nYou are currently in directory ${displayCurrentDir()}\n`)
    }
    else input.write('\nInvalid input\n')
    
  }

  else if(data.startsWith('.exit')) {
    console.log(`\nThank you for using File Manager, ${userName} goodbye!`)
    rl.close()
  }

  else input.write('\nInvalid input\n')
}

rl.on('line', main)

rl.on('SIGINT', () => {
  console.log(`\nThank you for using File Manager, ${userName} goodbye!`)
  rl.close()
})

