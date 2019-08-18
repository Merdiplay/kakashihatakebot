
const Discord = require("discord.js");

const client = new Discord.Client();

const config = require("./config.json");


client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  client.user.setActivity(`Serving ${client.users.size} Member| Made by Merdi`);
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
  
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();	
 });


  if(command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
 }
   
       if(command === "forbidden-jutsu") {
 message.channel.send(`https://media1.tenor.com/images/07eb87ae016a48197c99bcf2bc3879a6/tenor.gif?itemid=7360766`);
 return;
 }
 
       if(command === "kamui") {
 message.channel.send("https://media.giphy.com/media/aMhiY5TgVAmVG/giphy.gif");                                     
 return;
 }

  
    else{
  message.channel.send(`Wot? I couldnt understand you.`);
  return;
  }
      
  

    
    

client.login(process.env.BOT_TOKEN);
