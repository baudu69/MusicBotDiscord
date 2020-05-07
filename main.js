const Discord = require('discord.js')
const bot = new Discord.Client()
const YoutubeStream = require('ytdl-core')
const ffmpeg = require("ffmpeg")

bot.on('ready', function () {
    console.log("Je suis connecté !")
})

/* Ajouter le fichier Token.js remplit comme suit :
class Token {
    getToken() {
        return 'TOKEN'
    }
}
module.exports = Token
 */
const Token = require('./Token.js')
let token = new Token()
bot.login(token.getToken())

let dispatcher
const Volume = require('./Volume.js')
let volume = new Volume(0.5)


bot.on('message', message => {

    //Vérification que le message correspond a p
    if (message.content.startsWith('!p ')) {
        let guildChannel = message.guild.channels
        let voiceChannel = message.member.voice.channel
        let args = message.content.split(' ')
        voiceChannel
            .join()
            .then(function (connection) {
                // On démarre un stream à partir de la vidéo youtube
                let stream = YoutubeStream(args[1])
                stream.on('error', function () {
                    message.reply("Je n'ai pas réussi à lire cette vidéo :(")
                    connection.disconnect()
                })
                // On envoie le stream au channel audio
                // Il faudrait ici éviter les superpositions (envoie de plusieurs vidéo en même temps)
                dispatcher = connection
                    .play(stream)
                    .on('end', function () {
                        connection.disconnect()
                    })
                action(connection)

            })
    }
    if (message.content.startsWith('!help')) {
        help(message)
    }
    if (message.content.startsWith('!ping')) {
        message.reply('pong')
    }

})

function action(connection) {
    bot.on('message', message => {
        switch (message.content) {
            case ('!pause'):
                dispatcher.pause()
                message.reply("Musique mise en pause")
                break
            case ('!resume'):
                dispatcher.resume()
                message.reply("Musique remise en route")
                break
            case ('!up'):
                dispatcher.setVolume(volume.up())
                message.reply("Volume augmenté à " + volume.getVolume())
                break
            case ('!down'):
                dispatcher.setVolume(volume.down())
                message.reply("Volume baissé à " + volume.getVolume())
                break
            case ('!volume'):
                message.reply("le volume est de " + volume.getVolume())
                break
            case ('!end'):
                connection.disconnect()
                message.reply("Musique arrêté")
                break
        }
    })
}

function help(message) {
    let helpString = "Voici les différentes commandes du bot Musique : \n" +
        "   '!p + Lien' pour lancer une musique Youtube\n" +
        "   '!pause' pour mettre la musique en pause\n" +
        "   '!resume' pour remettre la musique en route\n" +
        "   '!up' pour monter le volume\n" +
        "   '!down' pour descendre le volume\n" +
        "   '!volume' pour afficher le volume actuel\n" +
        "   '!end' pour arrêter la musique"
    message.reply(helpString)
}