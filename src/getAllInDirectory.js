import displayCurrentDir from "./displayCurrentDir.js";
import { readdir } from 'fs/promises';
import isExtname from './isExtname.js';

async function getAllInDirectory() {
  const dir = displayCurrentDir()

  const allInDirectory = await readdir(dir)

  const allFiles = allInDirectory.filter(file => isExtname(file))
  const allFolders = allInDirectory.filter(file => !isExtname(file))

  const res = allFolders.concat(allFiles)

  const sortDir = res.map( (file ) => ({
    name: file,
    type: isExtname(file) ? 'file' : 'directory'
  }))

  return sortDir;

}

export default getAllInDirectory;