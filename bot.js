const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const { Users, CurrencyShop } = require('./dbObjects');
const { Op } = require('sequelize');
const currency = new Discord.Collection();

Reflect.defineProperty(currency, 'add', {
	value: async function add(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(currency, 'getBalance', {
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
});

client.once('ready', async () => {
	const storedBalances = await Users.findAll();
storedBalances.forEach(b => currency.set(b.user_id, b));
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  client.user.setActivity(`Serving ${client.users.size} Members | Merdi`);
});


client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});


client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});





client.on("message", async message => {
  if(message.author.bot) return;
  currency.add(message.author.id, 1);
  
  if (!message.content.startsWith(PREFIX)) return;
	const input = message.content.slice(PREFIX.length).trim();
	if (!input.length) return;
	const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);

  if (command === 'balance') {
	  const target = message.mentions.users.first() || message.author;
return message.channel.send(`${target.tag} has ${currency.getBalance(target.id)}💰`);
		
	} else if (command === 'inventory') {
		const target = message.mentions.users.first() || message.author;
const user = await Users.findOne({ where: { user_id: target.id } });
const items = await user.getItems();

if (!items.length) return message.channel.send(`${target.tag} has nothing!`);
return message.channel.send(`${target.tag} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`);
		
	} else if (command === 'transfer') {
		const currentAmount = currency.getBalance(message.author.id);
const transferAmount = commandArgs.split(/ +/g).find(arg => !/<@!?\d+>/g.test(arg));
const transferTarget = message.mentions.users.first();

if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author}, you only have ${currentAmount}.`);
if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);

currency.add(message.author.id, -transferAmount);
currency.add(transferTarget.id, transferAmount);

return message.channel.send(`Successfully transferred ${transferAmount}💰 to ${transferTarget.tag}. Your current balance is ${currency.getBalance(message.author.id)}💰`);
		
	} else if (command === 'buy') {
		const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: commandArgs } } });
if (!item) return message.channel.send(`That item doesn't exist.`);
if (item.cost > currency.getBalance(message.author.id)) {
	return message.channel.send(`You currently have ${currency.getBalance(message.author.id)}, but the ${item.name} costs ${item.cost}!`);
}

const user = await Users.findOne({ where: { user_id: message.author.id } });
currency.add(message.author.id, -item.cost);
await user.addItem(item);

message.channel.send(`You've bought: ${item.name}.`);
		
	} else if (command === 'shop') {
		const items = await CurrencyShop.findAll();
return message.channel.send(items.map(item => `${item.name}: ${item.cost}💰`).join('\n'), { code: true });
		
	} else if (command === 'leaderboard') {
		return message.channel.send(
	currency.sort((a, b) => b.balance - a.balance)
		.filter(user => client.users.has(user.user_id))
		.first(10)
		.map((user, position) => `(${position + 1}) ${(client.users.get(user.user_id).tag)}: ${user.balance}💰`)
		.join('\n'),
	{ code: true }
);
	
	}
});



  
  if(message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);

  const command = args.shift().toLowerCase();

  

  // Let's go with a few common example commands! Feel free to delete or change those.

  

  if(command === "ping") {

    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.

    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)

    const m = await message.channel.send("Ping?");

    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);

  }

  

  if(command === "say") {

    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 

    // To get the "message" itself we join the `args` back into a string with spaces: 

    const sayMessage = args.join(" ");

    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.

    message.delete().catch(O_o=>{}); 

    // And we get the bot to say the thing: 

    message.channel.send(sayMessage);

  }

  

  if(command === "kick") {

    // This command must be limited to mods and admins. In this example we just hardcode the role names.

    // Please read on Array.some() to understand this bit: 

    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?

    if(!message.member.roles.some(r=>["Owner", "Admin", "Moderator"].includes(r.name)) )

      return message.reply("Sorry, you don't have permissions to use this!");

    

    // Let's first check if we have a member and if we can kick them!

    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.

    // We can also support getting the member by ID, which would be args[0]

    let member = message.mentions.members.first() || message.guild.members.get(args[0]);

    if(!member)

      return message.reply("Please mention a valid member of this server");

    if(!member.kickable) 

      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");

    

    // slice(1) removes the first part, which here should be the user mention or ID

    // join(' ') takes all the various parts to make it a single string.

    let reason = args.slice(1).join(' ');

    if(!reason) reason = "No reason provided";

    

    // Now, time for a swift kick in the nuts!

    await member.kick(reason)

      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));

    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);



  }

  

  if(command === "ban") {

    // Most of this command is identical to kick, except that here we'll only let admins do it.

    // In the real world mods could ban too, but this is just an example, right? ;)

    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )

      return message.reply("Sorry, you don't have permissions to use this!");

    

    let member = message.mentions.members.first();

    if(!member)

      return message.reply("Please mention a valid member of this server");

    if(!member.bannable) 

      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");



    let reason = args.slice(1).join(' ');

    if(!reason) reason = "No reason provided";

    

    await member.ban(reason)

      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));

    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);

  }

  

  if(command === "purge") {

    // This command removes all messages from all users in the channel, up to 100.

    

    // get the delete count, as an actual number.

    const deleteCount = parseInt(args[0], 10);

    

    // Ooooh nice, combined conditions. <3

    if(!deleteCount || deleteCount < 2 || deleteCount > 100)

      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");

    const fetched = await message.channel.fetchMessages({limit: deleteCount});

    message.channel.bulkDelete(fetched)

      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }

  
});


client.login(process.env.BOT_TOKEN);
