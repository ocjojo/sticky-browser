// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

(function(){
	const {ipcRenderer} = require('electron');

	var webview;

	function loadWebview(url){
		if(url.indexOf('//') == -1){
			url = "https://" + url;
		}
		if(!webview){
			webview = document.getElementById('webview');
			webview.src = url;
			// webview.addEventListener('dom-ready', (e) => {
			// 	webview.openDevTools();
			// });
		} else {
			webview.loadURL(url);
		}
	}
	
	var input = document.getElementById('input');

	//after paste set src on webview
	input.addEventListener('paste', (event)=>{
		//needed for 
		setTimeout(()=>{
			loadWebview(event.target.value);
		}, 0);
	});
	input.addEventListener('keyup', (e)=>{
		if (e.keyCode == 13) {
			loadWebview(e.target.value);
		}
	});

	//pin toggle
	document.getElementById('pin').addEventListener('click', (e)=>{
		ipcRenderer.send('toggle', 'pin');
		e.currentTarget.classList.toggle('active');
	});

	//cinema mode toggle
	var cinema = false;
	function toggleCinema(){
		cinema = !cinema;
		document.getElementById('cinema').classList.toggle('active');
		document.getElementById('cinema-overlay').classList.toggle('active');
	}
	function enableCinema(e){
		e.stopPropagation();
		toggleCinema();
	}
	//Disable cinema on two clicks within a second
	var cinemaDisableClickCount = 0;
	function disableCinema(e){
		e.stopPropagation();
		if(cinemaDisableClickCount > 0){
			toggleCinema();
		} else {
			cinemaDisableClickCount++;
			setTimeout(()=>{
				cinemaDisableClickCount = 0;
			}, 1000);
		}
	}
	document.getElementById('cinema').addEventListener('click', enableCinema);
	document.getElementById('cinema-overlay').addEventListener('click', disableCinema);

	//fullscreen toggle
	document.getElementById('fullscreen').addEventListener('click', (e)=>{
		e.currentTarget.classList.toggle('active');
		ipcRenderer.send('toggle', 'fullscreen');
	});

	document.getElementById('menu').addEventListener('click', (e)=>{
		e.currentTarget.classList.toggle('active');
		e.currentTarget.parentNode.parentNode.classList.toggle('bot');
	});

	//close button
	document.getElementById('close').addEventListener('click', (e)=>{
		ipcRenderer.send('toggle', 'close');
		e.currentTarget.classList.toggle('active');
	});

	var timeout;
	var menu = document.querySelector('menu');
	document.querySelector('body').addEventListener('mousemove', ()=>{
		if(cinema) return;
		menu.classList.remove('fadeout');
		menu.classList.add('fadein');
		clearTimeout(timeout);
		timeout = setTimeout(function () {
				menu.classList.remove('fadein');
				menu.classList.add('fadeout');
		}, 1500);
	});

})();