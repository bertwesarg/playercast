# Playercast
[![License](https://img.shields.io/github/license/Rafostar/playercast.svg)](https://github.com/Rafostar/playercast/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/playercast.svg)](https://www.npmjs.com/package/playercast)
[![Downloads](https://img.shields.io/npm/dt/playercast.svg)](https://www.npmjs.com/package/playercast)
[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=TFVDFD88KQ322)
[![Donate](https://img.shields.io/badge/Donate-PayPal.Me-lightgrey.svg)](https://www.paypal.me/Rafostar)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/Rafostar/playercast.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2FRafostar%2Fplayercast)

A simple app meant to be run in background. Automates the process of receiving cast media over the local network. Install it on device with any Linux DE to turn your media player into receiver that plays files cast with [Cast to TV](https://rafostar.github.io/gnome-shell-extension-cast-to-tv) from your host PC.

To receive media set `Playercast app` as your receiver type in Cast to TV settings.

**Only compatible with Cast to TV v10+.**

## Features
* Receives all types media from [Cast to TV](https://rafostar.github.io/gnome-shell-extension-cast-to-tv)
* Automatically starts media player upon cast
* Can be installed on any Linux distro with any DE
* Remotely control playback from GNOME top bar
* Supports HDMI-CEC
* Safe to use (does not use `SSH` or `root` privileges)

## Installation
```
sudo npm install -g playercast
```
Requires one of the supported media players to work.<br>
Currently only MPV player is supported. VLC support is planned for the future.

## Usage
The application can be used from terminal with:

```
playercast IP:PORT
```

IP is the address of server PC with Cast to TV extension.<br>
PORT is the listening port set in Cast to TV extension settings (default: 4000).

By default Playercast receiver name is autogenerated as `Playercast-XXXX`.<br>
Custom name can be assigned with `--name` option:

```
playercast IP:PORT --name 'Raspberry Pi'
```

Select Playercast name in Cast to TV settings `Other` tab to control which of your devices receives media.

### Install as systemd service
After testing in command line, app can be installed as systemd service with:

```
playercast IP:PORT --name 'Bedroom TV' --create-service
```

Above command can always be run again to update configuration with new device name, address or other args.

Remember to enable and start newly added service with:

```
systemctl --user enable playercast
systemctl --user start playercast
```

App will be running on each system boot as background service idling and waiting to receive cast files.

**It is recommended to assign your server PC a static IP address, otherwise app will not be able to connect when IP changes.**

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

**Raspberry Pi marks HDMI port as *active* during startup, which means that TV source will not be switched automatically on first media cast after system boot.**

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

## Donation
If you like my work please support it by buying me a cup of coffee :-)

[![PayPal](https://github.com/Rafostar/gnome-shell-extension-cast-to-tv/wiki/images/paypal.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=TFVDFD88KQ322)
