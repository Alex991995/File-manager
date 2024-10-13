import { 
  stdin as input, 
  stdout as output, 
  argv , chdir } from 'node:process';
import * as readline from 'node:readline/promises';


import displayCurrentDir from './displayCurrentDir.js';
import getAllInDirectory from './getAllInDirectory.js';
import isExist from './isExist.js';
import { createReadStream, createWriteStream } from 'node:fs';
import { writeFile, rename, copyFile, constants } from 'node:fs/promises';
import isExtname from './isExtname.js';
import { join } from 'node:path';


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
    const isFolder = !isExtname(newDir)
    if(isFolder){
      chdir(newDir)
      input.write(`\nYou are currently in directory ${displayCurrentDir()}\n`)
    }
    else input.write('\nOperation failed\n')
  }

  // Read file and print it's content in console 
  else if((/cat\s\w+/).test(data) ) {
    const newDir = await isExist(data.slice(4))
    const isFile = isExtname(newDir)
    if(isFile){
      console.log(isFile)
      let readableStream = createReadStream(newDir, 'utf8');
      readableStream.on('data', chunk => {
        input.write(`\nYou are currently in directory ${displayCurrentDir()}\n`)
      })
    }
    else{
      input.write('\nOperation failed\n')
    }
  }
  else if( (/add\s\w+/).test(data) ){
    const currentDir = join(displayCurrentDir(), data.slice(4))
    const content = 'some text'
    try{
      await writeFile(currentDir, content, {flag: 'ax'})
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

    } catch {
      input.write('\nOperation failed\n')
    }
  }
  else if( data.startsWith('cp')) {
    const [ pref, srcFile, destFile ] = data.split(' ')
    
    const pathSrcFile = join(displayCurrentDir(), srcFile)
    const pathDestFile = join(displayCurrentDir(), destFile)

    const readableStream = createReadStream(pathSrcFile, 'utf-8')
    const writeableStream = createWriteStream(destFile);
   
    if( await isExist(pathSrcFile) && !(await isExist(pathDestFile)) ){
      readableStream.pipe(writeableStream)
    } 
    else {
      input.write('\nOperation failed\n')
    }
  }



  else input.write('\nOperation failed\n')
}

rl.on('line', main)

rl.on('SIGINT', () => {
  console.log(`\nThank you for using File Manager, ${userName} goodbye!`)
  rl.close()
})

