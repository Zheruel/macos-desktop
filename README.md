# macOS desktop mockup

A polished, browser-only desktop with a login and lock screen, Finder, Dock, Control Center, Mission Control, widgets, notifications, and interactive app previews.

[Open the desktop](https://zheruel.github.io/macos-desktop/)

Press Return at the login screen. No password is needed. Sleep, restart, shutdown, and Terminal commands are simulations that affect only this page. Demo password input is never stored or sent anywhere.

## Try it

- Open apps from the Dock, Apps, or Spotlight.
- Use the Apple menu to lock, sleep, restart, or shut down.
- Select an image in Finder and press Space for Quick Look.
- Try Calculator, Terminal (`help`), Weather, Clock, Notes, and System Settings.
- Use Mission Control in the Window menu to switch windows and desktops.
- Right-click the desktop to add widgets or change its appearance.

## Local preview

```sh
npm ci
npm run dev
```

`npm run build` creates `dist/client`. Pushes to `main` build and deploy automatically through GitHub Actions. Relative asset paths support the GitHub Pages project URL.

The layout is designed for desktop and adapts to smaller screens. This is an independent visual prototype, not an operating system or an Apple product.
