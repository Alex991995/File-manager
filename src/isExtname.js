import { extname } from 'path';

function isExtname(file) {
  if(extname(file)) return true
  else return false
}

export default isExtname;
