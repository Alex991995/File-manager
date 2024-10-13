import { extname } from 'path';

function isExtname(f) {
  if(extname(f)) return true
  else return false
}

export default isExtname;
