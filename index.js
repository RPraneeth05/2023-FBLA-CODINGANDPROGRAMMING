// Importing required modules
const { app, BrowserWindow } = require("electron");
const { writeFile } = require("fs");
const path = require("path");

// Checking if the app is in development mode
const isDeveloper = process.env.NODE_ENV !== "production";

// Function to create a new browser window
function createWindow() {
	const win = new BrowserWindow({
		width: 1920,
		height: 1080,
		minWidth: 1920,
		minHeight: 1080,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
		title: "EventHive",
	});
	// Opening dev tools if the app is in dexvelopment mode
	if (isDeveloper) {
		win.webContents.openDevTools();
	}
	
	win.loadFile("login.html");
	writeFile(path.join(__dirname, "./src/database/jwt.txt"), "", (err) => {});
}

// Creating the window when the app is ready
app.whenReady().then(() => {
	createWindow();
	// Recreating the window if it's activated
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// Closing the app when all windows are closed
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
