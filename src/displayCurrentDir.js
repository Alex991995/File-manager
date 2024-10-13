import { homedir } from 'os';

export default function displayCurrentDir() {
  // return homedir()
  return process.cwd()
}