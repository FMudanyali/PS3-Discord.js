const fetch = require('node-fetch');
const discord_rpc = require('discord-rpc');
const client_id = '718828414525505588';
const { ps3_ip } = require('./config.json');

discord_rpc.register(client_id);
const rpc = new discord_rpc.Client({
  transport: 'ipc'
});

async function get_info(console_ip){
    if (!rpc) return;
    var url = `http://${console_ip}/cpursx.ps3?/sman.ps3`;
    let response = fetch(url)
        .then(res => res.text())
        .then(body => {
            //Clear the console
            process.stdout.write('\033c');

            var temperature = body.split(`cpursx.ps3?up">`)[1]
                .split(`</a>`)[0]
                .split(`<small>`);
            temperature = temperature[0] +
                temperature[1].split(`<br>`)[1];
            
            console.log(temperature);

            var firmware = body.split(`<a class="s" href="/setup.ps3">`)[1]
                .split(`<br>`)[0]
                .split(` : `)[1];
            console.log(firmware);

            try{
                var game = body.split(`<span style="position:relative;top:-20px;">`)[1]
                    .split(`">`)[2]
                    .split(` </a>`)[0];
            }catch(err){
                var game = "XMB"
            }
            console.log(game);
            var activity = {
                largeImageKey: "logo",
                largeImageText: firmware,
                details: temperature,
                state: `🎮: ${game}`,
                instance: false
            }
            rpc.setActivity(activity);
        })
        .catch(err => {
            console.log("Couldn't connect to PS3. Is it on? Is the IP correct?");
            process.exit(1);
        });
}

rpc.on('ready', () => {
    get_info(ps3_ip);
    setInterval(() => {
        get_info(ps3_ip);
    }, 15e3);
});

rpc.login(client_id).catch(console.error);