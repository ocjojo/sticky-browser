# StickyBrowser

This is an [electron-based](https://electron.atom.io/) minimal browser, that can be made sticky/always-on-top.

It allows you to watch videos/movies picture-in-picture, so you can

- keep working while watching tutorials
- keep chatting while watching funny videos
- have a video chat while viewing other documents
- ...

## Widewine & DRM protected content

To watch DRM protected content electron needs the [widevine plugin](http://www.widevine.com/).
Currently this is [neither bundled with electron](https://github.com/electron/electron/blob/master/docs/tutorial/using-widevine-cdm-plugin.md) nor with this application.

This application looks for the plugin shipped with the [chrome browser](https://www.google.de/chrome/browser/desktop/index.html).

Currently this only looks in one path, because I just need that one. PRs welcome to add support a wider range of macOS versions, as well as wndows and linux.

## Development

1. Clone this repo
2. run `npm install`
3. run `npm run start`

All relevant source files are within the `app` folder.

To create a distributable app [electron-builder](https://github.com/electron-userland/electron-builder) is used.
For macOS just run `npm run build` and see the files in `dist` folder.
