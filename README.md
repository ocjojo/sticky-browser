:warning: **Archived**  
Since this function became available again with Chrome 70, there is no need to maintain this repo any longer.

Just use the native API `document.querySelector('video').requestPictureInPicture();`

For convenience, you can create a bookmark.
Use the following as URL: `javascript:document.querySelector('video').requestPictureInPicture();`

# StickyBrowser

This is an [electron-based](https://electron.atom.io/) minimal browser, that can be made sticky/always-on-top.

It allows you to watch videos/movies picture-in-picture, so you can

- keep working while watching tutorials
- keep chatting while watching funny videos
- have a video chat while viewing other documents
- ...

Download from [release page](https://github.com/ocjojo/sticky-browser/releases).

---

![Screenshot StickyBrowser](https://user-images.githubusercontent.com/2684851/29438691-a9af8b1e-83b8-11e7-931b-e00fd39611e0.png)

## Controls

- Move window: kind of self-explaining
- Sticky-mode: Toggle always-on-top
- Cinema-mode: Hides menu and makes whole window draggable. To disable cinema-mode double-click on window.
- Fullscreen: Toggle fullscreen mode
- Switch toolbar: switches the buttons- & urlbar to the bottom of the window.

![Screenshot StickyBrowser Controls](https://user-images.githubusercontent.com/2684851/29438929-5a787630-83ba-11e7-8f83-71737fcfc189.png)

## Widewine & DRM protected content

To watch DRM protected content electron needs the [widevine plugin](http://www.widevine.com/).
Currently this is [neither bundled with electron](https://github.com/electron/electron/blob/master/docs/tutorial/using-widevine-cdm-plugin.md) nor with this application.

This application looks for the plugin shipped with the [chrome browser](https://www.google.de/chrome/browser/desktop/index.html).

Currently this only looks in one path, because I just need that one. PRs welcome to add support for a wider range of macOS versions, as well as windows and linux.

## Development

1. Clone this repo
2. run `npm install`
3. run `npm run start`

All relevant source files are within the `app` folder.

To create a distributable app [electron-builder](https://github.com/electron-userland/electron-builder) is used.
For macOS just run `npm run build` and see the files in `dist` folder.
