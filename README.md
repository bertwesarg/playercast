# Playercast
[![License](https://img.shields.io/github/license/Rafostar/playercast.svg)](https://github.com/Rafostar/playercast/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/playercast.svg)](https://www.npmjs.com/package/playercast)
[![Downloads](https://img.shields.io/npm/dt/playercast.svg)](https://www.npmjs.com/package/playercast)
[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=TFVDFD88KQ322)
[![Donate](https://img.shields.io/badge/Donate-PayPal.Me-lightgrey.svg)](https://www.paypal.me/Rafostar)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/Rafostar/playercast.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2FRafostar%2Fplayercast)

Everyone has their favorite media player, so why not turn it into a Chromecast-like receiver?

Playercast is a simple app that automates the process of streaming media over the local network. Install it on any device to turn your media player into receiver that plays files cast from your host PC and allows controlling playback remotely.

## One app, three modes
Playercast is a single app that comes with a total of three modes to use.

* RECEIVER - plays cast files using media player of your choice
* SENDER - sends selected media to receiver, shows playback status and allows remote controls
* ATTACH - easily connect to current playing session from any other PC to control playback. This mode also allows detaching (closing app) without stopping playback

## Features
* Supports casting videos, music, pictures and web links
* Automatically starts media player upon cast
* All modes (receiver/sender/attach) can be used on any OS (Linux/Windows/MacOS and more)
* Remotely control playback
* Supports HDMI-CEC
  * Turns on TV
  * Changes HDMI port at the start and end of playback
  * Allows controlling media player with TV remote
* Safe to use (does not use `SSH` or `root` privileges)

## Installation
Latest stable version is always available at npm package registry. Install with:
```
npm install -g playercast
```
No npm or do not want to setup it? No problem.
You can download compiled app (a.k.a. portable version) from GitHub releases page.

Playercast requires one of the supported media players to work.<br>
Please see media players support table below.

## Current media players support
-----------------------------
-----------------------------

## Usage
1) Start the receiver from terminal with:
```
playercast
```
This simple command will start the receiver with network discovery service.

By default Playercast receiver name is autogenerated as `Playercast-XXXX`.<br>
Custom name can be assigned with `--name` option.

2) Cast media from any PC with:
```
playercast 'video.mkv'
```
Providing path to media file or web link will start the app in sender mode. In this mode the app will quickly find the receiver in your local network, connect to it and start streaming media. You can provide more than one file, path to media directory or even use a "wild card" (e.g. `*.mp3`).

No special configuration is required and you do not have to bother finding and keeping track of your devices IP addresses. Easy right?

3) Optionally during streaming you can connect from any device to current playercast session with:
```
playercast --attach
```
This allows for quick access to playback controls while being few rooms away from your sender device.

### Install as systemd service
On Linux devices app can be installed as systemd service, which will start running receiver automatically in background after boot. Ready to receive media at any time and not affecting your OS usage in any way.
```
playercast --name 'Bedroom TV' --create-service
```
Above command can always be run again to update configuration with new device name, eventual IP address or other args.

Remember to enable and start newly added service with:
```
systemctl --user enable playercast
systemctl --user start playercast
```
From now on app will be running on each system boot as background service idling and waiting to receive cast media.

### Uninstall service
If you want to completely remove systemd service run:
```
systemctl --user disable playercast
systemctl --user stop playercast
playercast --remove-service
```

## HDMI-CEC
Requires CEC capable device (e.g. Raspberry Pi) and TV with such functionality.<br>
Additionally `cec-client` must be installed. On *Raspbian* it is included in `cec-utils` package.
```
sudo apt install cec-utils
```
CEC functionality is automatically detected and enabled on app launch.<br>
It can be disabled with `--disable-cec` option.

### Switch HDMI after playback
When playback is finished, HDMI port will be marked as *inactive*. This causes some TVs to switch input source to another one.
If you want to always switch TV to one of available HDMI ports after playback use `--cec-end-hdmi` option followed by a number of the HDMI port.

### TV Remote buttons keymap
Default keymap for controlling media player with TV remote.

```
`Up`       - switch video track                       `Play`         - play
`Down`     - switch audio track                       `Pause`        - pause
`Left`     - previous item in playlist                `Rewind`       - seek backward 10 sec
`Right`    - next item in playlist                    `Fast forward` - seek forward 10 sec
`Select`   - cycle fullscreen                         `Exit`/`Stop`  - stop player
`Subtitle` - switch subtitles
```

### Alternative buttons keymap
Alternative keymap can be enabled with `--cec-alt-remote` option.

```
`Up`                   - next item in playlist        `Select`       - cycle pause
`Down`                 - previous item in playlist    `Play`         - play
`Left`/`Rewind`        - seek backward 10 sec         `Pause`        - pause
`Right`/`Fast forward` - seek forward 10 sec          `Exit`/`Stop`  - stop player
`Red`                  - switch video track
`Green`                - switch audio track
`Yellow`/`Subtitle`    - switch subtitles
`Blue`                 - cycle fullscreen
```

## Cast to TV
Want to control playback from a GUI and running GNOME Shell on your main PC?

Check out GNOME Shell Extension [Cast to TV](https://rafostar.github.io/gnome-shell-extension-cast-to-tv). To receive media set `Playercast app` as your receiver type in Cast to TV settings.

Please note that current version of Cast to TV extension does not support Playercast scanning yet (but will in the near future). To connect you have to start Playercast receiver while providing ip and port of PC with Cast to TV extension.
```
playercast ip:port --name 'Bedroom TV'
```

## Donation
If you like my work please support it by buying me a cup of coffee :-)

[![PayPal](https://github.com/Rafostar/gnome-shell-extension-cast-to-tv/wiki/images/paypal.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=TFVDFD88KQ322)
