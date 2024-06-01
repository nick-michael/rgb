// See the Electron documentation for details on how to use preload scripts:

import { Animation } from "./client/init"

// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  startAnimation: (animation: Animation) => ipcRenderer.send('start-animation', animation),
});
