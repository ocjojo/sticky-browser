const {
	app,
	BrowserWindow,
	Menu,
	ipcMain
} = require('electron');

const path = require('path');
const url = require('url');
const fs = require('fs');

/**
 * tries to find widevineCdm to be able to play protected content
 * @return {boolean} returns true if found and registered, false otherwise
 */
function registerWidevine(){
	var chromeDir,
		widevineDir,
		widevinePlugin,
		versions,
		manifest;

	if (process.platform == 'darwin') {
		chromeDir = "/Applications/Google Chrome.app/Contents/Versions/";
		widevineDir = "Google Chrome Framework.framework/Libraries/WidevineCdm";
		widevinePlugin = "_platform_specific/mac_x64/widevinecdmadapter.plugin";
	}
	try{
		versions = fs.readdirSync(chromeDir);
		// filter same major version
		versions = versions.filter(version=>{
			return process.versions.chrome.split('.')[0] == version.split('.')[0];
		});
		//read manifest for widevine-cdm-version
		manifest = require(path.join(chromeDir, versions[0], widevineDir, 'manifest.json'));	
	} catch(e){
		return false;
	}
	var org = path.join(chromeDir, versions[0], widevineDir, widevinePlugin);
	
	// You have to pass the filename of `widevinecdmadapter` here, it is
	// * `widevinecdmadapter.plugin` on macOS,
	// * `libwidevinecdmadapter.so` on Linux,
	// * `widevinecdmadapter.dll` on Windows.
	app.commandLine.appendSwitch('widevine-cdm-path', org);
	// The version of plugin can be got from `chrome://plugins` page in Chrome.
	app.commandLine.appendSwitch('widevine-cdm-version', manifest.version);
	return true;
}

var widevine = registerWidevine();


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {  
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 480,
		height: 320,
		minWidth: 220,
		minHeight: 160,
		frame: false,
		alwaysOnTop: true,
		fullscreenable: false
	});

	// and load the index.html of the app.
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));

	// Open the DevTools.
	// mainWindow.webContents.openDevTools();

	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', ()=>{
	const menuTemplate = [{
		label: "StickyBrowser",
		submenu: [
		    { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
		]}, {
		label: "Edit",
		submenu: [
		    { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
		    { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
		    { type: "separator" },
		    { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
		    { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
		    { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
		    { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
		]}
	];

	Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

	createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function() {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('toggle', (event, arg) => {
	switch(arg){
		case 'pin':
			mainWindow.setAlwaysOnTop(!mainWindow.isAlwaysOnTop());
			break;
		case 'fullscreen':
			if(!mainWindow.isFullScreenable()){
				mainWindow.setFullScreenable(true);
				mainWindow.setFullScreen(true);
			} else {
				mainWindow.setFullScreen(false);
				mainWindow.setFullScreenable(false);
			}
			break;
		case 'close':
			mainWindow.close();
			break;
		case 'widevine':
			event.sender.send('widevine', widevine);
			break;
		default:
			break;
	}
});

//TODO: save settings