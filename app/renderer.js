// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

(function(){
	const {ipcRenderer} = require('electron');

	var webview = document.getElementById('webview');
	var popupElement = document.getElementById('popup');
	var fadeTimeout;
	var menu = document.querySelector('menu');
	var urlbar = document.getElementById('urlbar');
	var cinemaMode = false;
	var cinemaDisableClickCount = 0;

	//checks if widevine is loaded
	ipcRenderer.send('toggle', 'widevine');
	ipcRenderer.on('main', (event, arg) => {
		switch(arg){
			case 'focus':
				webview.focus();
				break;
			case 'widevineDisabled':
				popup("Could not locate widevine. Will not be able to play encrypted content.");
				break;
			case 'toggle-fullscreen':
				document.getElementById('fullscreen').classList.toggle('active');
				break;
			default:
				break;
		}
	});  

	/**
	 * loads a url into webview, prepends 'https' if protocol is missing
	 * @param  {string} url the url to be loaded
	 */
	function loadWebview(url){
		if(url.indexOf('//') == -1){
			url = "https://" + url;
		}
		webview.src = url;
		webview.addEventListener('load-commit', (e) => {
			if(e.isMainFrame){
				urlbar.value = e.url;
			}			
		});
	}

	/**
	 * show a dismissable popup with the specified text
	 * @param  {string} text
	 */
	function popup(text){
		document.getElementById('popup-content').innerHTML = text;
		popupElement.classList.add('active');
	}
	document.getElementById('popup-close').addEventListener('click', (e)=>{
		popupElement.classList.remove('active');
	});

	
	// event listener for paste to url bar
	urlbar.addEventListener('paste', (event)=>{
		//needed for value to be accessible
		setTimeout(()=>{
			loadWebview(event.target.value);
		}, 0);
	});
	// event listener for typing
	urlbar.addEventListener('keyup', (e)=>{
		toggleFade(); //keep menu visible on typing
		if (e.keyCode == 13) { //on enter load url
			loadWebview(e.target.value);
		}
	});

	//pin toggle
	document.getElementById('pin').addEventListener('click', (e)=>{
		ipcRenderer.send('toggle', 'pin');
		e.currentTarget.classList.toggle('active');
	});

	//cinema mode toggle
	function toggleCinema(){
		cinemaMode = !cinemaMode;
		document.getElementById('cinema').classList.toggle('active');
		document.getElementById('cinema-overlay').classList.toggle('active');
	}
	function enableCinema(e){
		e.stopPropagation();
		toggleCinema();
	}
	//Disable cinema on two clicks within a second
	function disableCinema(e){
		e.stopPropagation();
		webview.focus();
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
		ipcRenderer.send('toggle', 'fullscreen');
	});

	//switch menu to bottom
	document.getElementById('menu').addEventListener('click', (e)=>{
		e.currentTarget.classList.toggle('active');
		menu.classList.toggle('bot');
		popupElement.classList.toggle('top');
	});

	//close button
	document.getElementById('close').addEventListener('click', (e)=>{
		ipcRenderer.send('toggle', 'close');
		e.currentTarget.classList.toggle('active');
	});

	//automatically fade out menu
	
	/**
	 * blends in menu for 1.5 seconds (longer if called continuously)
	 */
	function toggleFade(){
		if(cinemaMode) return;
		menu.classList.remove('fadeout');
		menu.classList.add('fadein');
		clearTimeout(fadeTimeout);
		fadeTimeout = setTimeout(function () {
				menu.classList.remove('fadein');
				menu.classList.add('fadeout');
		}, 1500);
	}
	document.querySelector('body').addEventListener('mousemove', toggleFade);

})();