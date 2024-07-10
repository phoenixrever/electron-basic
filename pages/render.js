const btn = document.getElementById('btn');
btn.onclick = () => {
  console.log(window);
  alert(window.myAPI.version);
};

// 进程间通信

//1 单向 渲染进程向主进程通信(向D盘写文件)
const input = document.getElementById('input');
const btn2 = document.getElementById('btn2');
btn2.onclick = () => {
  // 调用 preload 中的 saveFile 方法 通过ipcRenderer 向主进程发送消息
  myAPI.saveFile(input.value);
};

// 2 双向 主进程向渲染进程通信（读出D盘文件)
const btn3 = document.getElementById('btn3');

//注意 ipcRenderer.invoke 是个promise
btn3.onclick = async () => {
  const content = await myAPI.readFile();
  alert(content);
};

//获取主进程的消息
myAPI.getMessage((event, data) => {
  alert(data);
});
