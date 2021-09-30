const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

// let mainWindow;
let newWindow;

app.whenReady().then(() => {
	createNewWindow();

	app.on("activate", () => {
		!BrowserWindow.getAllWindows().length && createNewWindow();
	});
});

app.on("window-all-closed", () => {
	process.platform !== "darwin" && app.quit();
});

const createNewWindow = () => {
	newWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			nativeWindowOpen: false,
			// preload: path.join(__dirname, "preload.js")
		},
	});

	newWindow.loadURL("http://localhost:3000");
	newWindow.on("close", () => (newWindow = null));

	const mainMenu = Menu.buildFromTemplate(mainMeuTemplate);
	Menu.setApplicationMenu(mainMenu);
};

const mainMeuTemplate = [
	{
		label: "File",
		submenu: [
			{
				label: "New Window",
				accelerator:
					process.platform === "darwin" ? "Command+Shift+N" : "Ctrl+Shift+N",
				click() {
					createNewWindow();
				},
			},
			{
				label: "Close Window",
				accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl + Q",
				click() {
					app.quit();
				},
			},
		],
	},
];

process.platform === "darwin" && mainMeuTemplate.push({});

if (isDev) {
	mainMeuTemplate.push({
		label: "Dev Tools",
		submenu: [
			{
				label: "Toggle DevTools",
				accelerator:
					process.platform === "darwin" ? "Command+Shift+I" : "Ctrl+Shift+I",
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
					console.log(item);
				},
			},
			{
				role: "reload",
			},
		],
	});
}
