console.log('preload js start :' + process.versions.node);

// 渲染进程向主进程通信 需要引入 ipcRenderer (本质就是消息订阅与发布)
const { contextBridge, ipcRenderer } = require('electron');

//保留的变量在window上
contextBridge.exposeInMainWorld('myAPI', {
  version: process.versions.node,
  saveFile: (data) => {
    //参数1 是 信道 参数2 是 发送的消息的内容
    //主进程需要订阅这个信道
    ipcRenderer.send('saveFile', data);
  },

  readFile: () => {
    return ipcRenderer.invoke('readFile');
  },

  //订阅主进程的消息
  getMessage: (callback) => {
    return ipcRenderer.on('send-message', callback);
  },
});
