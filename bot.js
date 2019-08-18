135 lines (88 sloc)  3.62 KB
    

const Discord = require("discord.js");

const client = new Discord.Client();

const config = require("./config.json");


client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  client.user.setActivity(`E`);
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`with his Sharingan`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`with his Sharingan`);
});


client.on("message", async message => {

  if(message.author.bot) return;
  
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  
  if(command === "ping") {

    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if(command === "say") {

    const sayMessage = args.join(" ");

    message.delete().catch(O_o=>{}); 

    message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
    if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    

    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    

    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }
  
 if(command === "hi" || command === "hello") {
 message.channel.send(`Hello ${message.author.toString()}`);  
 return; 
 }
  
 if(command === "nani") { 
 return message.channel.send("http://gifimage.net/wp-content/uploads/2017/10/nani-gif-2.gif");
 }
  
if(command === "sinsbot") {
message.channel.send(`He is a very good cock! `);
return;
}
  
if(command === "forbidden-jutsu") {
message.channel.send(`https://media1.tenor.com/images/07eb87ae016a48197c99bcf2bc3879a6/tenor.gif?itemid=7360766`);
return;
}

  
if(command === "team7") {
message.channel.send(`Team 7 consists of Naruto, Sasuke, Sakura and Me! `);
return;
}
  
  
 if(command === "help") {
 message.author.sendMessage("You can use:-hi, -nani, -sinsbot, -team7");                                     
 return;
 }
  
   if(command === "@") {
 message.channel.send("");                                     
 return;
 }
  
     if(command === "ashamed") {
 message.channel.send("https://media.giphy.com/media/JogBsleaWauHe/giphy.gif");                                     
 return;
 }
  
       if(command === "kamui") {
 message.channel.send("https://media.giphy.com/media/aMhiY5TgVAmVG/giphy.gif");                                     
 return;
 }
  
         if(command === ":Spongeboi:") {
 message.channel.send("");                                     
 return;
 }
                  
  
    else{
    message.channel.send(`My Sharingan doesn´t know what you mean!`);
    return;
         }
      
  
});
    
    

client.login(process.env.BOT_TOKEN);
