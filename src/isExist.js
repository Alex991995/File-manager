import { stat } from 'fs/promises';
import { join } from 'path';
import displayCurrentDir from './displayCurrentDir.js';

async function isExist(fileOrFolder) {
  const currentDir = displayCurrentDir()
  const f = join(currentDir, fileOrFolder)
  try{
    await stat(f)
    return f
  }
  catch{
    return false
  }
}

export default isExist;