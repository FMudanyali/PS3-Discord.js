var spawn = require('child_process').spawn;
var os = require('os');

if(os.release().toLowerCase().includes('microsoft')){
    spawn('cmd.exe /C "cls && pushd $(wslpath -w .) && node main.js"', { stdio: 'inherit', shell: true });
} else{
    spawn('node main.js', { stdio: 'inherit', shell: true });
}
