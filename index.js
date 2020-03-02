#!/usr/bin/env node

const cliCursor = require('cli-cursor');
const debug = require('debug')('playercast');
const parseArgs = require('minimist');
const helper = require('./lib/helper');
const player = require('./lib/player');
const sender = require('./lib/sender');
const service = require('./lib/service');
const server = require('./lib/server');
const terminal = require('./lib/terminal');

cliCursor.hide();

const opts = {
	boolean: [
		'quiet', 'cec-alt-remote', 'cec-force-switch', 'disable-cec',
		'listen', 'create-service', 'remove-service'
	],
	string: ['subs', 'name', 'player', 'port', 'cec-end-hdmi'],
	alias: { q: 'quiet', s: 'subs', n: 'name', p: 'player' },
	default: { p: 'mpv' },
	unknown: (option) => onUnknown(option)
};

const args = process.argv.slice(2);
const argv = parseArgs(args, opts);
init();

function init()
{
	if(!checkArgvStrings())
		return terminal.showHelp();

	if(!argv.listen)
	{
		if(!argv._.length)
			return terminal.showHelp();

		process.on('SIGINT', () => sender.closeSender());
		process.on('SIGTERM', () => sender.closeSender());
		process.on('uncaughtException', (err) => sender.closeSender(err));

		terminal.quiet = (argv.quiet || debug.enabled);
		terminal.mode = 'Sender';
		return sender.init(argv);
	}

	if(argv['create-service'])
	{
		if(argv._.length !== 1)
			return terminal.showHelp();

		return service.create(source, argv);
	}
	else if(argv['remove-service'])
	{
		return service.remove();
	}

	if(argv._.length > 1)
		return terminal.showHelp();

	connectClient();
}

function connectClient()
{
	var playerOpts = {
		ipcPath: '/tmp/playercast-socket'
	};

	if(argv._.length === 1)
	{
		const data = String(argv._[0]).split(':');
		if(data.length > 2)
			return terminal.showHelp();

		const source = {
			ip: data[0],
			port: (data[1] || 4000)
		};

		if(
			isNaN(source.port)
			|| source.port < 1
			|| source.port > 65535
		)
			return terminal.showHelp();

		const link = `http://${source.ip}:${source.port}`;

		playerOpts.websocket = link;
		playerOpts.connectWs = true;
	}

	var config = { ...playerOpts, ...argv };

	if(!config.name)
		config.name = 'Playercast-' + helper.makeRandomString(4, true);

	terminal.device = config.name;
	config.app = (config.player) ? config.player.toLowerCase() : playerOpts.player;

	terminal.quiet = (argv.quiet || debug.enabled);
	terminal.disableWriting();
	terminal.enableKeyInput(player);

	if(playerOpts.connectWs)
		return player.init(config);

	server.receiver(config.port || 9881, (err) =>
	{
		if(err)
		{
			terminal.writeError(err);
			debug(err);

			return process.exit(1);
		}

		process.on('SIGINT', () => player.closePlayercast());
		process.on('SIGTERM', () => player.closePlayercast());
		process.on('uncaughtException', (err) => player.closePlayercast(err));

		player.init(config);
	});
}

function onUnknown(option)
{
	if(!option.startsWith('-')) return;

	terminal.showHelp();
	process.exit(1);
}

function checkArgvStrings()
{
	if(
		argv.hasOwnProperty('cec-end-hdmi')
		&& (isNaN(argv['cec-end-hdmi']) || argv['cec-end-hdmi'] < 0)
	)
		return false;

	if(
		argv.hasOwnProperty('port')
		&& (isNaN(argv.port) || argv.port < 1 || argv.port > 65535)
	)
		return false;

	for(var key of opts.string)
		if(argv[key] === '') return false;

	return true;
}
