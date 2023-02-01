const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDeveloper = process.env.NODE_ENV !== 'development';
function createWindow() {
   const win = new BrowserWindow({
      width: 1920,
      height: 1080,
      minWidth: 1920,
      minHeight: 1080,
      webPreferences: {
         nodeIntegration: true,
         contextIsolation: false,
         preload: path.join(__dirname, 'login_preload.js')
      }
   });
   if (isDeveloper) {
      win.openDevTools();
   }
   win.loadFile('login.html');
}
app.whenReady().then(() => {
   createWindow();
   app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
   });
});
app.on('window-all-closed', () => {
   if (process.platform !== 'darwin') app.quit();
});