//app 小写直接就是对象，直接能用  BrowserWindow 是个构造函数（类） 需要new
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function writeFile(event, data) {
  console.log(event);
  console.log(data);

  fs.writeFileSync('D:/hello.txt', data, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

function createWindow() {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true, // 隐藏菜单栏 更多配置 见 https://www.electronjs.org/zh/docs/latest/api/base-window
    webPreferences: {
      preload: path.resolve(__dirname, './preload.js'), //必须写绝对路径
    },
  });
  //loadFile 之前订阅渲染进程的消息 订阅saveFile信道
  ipcMain.on('saveFile', writeFile);

  ipcMain.handle('readFile', () => {
    console.log(fs.readFileSync('D:/hello.txt').toString('utf-8'));
    return fs.readFileSync('D:/hello.txt').toString('utf-8');
  });

  win.loadFile('pages/index.html');

  setTimeout(() => {
    win.webContents.send('send-message', 'Hello from main process');
  }, 3000);
}

app.on('ready', () => {
  createWindow();

  //macOS 应用通常即使在没有打开任何窗口的情况下也继续运行，并且在没有窗口可用的情况下激活应用时会打开新的窗口。
  //这边写法和官网不一样
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

//在Windows和Linux上，（darwin 代表不是macos）关闭所有窗口通常会完全退出一个应用程序。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
