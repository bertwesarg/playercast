const PlayerController = require('media-player-controller');
const ioClient = require('socket.io-client');
const readline = require('readline');

var websocket;
var controller;
var mediaLink;
var updateInterval = null;

var status = {
	playerState: 'PAUSED',
	currentTime: 0,
	media: { duration: 0 },
	volume: 0
};

var player =
{
	init: (opts) =>
	{
		mediaLink = opts.media;
		controller = new PlayerController(opts);

		websocket = ioClient(opts.websocket);
		writeLine(`Connecting to ${opts.websocket}...`);

		websocket.on('connect', () => writeLine('Waiting for media cast...'));
		websocket.on('disconnect', () => writeLine('WebSocket disconnected'));
		websocket.on('remote-signal', (msg) => player.control(msg));
		websocket.on('playercast', () => onPlayerCast());
	},

	control: (msg) =>
	{
		if(!controller) return;

		var position;

		switch(msg.action)
		{
			case 'PLAY':
				controller.player.play((err) =>
				{
					if(err) return;
					status.playerState = 'PLAYING';
					websocket.emit('status-update', status);
				});
				break;
			case 'PAUSE':
				controller.player.pause((err) =>
				{
					if(err) return;
					status.playerState = 'PAUSED';
					websocket.emit('status-update', status);
				});
				break;
			case 'SEEK':
				position = msg.value * status.media.duration;
				controller.player.seek(position, (err) =>
				{
					if(err) return;
					status.currentTime = position;
					websocket.emit('status-update', status);
				});
				break;
			case 'SEEK+':
				position = status.currentTime + msg.value;
				if(position < status.media.duration)
				{
					controller.player.seek(position, (err) =>
					{
						if(err) return;
						status.currentTime = position;
						websocket.emit('status-update', status);
					});
				}
				break;
			case 'SEEK-':
				position = status.currentTime - msg.value;
				if(position < 0) position = 0;
				controller.player.seek(position, (err) =>
				{
					if(err) return;
					status.currentTime = position;
					websocket.emit('status-update', status);
				});
				break;
			case 'VOLUME':
				controller.player.setVolume(msg.value * 100, (err) =>
				{
					if(err) return;
					status.volume = msg.value;
					websocket.emit('status-update', status);
				});
				break;
			case 'STOP':
				controller.quit();
				break;
			default:
				break;
		}

		return status;
	},

	updateStatus: (data) =>
	{
		const msgArray = data.split('\n');

		for(var i = 0; i < msgArray.length - 1; i++)
		{
			var msg = JSON.parse(msgArray[i]);
			if(msg.event === 'property-change')
			{
				switch(msg.name)
				{
					case 'volume':
						var volume = msg.data / 100;
						if(volume > 1) volume = 1;
						status.volume = volume;
						break;
					case 'time-pos':
						status.currentTime = msg.data;
						break;
					case 'duration':
						status.media.duration = msg.data;
						break;
					case 'pause':
						status.playerState = (msg.data === true) ? 'PAUSED' : 'PLAYING';
						break;
					default:
						writeError(`Unhandled property: ${msg}`);
						break;
				}
			}
		}
	}
}

function onPlayerCast()
{
	if(!controller) return writeError('Controller not initialized!');

	var launchPlayer = () =>
	{
		controller.launch((err) =>
		{
			if(err) return writeError(err.message);
			onPlayerLaunch();
		});
	}

	if(controller.process && controller.player)
	{
		controller.player.load(mediaLink, (err) =>
		{
			if(!err) return websocket.emit('show-remote', true);

			controller.process.once('close', () => launchPlayer());

			controller.quit((err) =>
			{
				if(err) writeError(err.message);
			});
		});
	}
	else
	{
		writeLine(`Starting media player...`);
		launchPlayer();
	}
}

function onPlayerLaunch()
{
	updateInterval = setInterval(() => websocket.emit('status-update', status), 500);

	controller.process.stdout.once('data', () =>
	{
		if(controller.player.socket)
			controller.player.socket.on('data', (data) => player.updateStatus(data));

		writeLine('Player started');
		websocket.emit('show-remote', true);
	});

	controller.process.once('close', (code) =>
	{
		websocket.emit('show-remote', false);

		if(updateInterval)
		{
			clearInterval(updateInterval);
			updateInterval = null;
		}

		if(code) writeError(`Player exited with status code: ${code}`);

		writeLine('Waiting for media cast...');
	});

	controller.process.once('error', (err) => writeError(err.message));
}

function writeLine(text)
{
	readline.cursorTo(process.stdout, 0);
	readline.clearLine(process.stdout, 0);
	process.stdout.write(text);
}

function writeError(text)
{
	console.error('\n' + text);
}

module.exports = player;
