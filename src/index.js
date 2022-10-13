////IMOPRT////

//Load-.ENV-MODULE//
require('dotenv').config();

//Import-"commands.js"//
const com = require("./commands.js");
//Import-"constants.js"//
const con = require("./constants.js");
//Import-"message.json"
const msg = require("./messages.json");

//Import-Twitch.api(tmi.js)//
const tmi = require('tmi.js');
const { channel } = require('tmi.js/lib/utils');


////TWITCH-FUNCTIONS////

///Functions///
//Message-Randomizer / randomizeMsg
function randomizeMsg(obj) {
	let arr = Object.values(obj);
	return arr[Math.floor(Math.random() * arr.length)];
  }

//Bot-Connect-to-Twitch//
const client = new tmi.client(con.opts);
client.connect().catch(console.error);

client.connect();




////Bot-Timers//
//ask
setInterval(() => {
	client.say(
		con.targetChannel, 
		con.ask[Math.floor(Math.random() * con.ask.length)]); 
}, con.askTime * 60 * 1000)
//socials
setInterval(() => {
	client.say(
		con.targetChannel, 
		con.socials[Math.floor(Math.random() * con.socials.length)]); 
}, con.socialsTime * 60 * 1000)
//discord
setInterval(() => {
	client.say(
		con.targetChannel, 
		con.discord[Math.floor(Math.random() * con.discord.length)]); 
}, con.discordTime * 60 * 1000)
//followMe
setInterval(() => {
	client.say(
		con.targetChannel, 
		con.followMe[Math.floor(Math.random() * con.followMe.length)]); 
}, con.askTime * 60 * 1000)
//lovLurkers
setInterval(() => {
	client.say(
		con.targetChannel, 
		con.lovLurkers[Math.floor(Math.random() * con.lovLurkers.length)]); 
}, con.lovLurkersTime * 60 * 1000)




////Bot-Replies//
//Bot-Listen-to-Twitch-chat
client.on('chat', (channel, userstate, message, self) => {
	if ( self ) return; //Check-Self
	//Retrieve-Username
	let userName = userstate.username

	////Event-Handler
	//Welcome-back!
	if (con.lurkers.includes(userName)){
		//personalized-welcome-message
		client.say(channel, `Welcome back ${userName}! Hope u enjoyed ur time Lurking~`);
		//find-index-of-lurker
		const indexOfLurker = con.lurkers.findIndex(object => {
				return object.id === userName;
			});
		//remove-lurker-from-list
		con.lurkers.splice(indexOfLurker, 1);
	}


	//Match-command-Type
	if(message.match(con.regexpCommand)){

	//!lurk
	if (message.toLocaleLowerCase() === '!lurk') {
		//Already-Lurker
		if (con.lurkers.includes(userName)) {
			client.say(channel, `${userName} you are already lurking ya dingdong!`);
		} else {
		//New-Lurker
			client.say(channel, `${userName} is now lurking!`);
			con.lurkers.push(`${userstate.username}`);
			con.lurkCount = con.lurkers.length; 
		}
	}

	//!lurkers
	if (message.toLocaleLowerCase() === '!lurkers') {
		client.say(channel, `${con.lurkCount} people are currently lurking`);
	}


	////Reply-Message-Handlers
	const [raw, command, argument] = message.match(con.regexpCommand);
	const { response } = com.commands[command] || {};

	if ( typeof response === 'function' ) {
		client.say(channel, response(argument));
	} else if ( typeof response === 'string' ) {
		client.say(channel, response);
	}	
	}

  });