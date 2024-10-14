import { EOL, homedir, cpus, userInfo } from 'node:os';
import { arch } from 'node:process';

export function osFunction(command) {
  if(command === "EOL"){
    return EOL
  }
  else if(command === 'cpus'){
    return JSON.stringify(cpus(), null, 2) 
  }
  else if(command === 'homedir'){
    return homedir()
  }
  else if(command === 'username'){
    return userInfo()
  }
  else if(command === 'architecture'){
    return arch
  }
  return undefined
}  