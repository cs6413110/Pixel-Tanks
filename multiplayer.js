const settings = {
  authserver: 'localhost',
  players_per_room: 10,
  upsl: 120,
  port: 8080,
  chat: true,
  joining: true,
}

const fs = require('fs'), fetch = require('node-fetch');
const {pack} = require('msgpackr/pack');
const {unpack} = require('msgpackr/unpack');
const {WebSocketServer} = require('ws');
const {dalle, gpt} = require('gpti');

console.log('Starting Server');
console.log('Compiling Engine');
fs.writeFileSync('engine.js', [`const PF = require('pathfinding');`, fs.readFileSync('./public/js/Engine.js'), fs.readFileSync('./public/js/Tank.js'), fs.readFileSync('./public/js/Block.js'), fs.readFileSync('./public/js/Shot.js'), fs.readFileSync('./public/js/AI.js'), fs.readFileSync('./public/js/Damage.js'), fs.readFileSync('./public/js/A.js'), 'module.exports = {Engine, Tank, Block, Shot, AI, Damage, A}'].join(''));
console.log('Compiled Engine');
const {Engine, Tank, Block, Shot, AI, Damage, A} = require('./engine.js');
console.log('Loading Server Properties');
const Storage = {key: ['owners', 'admins', 'vips', 'mutes', 'bans', 'filter']};
for (const p of Storage.key) Storage[p] = fs.existsSync(p+'.json') ? JSON.parse(fs.readFileSync(p+'.json')) : [];
console.log('Loaded Server Properties');
process.stdin.resume();
const save = () => {
  for (const p of Storage.key) fs.writeFileSync(p+'.json', JSON.stringify(Storage[p]));
}
for (const p of ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException']) process.on(p, save);
process.on('uncaughtException', (err, origin) => {
  for (const socket of sockets) if (['bradley', 'Celestial', 'cs641311'].includes(socket.username)) socket.send({status: 'error', message: `Error: ${err} Origin: ${origin}`});
  console.error(err);
  process.exit(0);
});
const m = o => Math.max(0, Math.min(59, o)), m2 = o => Math.max(-1, Math.min(60, o));
Array.prototype.r = function(o) {
  let i = this.indexOf(o);
  if (i !== -1) this.splice(i, 1);
}

let sockets = new Set(), servers = {}, ffaLevels = [
  'X13IQIX12R4X29IX11IXIX12R4XI7QI5QI9QI2X2IXQ3XQ4X2IQIXZ2X9R4XIX24IX2IXQZQ2Z2I2QXIXIX2Z2XIQ2X4R4XIXI12QI9XIX2IXQXQX5QXIQX4ZX3QX4R4XQXIXIX3IX14IXIXIZX2QXQZQX2QXIQXI2X2ZX2IX4R4XIXIXIX3I9QI2X3IXIX14IX2I2X5ZX4R4XIXIXIX3IX10IX3IXIX4I3X2I3X2IXQX3ZX8R4XIXIXIXI7QI10XIX4Q2IX2IQ2X2IX2IX2ZXIX2IX3R4XIXIXIXIX12IXIXIXQX14IX2I2X2IZIXQXQXR4XIXIXQXIX12IXIXQXIXI4XI2ZIQI4X2IXI3ZI3XQXR4XIXIXIXIX12IXIXIXIX4IXIX7IX4QX2ZX4QXR4XIXIXQXIX3I10XQXIXIX4QXIXZX3ZXIXI11QXR4XI5XIX3IX10IXIXIX4IXIXZX2Z2XIX3IX3IX3IQXR4XIX3IXIX3IXI3QI6XQXIXI4XIXZXZ2X2IX3IXQXIX3IX2R4X5IXIX5IX6IX3IXIX4IXIXZ3X3IX3IX3IX3IXIR4XIX3IXIX5IXI6X3IXIX4IXIXZ3X3I3ZI3ZI3ZIX2R4XI5XIX5IXIX4IX5IX2ZXIXIXZXZ2X2IX2ZX11R4XIXQXIXIX3IXIXIXI5QI4X4IXIXZX2Z2XIX2ZXZXZ5X3R4XQXIXIXIXI3XIXIXIX13QXIXZX3ZXIXI2X2Z6X3R4XIXIXIXIX5IXIXIXI9X3IXQX7IXZIX2Z2XZ3X3R4XIXIXIXI4QI2XIXIXIX8I9QI4XZIX2ZX4ZX3R4XIXIX11IXIXIXZ4XIX4IX3IX5IXI2X7ZX3R4XI7QI7XIXIXZX2ZXIX4IX3IXZX6IX11R4XIX3IX11IXIXZX2ZXIX4IX3IXZX3IXI2XQ3X2Z2X3Q2XQXIX3I11QIXIXZ4XIXIQI3QI2XZX3IX4IQ2X2Z2X2Q3XQ2IX3IX13IX6IX10Z3XIXZ2XIXIQX4Q2Z2XZQIQI7QI16XZ8X5IX4IXQ2X3Q2Z2IXZ2Q2X25R24Q2XZI2XIZ2Q2R48X5SXI2ZQ2R48Q2ZI2X7R48Q2Z2IXI2Z2Q2R24X2ZX4IX17Q2Z2XIZ2Q2X22IX3I5XI5XI5X8Q2ZXZ2Q2X4I3X4QX7ZX3IX3IX3IXIX11I5XIXQ2XQ3X4I2XZ4X10Q2ZI2X2I3XIXI2XI5XI2XIX3IXIX2QXQ2X5I2XZ7X3QX3QXQX3I2ZX5ZX8IXIXIXIXIX2R4X6I3X3Z6X5QZX6I5XIX2I2XI3XIXIXIXIX2R4X15Z6XQXQX3I4X3IXI2XI2X3IXIXI3XIX2R4X3QX15Z2X2ZX7ZXI3XIX2ZIXIX2ZIX5IX2R4X22ZX6I3X2IX2IXIXIX3IXI7X2R4X7QX3I6X6QX7I4XI2XIXI5X3IZX2IX2R4X3QX7IX4IX3QXQ2X5IX6IX2ZX5ZXIX3IX4R4X7QX3IXIGXIX5QX6I8XI17XR4X11IXI2XIX6QX5IX26R4X11IX4IX6QX5IXI19XI5R4X11I2XI3X6QX5IX5ZX20R4Z4Q2Z2X15ZQX4IXI2X3I4X5I2X9R4Z4X2Z2X15QX5IX2I3X6I4X5Q3X3R4X6Z2X15QX5IXZX3I6X9Z2QX3R4X6Z2X10QX10IXZ2X9ZX5IX2Z2QX2R4I16X13IXZ2X8ZX3I2X2IX2Z2QXR4I18X11IXZ2X2I4X2Z2X3IX3IX2ZQXR4X15I3X4IXIXIX2IXZ2X2I4X6I2X3IX2ZQXR4XZXZ3XZ3X2Z2XZ2X5I5X2IX20IX2ZQXR4XZXZXZXZX2ZXZ2XZ2IXIXI2X3IX2IX2IX3Q4X7IXI2X2ZQXR4XZXZXZX2ZXZXZ2XZXI8XIX2IX2IX3Q6XQXI5X2Z2QXR4XZXZXZ2XZXZXZXZ2XIXZXZXZX2IX2IX3IX4Q5X7Z2XQX2R4XZX3ZX2ZXZXZXZ2XIZ6X2IX2I2X3IX10QZ4QXQX3R4XZ3XZ3X2Z3X2ZXQX7I2X3IX25R4X17IZ7IX2',
  'X16V2XV2XVXIVX2VXVX2VXVX2VZVX6VZXZX9VXVX3V2X2VX2V2XRX3QX4G2XG7XG2X2GXV2XV3XVXV2XZIX5IXQX4VGV2IXGIX2GZ2G4RX7ZX11IX3IVX7ZX3IX3GQVIVX2GZXQ4ZXIQXIQ2X3GX2Q5RX2I2X2QVX5VX9Q2XQVGI2XQX2ZI2QIX2QXIQX3QX2QX2IQX8IX6QXQ2X4QX3V2IZXQXGZX5QZXZX2IXQIX2IGIX2GIX2IRX2VX10GRX3VX2IVIXIX2ZX2IX3Z2QRX2GQ2IX2GXIX2G2XGX5IX4GX14ZVGZXZX4IXVZVX2QXQX2IXZX2VXQX3GX3GXGX2GX2VX12ZIX3G3XZXGXVQX2QX2IX2QX7QX2IX2VXI2XIXGIX2VX5VX4I2ZVIZX2GXVX4VXQIXRQX6QGX3VQX4IGXR2X3VX3VX9VX2VX3IXIX6RXGQX2VXZGVXGQIXRXVXVIX2GX2VX2IX2VIX2RGXVX8IX3RVRVX4GXGX3IGVGX2RXG2X2QX3QIX2GIGX3RX3IX6RIVX4QX2GXRXGX3I2XZ3QX3GXIQX2GXIGXGXQXGQ2IX2IX10QX8QX3Q2IXQZQX2GQXZXGXIX4IGX4I2X3I2X14VX6QX2QI2RZ2XQXZXZX3GXIZX2Z2XQXIZI3X2GQ2X3VX10IX3IRQXIVXIZGXIQIX2VQX2RX2QX2ZG2X2ZQZX9QX5GIX4I2X4QX2I2Z2RX2IX2QI3Z2X2V2X3RIX2IRGZX3IX12VX4IX6GXI2ZXQGI2X2GVX4VZXQGZRZGRX2QXQX2IGQ2X2QXIX8GXIX2GQIX2GXGVQXZX5ZXGIX3GQX3GX2QGQX5IR2VX3IX2RX6ZXIQXIZXQZ2IXIX2VGZIZXIQZXGXIXIXRX2QX3VXRIX5RX3VX5V3XRQV2RXVZXV2X3QRX2RXIVXIZVIZXIVIRX2QZQ2Z2XVIRXG2R2X3V2XIX5GQX9ZV3GX2VXZXVX4VIV2RXV2QVX5GQX2QV2X3VX3IGQXVXG2IXGZXGXZQXIZ2X3GVGX3IX2ZGIZVQRXZQZGQXIX8RX5IGXQX2IXIX2QVX2GIXQGQZQIGXGZVGX3IRIG2X2QZ2X3RX2VXIX4IGXI4ZXVXZXGXZGIXGX5IVIX2IX4ZVZ2VQVXQX2QX6GX7VXQX2QIVXZ2QX3ZGXQGX5QIX2GXRX2QZX2QXQX3QXQX6QX8I3XGX4GX2IZX2IX3GX2ZXGX2RXZI2QZXZX4IZX5QX11ZXGQXGZX2ZRX2QXGX2ZXRXGX3GX2RIZ2XZX2QXI2GX2ZVXVX2GXRX2QX2QXVX5IZXIGX2RX4QXIGQZI2GI2X4ZX2ZXIXIG2QXZGXGX7V3X6VXZX2ZV2ZRX3G2X4RX2IZX3ZIZXIX2QX3QXZ2QX3QX6VRIX2QV2ZV2ZGVXV2XIXV2RQIGSIZVXVXIVQV2QXVI2V3Z2X2VIV2X7GXGIQXVIZX7RZX3VZIQX3IX2ZVQXZXQGX2IX6VX2IX6QXVX2QIZX2IQVRQIXRX2IR2XRVX2QXIXVXZX7QZX4ZIX12RX2QX2RXZXZRX2ZX3QZGXGXRQGX2IZGIQZQXZXZX2RG2ZQX2ZX3GX2VX2ZQZQX2R2GRQXRX2QX5IZXI2X2IXGZX3Q2GQXQIX3QX2ZXQX2QX2GX3GX5IXQX2GZXZX2RX3IZQIXIGXQXZXGX3GX3GXGXZXZG2X2GX8GZQXZX3R2XV2ZXIVX2ZGV2X2RZQXZXZX3IXQZGZQX3RXZX2GXGXGX3VQXV2XVQX4QZVQXVZ2QXVXV2QX2GXVGXV2RVZX2ZX2RVXIVXV2QGX4VIX3GIX4QXGXQXQXRXQXQIX2IZGIXQGZXQXRGQG2X2GR2QX3RX9GQRZGXQX6GX2IXRX6IG2RXQX3IX3ZXRX7ZQ2XVX4VIXIVRXIXVXVG2XZVZXZ2IVG3IGI2XVXVX2VGZXV3ZV3X3IX12VX4VX3IX2GIXGVXZIXVIGZX2GXIXVRX3VXZG2XZX3QGXZX2QXIXG2X3ZX8GQ2XQIGZ2XZ3X5ZGXGXRXGXGX2VIX2QXZXGX6GX4G2XGRGRZ2XQXGVRZVXIRXVGXRGVZIXGXRVX3QZ2XV2XQ2XIXZX4VZX4VX4IXGX2IG2IX5VGXGQX2GX2GXIX2IXQXVGX3IG2XGQZXVXVX6IXZX4GIX5GIZ2X2ZX2GXG3X8GZ2XQGXZX4VX12VX3GQX2VX2VQ2GQ3ZGZX3VGX2ZX2V2GXRZGX2QX2I2X2ZX3QX2VGXVX3GX12IX2ZIQ2XG3XGQX4IQXZX7RQXRXVX2GX2V2X4VX2VXVX6QVZX2IX2VX3ZX4VX2G3X2VX3VXRX2IXV3XGX6IRXIX4IRGX5VX3VXZXQGXIV2XQXV2GQGRX2GZX2ZXZXIX13R2X2ZX2GXVXVIGXIX2RX4R2XIXZX3GX4IXRX4IX4GX2IX4RXIXIX7QX3RXVQXIXZQXVX8QX2Z3X3RXZX3QX3GX2IX2RX15RXIX2RIX2IZX2ZX2GZXVXGX2V2X14IX12RX2RXIG2RI2RGX2RXQX8GXRXRV2XQZX9IXR2X6R3X5RIXZXZ2X4GIX3IXZGZXVZX3R2XZX5GX11IX8QRX2QXRIGXRX2ZX2ZIZ2RX2GZXZXZGR2GX3RIXIX6ZX2VXGXVXVX4VX3VX2VXVIXGIXV2ZX2VXRIX2VIZX4VX3VX4V2XVX11IX2IX2IXIX3IXGRXIGX2G2RIX2ZXGX2GQXQX7IX5RX2RX3IX10IX5QX8ZIX9ZX4RX5RX8QX3IXIXIX6IXIX9QX7QX8IX11IXIX2',
  'X67I46X10GX3GX10IX10I2Q2X7IX11GX3GX5GSGX2IX2QX7IX10I2QIX7IX5IX5IX2GVGX5GX3IXQ2Z3X4IX10I4X7IX2IX2IX2IX2IX3GX10IX2ZI2Z2X3IX3ZX6I2X9IX5IX5IX14IX2ZI3Z2X2IX10I2X9IX5IX5IX8IGI5X2Z2I3Z2XIX10I2X9IQI15GIX2IX5IX3Z2I3ZXIX10I2X27IX2IX10Z2I2ZXIX10I2X14ZX6I5XIX2IX2I3X6Z3Q2X11I2X25IXIX2IXIX2I2XZX6QX12I2X21I3X3IX2IX2QXIX3Z2X8IX8G2X9IX13I3XIX2IX2IQX5Z2X6QIQX3ZX3G2X21IX3IXIX2IXI2X2IX10I5X6I2X21I3X3IX2IX2I3X12QIQX7I2X2I2X21IXIX2IX18IX8I2X3IX17I5XIX2IX5IXQ2X18I2XIXIX23IX2IGI5XQ2X6ZX11I2QIXIX17I5GIX8IX2QX18I2XIXIX8IX8IX14I5QI3X13I2XIXIX4ZX3QX8IX10GX3IX3IX3IX11I4X2QIX7I3X7IX3GX5GVGX2IX3IX3IX11IQI2X2I2X17IX2GVGX5GX3GX7IX11Q2I2X21GX3GX10I46X67R2040',



], duelsLevels = [
  'X311AX38BX331RX5ZX49RX10ZXQX34Z2X11QX10ZX19ZX24RX2RX4ZXRX8QX4RX30GX20RX4ZX9ZX17QX4GX30QX3ZX8ZX11QXGX5RX34GX14ZX8RX7ZX3RX7GXQRX18GX20RX2RX4RX4QXRX39RX7RX14ZX2RX21Z2X11GRGX6RX14RX4ZX8RXRGX13RX3RX2R2QX3RX8QX6RX5GX50RX10ZX14GX9RX4QX5GX8QX5ZX3ZX5RX2RX19RX14GX7ZX3GQX7ZXQX7RX22RX3QX3RX6ZXRX6QX10RX14GX2RX4RX11RX5ZX3QX14QX12QX14ZX2RX22QX4RX23RX6RX7Z2X3ZX4RX3ZX12GX14QZX7QZX17ZX11RX10RX14RX4ZX5ZX5ZX16RGX2RX26RX24QX3RX17R2X2ZX2GX32RX22GX13ZX10RX45RX14ZRX21RX9QX57RX16ZXZX19RX31RX7RX21RX19ZX10ZX22ZX27RX17QX4GX12RX3RX5ZX11RX2Q2X8QX8RX14GX16RX8GXRX7ZX22QRQX23ZX3GX10RX4QX15RXGX17QX6ZX13ZX10ZXZXRX65RX20RX10ZGX25RXRX9ZX13ZX7GX17ZX9ZX7ZX15RXGX4RX15QX8RX3GX10GX4GXRXZR2XQX9QX3ZX4QX7RX2RX12GX9ZX8ZX2RX3ZX14RX8RXRX45GXRXZX3RXR2ZRX13ZX11GX13RX5QGX2ZX5RX8ZX15RX25RX8GX3ZX23GX3ZX5RX11R2X33R2X3GZX3QX10GRX6RX3RX27RX25GX2ZX5ZX25RX8ZX11RX5ZX51ZX3RX7GX76',
], tdmLevels = [
  'X311AX38BX331RX5ZX49RX10ZXQX34Z2X11QX10ZX19ZX24RX2RX4ZXRX8QX4RX30GX20RX4ZX9ZX17QX4GX30QX3ZX8ZX11QXGX5RX34GX14ZX8RX7ZX3RX7GXQRX18GX20RX2RX4RX4QXRX39RX7RX14ZX2RX21Z2X11GRGX6RX14RX4ZX8RXRGX13RX3RX2R2QX3RX8QX6RX5GX50RX10ZX14GX9RX4QX5GX8QX5ZX3ZX5RX2RX19RX14GX7ZX3GQX7ZXQX7RX22RX3QX3RX6ZXRX6QX10RX14GX2RX4RX11RX5ZX3QX14QX12QX14ZX2RX22QX4RX23RX6RX7Z2X3ZX4RX3ZX12GX14QZX7QZX17ZX11RX10RX14RX4ZX5ZX5ZX16RGX2RX26RX24QX3RX17R2X2ZX2GX32RX22GX13ZX10RX45RX14ZRX21RX9QX57RX16ZXZX19RX31RX7RX21RX19ZX10ZX22ZX27RX17QX4GX12RX3RX5ZX11RX2Q2X8QX8RX14GX16RX8GXRX7ZX22QRQX23ZX3GX10RX4QX15RXGX17QX6ZX13ZX10ZXZXRX65RX20RX10ZGX25RXRX9ZX13ZX7GX17ZX9ZX7ZX15RXGX4RX15QX8RX3GX10GX4GXRXZR2XQX9QX3ZX4QX7RX2RX12GX9ZX8ZX2RX3ZX14RX8RXRX45GXRXZX3RXR2ZRX13ZX11GX13RX5QGX2ZX5RX8ZX15RX25RX8GX3ZX23GX3ZX5RX11R2X33R2X3GZX3QX10GRX6RX3RX27RX25GX2ZX5ZX25RX8ZX11RX5ZX51ZX3RX7GX76',
];

const logger = fs.createWriteStream('log.txt', {flags: 'a'}), log = l => logger.write(`${l}\n`);
const hasAccess = (username, clearanceLevel) => { // 1 => full auth only, 2 => admins and above, 3 => vips and above, 4 => any
  const isAdmin = Storage.admins.includes(username), isVIP = Storage.vips.includes(username);
  return (clearanceLevel === 4 || Storage.owners.includes(username)) || (clearanceLevel === 3 && (isVIP || isAdmin)) || (clearanceLevel === 2 && isAdmin);
}
const auth = async(username, token) => {
  const response = await fetch('http://'+settings.authserver+`/verify?username=${username}&token=${token}`);
  const text = await response.text();
  console.log(text);
  return text === 'true';
}, clean = msg => msg.split(' ').reduce((a, word) => a.concat([Storage.filter.some(badword => word.toLowerCase().includes(badword)) ? '@!#$%' : word]), []).join(' ');
const deathMessages = [
  `{victim} died from {killer}`,
  `{victim} was killed by {killer}`,
  `{victim} was put out of their misery by {killer}`,
  `{victim} was assassinated by {killer}`,
  `{victim} was comboed by {killer}`,
  `{victim} was eliminated by {killer}`,
  `{victim} was crushed by {killer}`,
  `{victim} was sniped by {killer}`,
  `{victim} was exploded by {killer}`,
  `{victim} was executed by {killer}`,
  `{victim} was deleted by {killer}`,
  `{victim} proved no match for {killer}`,
  `{victim} was outplayed by {killer}`,
  `{victim} was obliterated by {killer}`,
  `{victim} fell prey to {killer}`,
  `{victim} was fed a healthy dose of explosives by {killer}`,
  `{victim} became another number in {killer}'s kill streak`,
  `{victim} got wrecked by {killer}`,
], joinMessages = [
  `{idot} is here`,
  `{idot} arrived`,
  `{idot} is no longer afk`,
  `{idot} exists for some reason`,
  `{idot} joined the game`,
  `{idot} is now online`,
  `{idot} has joined the battle`,
  `{idot}`,
], rageMessages = [
  `{idot} went to play minecraft instead`,
  `{idot} touched grass`,
  `{idot} didnt like the game`,
  `{idot} gave up`,
  `{idot} left the game`,
  `{idot} quit`,
  `{idot} disconnected`,
  `{idot} lost connection`,
  `{idot} didn't make it out alive`,
], tipMessages = [
  `TIP: Try switching your class, maybe you're not good at that one!`,
  `TIP: These tips get shown when you die!`,
  `TIP: Blame the lag`,
  `TIP: If fighting is sure to result in victory then you must fight! -Sun Tzu`,
  `TIP: Doing damage increases your chance of survival while decreasing your enemy's chance of survival`,
  `TIP: Taking damage reduces your chance of survival`,
  `TIP: Try dodging the bullets next time!`,
  `That was unwinnable, don't worry`,
  `TIP: don't die!`,
  `TIP: If you are in a block, press ESC and then press the LEAVE button. Works every time!`,
  `Bad internet? Hit the router with a wrench. Trust me :)`,
  `Must've been your keyboard`,
  `TIP: Try Using a mouse next time`,
  `How embarrassing...`,
  `TIP: Do better? idk I'm not paid enough for this...`,
  'There are items, abilities, and classes that can assist you',
  'RIP: Rest in Pineapple',
];

class Multiplayer extends Engine {
  constructor(l) {
    super(l);
    Object.defineProperty(this, 'global', {get: () => this.rawglobal, set: (v) => {
      this.rawglobal = v;
      for (const t of this.pt) {
        t.msg.global = v;
        this.send(t);
      }
    }, configurable: true});
  }
  override(t, ox, oy) {
    this.updateEntity(t, Tank.u);
    this.loadCells(t, t.x, t.y, 80, 80);
    if (t.socket && (Math.floor((ox+40)/100) !== Math.floor((t.x+40)/100) || Math.floor((oy+40)/100) !== Math.floor((t.y+40)/100))) this.chunkload(t, ox, oy, t.x, t.y);
    t.socket.send({event: 'override', data: [{key: 'x', value: t.x}, {key: 'y', value: t.y}]});
  }
  chunkload(t, ox, oy, x, y) {
    const w = 21, h = 15;
    const ocx = Math.floor((ox+40)/100)+.5, ocy = Math.floor((oy+40)/100)+.5, ncx = Math.floor((x+40)/100)+.5, ncy = Math.floor((y+40)/100)+.5;
    const xd = ocx-ncx, yd = ocy-ncy, yda = yd < 0 ? -1 : 1, xda = xd < 0 ? -1 : 1, yl = Math.min(h, Math.abs(yd))*yda;
    const ymin = ncy-h/2, ymax = ncy+h/2-1, xmin = ncx-w/2, xmax = ncx+w/2-1;
    for (let nys = (yda > 0 ? 0 : -1)+ncy-h/2*yda, y = m(nys), l = false; (yda > 0 ? (y < m2(nys+h*yda)) : (y > m2(nys+h*yda))); y += yda) {
      if (yda < 0 ? y <= nys+yl : y >= nys+yl) l = true;
      for (let nxs = (xda > 0 ? 0 : -1)+ncx-w/2*xda, x = m(nxs); (xda > 0 ? (x < m2(nxs+(l ? Math.min(w, Math.abs(xd)) : w)*xda)) : (x > m2(nxs+(l ? Math.min(w, Math.abs(xd)) : w)*xda))); x += xda) {
        for (const e of this.cells[x][y]) this.load(t, e);
      }
    }
    for (let oys = (yda > 0 ? -1 : 0)+ocy+h/2*yda, y = m(oys), l = false; (yda < 0 ? (y < m2(oys-h*yda)) : (y > m2(oys-h*yda))); y -= yda) {
      if (yda > 0 ? y <= oys-yl : y >= oys-yl) l = true;
      for (let oxs = (xda > 0 ? -1 : 0)+ocx+w/2*xda, x = m(oxs); (xda < 0 ? (x < m2(oxs-(l ? Math.min(w, Math.abs(xd)) : w)*xda)) : (x > m2(oxs-(l ? Math.min(w, Math.abs(xd)) : w)*xda))); x -= xda) {
        entity: for (const e of this.cells[x][y]) {
          for (const cell of e.cells) {
            const c = cell.split('x');
            if (xmin <= c[0] && c[0] <= xmax && ymin <= c[1] && c[1] <= ymax) continue entity;
          }
          this.unload(t, e);
        }
      }
    }
    this.send(t);
  }

  add(socket, data) {
    data.socket = socket; // this can moved to the join handler?
    log(`${socket.username} joined`); // this.logs.push and log can be merged?
    this.logs.push({m: this.joinMsg(data.username), c: '#66FF00'});
    super.add(data);
  }

  send(t) {
    if (busy && t.busy) return t.delayed = true;
    if (upsl && t.lastSend && t.lastSend+1000/settings.upsl > Date.now()) {
      clearTimeout(t.sendTimer);
      t.sendTimer = setTimeout(() => this.send(t), (t.lastSend+1000/settings.upsl)-Date.now());
    }
    t.msg.logs = this.logs.slice(t.logs).concat(t.privateLogs);
    t.logs = this.logs.length;
    t.privateLogs.length = 0;
    if (t.msg.logs.length || t.msg.u.length || t.msg.d.length || t.msg.global) {
      t.busy = true;
      t.delayed = false;
      t.socket._send(pack(t.msg), {}, () => {
        t.busy = false;
        if (t.delayed) this.send(t);
      });
      t.lastSend = Date.now();
      t.msg.u.length = t.msg.d.length = 0;
      t.msg.global = t.msg.logs = undefined;
    }
  }
  loadCells(e, ex, ey, w, h) { // optimize
    const old = e.cells ? A.template('arr').concat(...e.cells) : null;
    super.loadCells(e, ex, ey, w, h);
    for (const t of this.pt) {
      const mx = Math.floor((t.x+40)/100)-10, my = Math.floor((t.y+40)/100)-7, w = 21, h = 15;
      let o = false, n = false;
      if (old) for (const cell of old) {
        const a = cell.split('x');
        if (mx <= a[0] && a[0] < mx+w && my <= a[1] && a[1] < my+h) o = true;
      }
      for (const cell of e.cells) {
        const a = cell.split('x');
        if (mx <= a[0] && a[0] < mx+w && my <= a[1] && a[1] < my+h) n = true;
      }
      if (n && !o) this.load(t, e); else if (o && !n) this.unload(t, e); else continue;
      this.send(t);
    }
  }
  updateEntity(e, c) {
    for (const t of this.pt) {
      const mx = Math.floor((t.x+40)/100)-10, my = Math.floor((t.y+40)/100)-7, w = 21, h = 15;
      for (const cell of e.cells) {
        const a = cell.split('x');
        if (mx <= a[0] && a[0] < mx+w && my <= a[1] && a[1] < my+h) {
          this.merge(t, e, c);
          this.send(t);
        }
      }
    }
  }
  static num = n => typeof n !== 'number' ? n : Math.round(n*10)/10;
  load(t, e) {
    let i = t.msg.u.findIndex(u => u[0] === e.id);
    if (i !== -1) t.msg.u.splice(i, 1);
    t.msg.d.r(e.id);
    t.msg.u.push(e.constructor[e.type === 'barrier' || e.type === 'void' ? 'raw2' : 'raw'].reduce((a, c) => a.concat(c, Multiplayer.num(e[c])), A.template('arr').concat(e.id)));
  }
  unload(t, e) {
    let i = t.msg.u.findIndex(u => u[0] === e.id);
    if (i !== -1) t.msg.u.splice(i, 1);
    t.msg.d.push(e.id);
  }
  merge(t, e, c) {
    let i = t.msg.u.findIndex(u => u[0] === e.id);
    if (i !== -1) {
      c = A.template('arr').concat(c);
      for (let l = 1; l < t.msg.u[i].length; l += 2) {
        let m = c.indexOf(t.msg.u[i][l]);
        if (m !== -1) {
          t.msg.u[i][l+1] = Multiplayer.num(e[t.msg.u[i][l]]);
          c.splice(m, 1);
        }
      }
      for (const p of c) t.msg.u[i].push(p, Multiplayer.num(e[p]));
    } else t.msg.u.push(c.reduce((a, p) => {
      a.push(p, e[p]);
      return a;
    }, A.template('arr').concat(e.id)));
  }
  destroyEntity(e) {
    pt: for (const t of this.pt) {
      const mx = Math.floor((t.x+40)/100)-10, my = Math.floor((t.y+40)/100)-7, w = 21, h = 15;
      for (const cell of e.cells) {
        const c = cell.split('x');
        if (mx <= c[0] && c[0] < mx+w && my <= c[1] && c[1] < my+h) {
          t.msg.d.push(e.id);
          this.send(t);
          continue pt;
        }
      }
    }
  }
  disconnect(socket, code, reason) {
    let team, isLeader;
    this.pt = this.pt.filter(t => {
      if (t.username === socket.username) {
        team = Engine.getTeam(t.team);
        isLeader = t.team.includes('@leader');
        for (const cell of t.cells) {
          const [x, y] = cell.split('x');
          this.cells[x][y].delete(t);
        }
        if (t.grapple) t.grapple.bullet.destroy();
        this.destroyEntity(t);
        t.release();
        return false;
      }
      return true;
    });
    for (let i = this.ai.length-1; i >= 0; i--) if (Engine.getUsername(this.ai[i].team) === socket.username) this.ai[i].destroy();
    log(`${socket.username} left`);
    this.logs.push({m: this.rageMsg(socket.username), c: '#E10600'});
    if (this.pt.length === 0) {
      this.i.forEach(i => clearInterval(i));
      delete servers[socket.room];
    } else if (isLeader) for (const t of this.pt) if (Engine.getTeam(t.team) === team) return t.team += '@leader';
  }

  deathMsg(victim, killer) {
    log(`${killer} killed ${victim}`); // temp log file death
    return deathMessages[Math.floor(Math.random()*deathMessages.length)].replace('{victim}', victim).replace('{killer}', killer);
  }

  tipMsg(player, killer) {
    return tipMessages[Math.floor(Math.random()*tipMessages.length)].replace('{victim}', player).replace('{killer}', killer);
  }

  joinMsg(player) {
    return joinMessages[Math.floor(Math.random()*joinMessages.length)].replace('{idot}', player);
  }

  rageMsg(player) {
    return rageMessages[Math.floor(Math.random()*rageMessages.length)].replace('{idot}', player);
  }
}

class FFA extends Multiplayer {
  constructor() {
    super(ffaLevels);
  }
  ontick() {}
}

class DUELS extends Multiplayer {
  constructor() {
    super(duelsLevels);
    this.round = 1;
    this.mode = 0; // 0 -> waiting for other player, 1 -> 10 second ready timer, 2-> match active
    this.wins = {};
  }

  add(socket, data) {
    super.add(socket, data);
    if (this.pt.length === 1) {
      this.global = 'Waiting For Player...';
    } else {
      this.readytime = Date.now();
      this.mode++;
    }
  }

  ontick() {
    if ([0, 1].includes(this.mode)) {
      let ox = this.pt[0].x, oy = this.pt[0].y;
      this.pt[0].x = this.spawns[0].x;
      this.pt[0].y = this.spawns[0].y;
      this.override(this.pt[0], ox, oy);
    }
    if (this.mode === 1) {
      let ox = this.pt[1].x, oy = this.pt[1].y;
      this.pt[1].x = this.spawns[1].x;
      this.pt[1].y = this.spawns[1].y;
      this.override(this.pt[1], ox, oy);
      this.global = 'Round '+this.round+' in '+(5-Math.floor((Date.now()-this.readytime)/1000));
      if (5-(Date.now()-this.readytime)/1000 <= 0) {
        for (let i = this.s.length-1; i >= 0; i--) if (this.s[i].type !== 'grapple') this.s[i].destroy();
        for (let i = this.ai.length-1; i >= 0; i--) this.ai[i].destroy();
        this.global = '======FIGHT======';
        this.mode = 2;
      }
    }
  }

  ondeath(t, m={}) {
    super.ondeath(t, m);
    this.wins[m.username] = this.wins[m.username] === undefined ? 1 : this.wins[m.username]+1;
    if (this.wins[m.username] === 3) {
      this.global = m.username+' Wins!';
      setTimeout(() => {
        t.socket.send({event: 'gameover', type: 'defeat'});
        m.socket.send({event: 'gameover', type: 'victory'});
        t.socket.close();
        m.socket.close();
      }, 5000);
    } else {
      this.global = m.username+' Wins Round '+this.round;
      setTimeout(() => {
        this.pt.forEach(tank => {
          clearInterval(tank.fireInterval);
          clearTimeout(tank.fireTimeout);
          tank.hp = tank.maxHp;
          tank.shields = 0;
          tank.ded = false;
          tank.socket.send({event: 'ded'});
        });
        for (let i = this.s.length-1; i >= 0; i--) this.s[i].destroy();
        for (let i = this.ai.length-1; i >= 0; i--) this.ai[i].destroy();
        this.d = [];
        this.levelReader(duelsLevels[0]);
        this.round++;
        this.mode = 1; 
        this.readytime = Date.now();
      }, 5000);
    }
  }

  disconnect(socket, code, reason) {
    if ([1, 2].includes(this.mode)) {
      this.round = 1;
      this.mode = 0;
      this.wins = {};
    }
    this.pt.forEach(t => {
      t.socket.send({event: 'ded'}); // heal and reset cooldowns
      t.hp = t.maxHp;
    }); 
    super.disconnect(socket, code, reason);
  }
}

class TDM extends Multiplayer {
  constructor() {
    super(['SX3599'])
    this.global = '===Waiting For Players===';
    this.round = 1;
    this.mode = 0; // 0 -> Lobby/Waiting for players, 1 -> About to enter round, 2 -> in game
    this.wins = {RED: 0, BLUE: 0};
  }

  add(socket, data) {
    super.add(socket, data);
    const t = this.pt[this.pt.length-1];
    let red = 0, blue = 0;
    this.pt.forEach(tank => {
      if (tank.color === '#FF0000') red++; else blue++;
    });
    if (red > blue) t.color = '#0000FF';
    if (red < blue) t.color = '#FF0000';
    if (red === blue) t.color = (Math.random() < .5 ? '#FF0000' : '#0000FF');
    t.team = t.username+':LOBBY';
    if (this.pt.length === 4) {
      this.readytime = Date.now();
      this.time = 60; // 1 minute starting time
    }
  }

  ontick() {
    if (this.mode === 0) {
      if ((this.time-(Date.now()-this.readytime)/1000) <= 0) {
        this.mode = 1; // game start
        for (let i = this.s.length-1; i >= 0; i--) this.s[i].destroy();
        for (let i = this.ai.length-1; i >= 0; i--) this.ai[i].destroy();
        this.readytime = Date.now();
        this.time = 5;
        this.pt.forEach(t => {
          clearInterval(t.fireInterval);
          clearTimeout(t.fireTimeout);
          t.shields = 0;
          t.team = t.username+':'+(t.color === '#FF0000' ? 'RED' : 'BLUE');
          t.socket.send({event: 'ded'});
        });
        this.levelReader(tdmLevels[Math.floor(Math.random()*tdmLevels.length)]);
      } else if (this.pt.length >= 4) this.global = this.time-Math.floor((Date.now()-this.readytime)/1000);
    } else if (this.mode === 1) {
      this.pt.forEach(t => {
        const spawn = Engine.getTeam(t.team) === 'BLUE' ? 0 : 1;
        let ox = t.x, oy = t.y;
        t.x = this.spawns[spawn].x;
        t.y = this.spawns[spawn].y;
        this.override(t, ox, oy);
      });
      this.global = 'Round '+this.round+' in '+(this.time-Math.floor((Date.now()-this.readytime)/1000));
      if ((this.time-(Date.now()-this.readytime)/1000) <= 0) {
        this.global = '======(RED)'+this.wins.RED+' v.s '+this.wins.BLUE+'(BLUE)======';
        this.mode = 2;
        this.pt.forEach(t => t.socket.send({event: 'ded'}));
      }
    }
  }

  ondeath(t, m={}) {
    super.ondeath(t, m);
    let allies = 0;
    this.pt.forEach(tank => {
      if (!tank.ded) {
        if (Engine.getTeam(tank.team) === Engine.getTeam(t.team)) {
          allies++;
        }
      }
    });
    if (allies === 0) {
      const winner = Engine.getTeam(t.team) === 'BLUE' ? 'RED' : 'BLUE';
      this.wins[winner]++;
      if (this.wins[winner] === 3) {
        this.global = winner+' Wins!';
        setTimeout(() => {
          this.pt.forEach(t => {
            t.socket.send({event: 'gameover', type: winner === Engine.getTeam(t.team) ? 'victory' : 'defeat'});
            t.socket.close();
          });
        }, 5000);
      } else {
        this.global = winner+' Wins Round '+this.round;
        setTimeout(() => {
          this.pt.forEach(tank => {
            clearInterval(tank.fireInterval);
            clearTimeout(tank.fireTimeout);
            tank.hp = tank.maxHp;
            tank.shields = 0;
            tank.ded = false;
          });
          for (let i = this.s.length-1; i >= 0; i--) this.s[i].destroy();
          for (let i = this.ai.length-1; i >= 0; i--) this.ai[i].destroy();
          this.d = [];
          this.levelReader(tdmLevels[Math.floor(Math.random()*tdmLevels.length)]);
          this.round++;
          this.mode = 1; 
          this.readytime = Date.now();
        }, 5000);
      }   
    }
  }

  disconnect(socket, code, reason) {
    const v = this.pt.find(t => t.username === socket.username);
    const m = this.pt.find(t => Engine.getTeam(t.team) !== Engine.getTeam(v.team));
    this.ondeath(v, m);
    super.disconnect(socket, code, reason);
  }
}

class Defense extends Multiplayer {
  constructor() {
   super([[["B0","B0","B0","B0","B0","B0","B3","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0"],["B0","B6","B0","B0","B3","B0","B3","B0","B3","B0","B0","B0","B0","B4","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B0","B6","B0"],["B0","B0","B0","B0","B3","B0","B0","B0","B3","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B3","B3","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B6","B0","B0","B3","B3","B3","B3","B3","B3","B4","B4","B0","B5","B5","B5","B5","B5","B5","B0","B7","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B3","B1","B1","B1","B1","B1","B1","B1","B3","B0","B5","B5","B5","B5","B5","B5","B0","B4","B0"],["B3","B3","B0","B5","B5","B5","B0","B0","B4","B0","B0","B3","B1","B1","B1","B1","B1","B1","B1","B3","B0","B7","B0","B0","B5","B5","B5","B0","B4","B0"],["B0","B0","B0","B5","B5","B5","B0","B0","B4","B0","B0","B1","B1","B1","B1","B1","B1","B1","B1","B3","B0","B4","B0","B0","B5","B5","B5","B0","B4","B0"],["B0","B3","B3","B5","B5","B5","B7","B4","B4","B0","B0","B0","B3","B3","B3","B3","B3","B3","B3","B0","B0","B4","B4","B4","B5","B5","B5","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B1","B0","B0","B0","B0","B6","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B1","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B1","B4","B4","B4","B4","B4","B4","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B4","B4","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B1","B0","B0","B0","B0","B0","B0","B4","B4","B4","B4"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B1","B4","B3","B3","B3","B3","B3","B0","B4","B1","B0","B2","B2","B2","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B4","B0","B0","B2","B2","B0","B0","B1","B4","B0","B1","S","B0","B1","B0","B4","B1","B0","B0","B6","B0","B0","B0","B4","B0","B0","B0"],["B0","B0","B0","B4","B0","B0","B0","B6","B0","B0","B1","B4","B0","B1","B0","B0","B1","B0","B4","B1","B0","B0","B2","B2","B0","B0","B4","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B2","B2","B2","B0","B1","B4","B0","B3","B3","B3","B3","B3","B4","B1","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B4","B4","B4","B4","B0","B0","B0","B0","B0","B0","B1","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B4"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B4","B4","B4","B4","B4","B1","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B1","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B6","B0","B0","B0","B0","B1","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B5","B5","B5","B4","B4","B4","B0","B0","B0","B3","B3","B3","B3","B3","B3","B0","B0","B0","B4","B4","B7","B5","B5","B5","B3","B3","B0"],["B0","B4","B0","B5","B5","B5","B0","B0","B4","B0","B0","B3","B1","B1","B1","B1","B1","B1","B1","B0","B0","B4","B0","B0","B5","B5","B5","B0","B0","B0"],["B0","B4","B0","B5","B5","B5","B0","B0","B7","B0","B0","B3","B1","B1","B1","B1","B1","B1","B3","B0","B0","B4","B0","B0","B5","B5","B5","B0","B3","B3"],["B0","B4","B0","B5","B5","B5","B5","B5","B5","B0","B0","B3","B1","B1","B1","B1","B1","B1","B3","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B7","B0","B5","B5","B5","B5","B5","B5","B0","B0","B4","B4","B3","B3","B3","B3","B3","B0","B0","B6","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B3","B3","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B3","B0","B0","B0","B3","B0","B0","B0","B0"],["B0","B6","B0","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B4","B0","B0","B0","B0","B3","B0","B3","B0","B3","B0","B0","B6","B0"],["B0","B0","B0","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B3","B0","B0","B0","B0","B0","B0"]]]);
    this.global = 'Waiting for Players...';
    this.wave = 1;
    this.mode = 0; // 0 -> Lobby/Waiting for players, 1 -> Interwave period, 2 -> in game
    this.readytime = Date.now();
    this.time = 10;
  }

  add(socket, data) {
    super.add(socket, data);
    const t = this.pt[this.pt.length-1];
    t.team = data.username+(this.mode === 0 ? ':LOBBY' : ':PLAYERS');
  }

  startNewWave() {
    for (const t of this.pt) {
      clearInterval(t.fireInterval);
      clearTimeout(t.fireTimeout);
      t.ded = false;
      t.hp = t.maxHp;
      t.shields = 0;
      t.socket.send({event: 'ded'});
    }
    let wavePoints = this.wave*50, spawnable = [];
    // spawn generation will be based off of this.cells
    for (const x in this.cells) {
      for (const y in this.cells[x]) {
        let canSpawn = true;
        for (const entity of this.cells[x][y]) if (entity instanceof Block) canSpawn = false;
        if (canSpawn) spawnable.push({x, y});
      }
    }
    const amount = Math.floor(Math.random()*wavePoints/10);
    for (let i = 0; i < amount; i++) {
      const spawn = spawnable[Math.floor(Math.random()*spawnable.length)];
      wavePoints -= 10;
      const rank = Math.max(0, Math.min(20, Math.floor(Math.random()*wavePoints/2)));
      wavePoints -= rank*2;
      A.template('AI').init(spawn.x+10, spawn.y+10, 1, rank, 'AI', this);
    }
    this.updateStatus();
  }

  ontick() {
    if (this.mode === 0) {
      if ((this.time-(Date.now()-this.readytime)/1000) <= 0) {
        this.mode++;
        for (const t of this.pt) t.team = t.team.split(':')[0]+':PLAYERS';
        for (let i = this.ai.length-1; i >= 0; i--) this.ai[i].destroy();
        this.levelReader([["B0","B0","B0","B0","B0","B0","B3","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0"],["B0","B6","B0","B0","B3","B0","B3","B0","B3","B0","B0","B0","B0","B4","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B0","B6","B0"],["B0","B0","B0","B0","B3","B0","B0","B0","B3","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B3","B3","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B6","B0","B0","B3","B3","B3","B3","B3","B3","B4","B4","B0","B5","B5","B5","B5","B5","B5","B0","B7","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B3","B1","B1","B1","B1","B1","B1","B1","B3","B0","B5","B5","B5","B5","B5","B5","B0","B4","B0"],["B3","B3","B0","B5","B5","B5","B0","B0","B4","B0","B0","B3","B1","B1","B1","B1","B1","B1","B1","B3","B0","B7","B0","B0","B5","B5","B5","B0","B4","B0"],["B0","B0","B0","B5","B5","B5","B0","B0","B4","B0","B0","B1","B1","B1","B1","B1","B1","B1","B1","B3","B0","B4","B0","B0","B5","B5","B5","B0","B4","B0"],["B0","B3","B3","B5","B5","B5","B7","B4","B4","B0","B0","B0","B3","B3","B3","B3","B3","B3","B3","B0","B0","B4","B4","B4","B5","B5","B5","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B1","B0","B0","B0","B0","B6","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B1","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B1","B4","B4","B4","B4","B4","B4","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B4","B4","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B1","B0","B0","B0","B0","B0","B0","B4","B4","B4","B4"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B1","B4","B3","B3","B3","B3","B3","B0","B4","B1","B0","B2","B2","B2","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B4","B0","B0","B2","B2","B0","B0","B1","B4","B0","B1","S","B0","B1","B0","B4","B1","B0","B0","B6","B0","B0","B0","B4","B0","B0","B0"],["B0","B0","B0","B4","B0","B0","B0","B6","B0","B0","B1","B4","B0","B1","B0","B0","B1","B0","B4","B1","B0","B0","B2","B2","B0","B0","B4","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B2","B2","B2","B0","B1","B4","B0","B3","B3","B3","B3","B3","B4","B1","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B4","B4","B4","B4","B0","B0","B0","B0","B0","B0","B1","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B4"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B4","B4","B4","B4","B4","B1","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B1","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B6","B0","B0","B0","B0","B1","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B5","B5","B5","B4","B4","B4","B0","B0","B0","B3","B3","B3","B3","B3","B3","B0","B0","B0","B4","B4","B7","B5","B5","B5","B3","B3","B0"],["B0","B4","B0","B5","B5","B5","B0","B0","B4","B0","B0","B3","B1","B1","B1","B1","B1","B1","B1","B0","B0","B4","B0","B0","B5","B5","B5","B0","B0","B0"],["B0","B4","B0","B5","B5","B5","B0","B0","B7","B0","B0","B3","B1","B1","B1","B1","B1","B1","B3","B0","B0","B4","B0","B0","B5","B5","B5","B0","B3","B3"],["B0","B4","B0","B5","B5","B5","B5","B5","B5","B0","B0","B3","B1","B1","B1","B1","B1","B1","B3","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B7","B0","B5","B5","B5","B5","B5","B5","B0","B0","B4","B4","B3","B3","B3","B3","B3","B0","B0","B6","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B3","B3","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B3","B0","B0","B0","B3","B0","B0","B0","B0"],["B0","B6","B0","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B4","B0","B0","B0","B0","B3","B0","B3","B0","B3","B0","B0","B6","B0"],["B0","B0","B0","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B3","B0","B0","B0","B0","B0","B0"]]);
        this.i.push(setTimeout(() => {
          this.mode++;
          this.startNewWave();
        }, 10000));
      }
      this.global = 'Starting in '+(this.time-Math.floor((Date.now()-this.readytime)/1000));
    } else if (this.mode === 1) {
      this.global = '===Prepare for next wave===';
    }
  }

  useAbility(t, a) {
    super.useAbility(t, a);
    if (this.mode === 2) this.updateStatus();
  }

  updateStatus() {
    let enemies = 0;
    for (const ai of this.ai) if (Engine.getTeam(ai.team) === 'AI') enemies++;
    this.global = '===Wave #'+this.wave+' ('+enemies+' Enemies Left)===';
    if (enemies > 0) return;
    this.mode = 1;
    this.i.push(setTimeout(() => {
      this.mode++;
      this.wave++;
      this.startNewWave();
    }, 10000));
  }
  
  ondeath(t, m) {
    super.ondeath(t, m);
    if (t.socket) {
      let playerAlive = false;
      for (const t of this.pt) if (!t.ded) playerAlive = true;
      if (!playerAlive) {
        this.logs.push({m: 'You lost so crashing :) bc no rewards bc breadley is lazzzyyyyy', c: '#FFFFFF'});
        for (const t of this.pt) t.socket.close();
      }
    }
  }
}
const joinKey = {'ffa': FFA, 'duels': DUELS, 'tdm': TDM, 'defense': Defense};
let upsl = true, busy = true;
const Commands = {
  reload: [Object, 2, 2, function(data) {
    const t = servers[this.room].pt.find(t => t.username === data[1]);
    if (t) t.socket.send({event: 'force'});
  }],
  upsl: [Object, 2, 1, function(data) {
    const t = servers[this.room].pt.find(t => t.username === this.username);
    upsl = !upsl;
    t.privateLogs.push({m: 'UPSL is '+upsl, c: '#ffffff'});
  }],
  busy: [Object, 2, 1, function(data) {
    const t = servers[this.room].pt.find(t => t.username === this.username);
    busy = !busy;
    t.privateLogs.push({m: 'BUSY is '+busy, c: '#ffffff'});
  }],
  playerlist: [Object, 4, 1, function(data) {
    const t = servers[this.room].pt.find(t => t.username === this.username);
    for (const tank of servers[this.room].pt) t.privateLogs.push({m: tank.username, c: '#ffffff'});
  }],
  copylist: [Object, 4, 1, function(data) {
    const t = servers[this.room].pt.find(t => t.username === this.username)
    let s = '';
    for (const tank of servers[this.room].pt) s += tank.username+'   ';
    t.socket.send({status: 'error', message: s});
  }],
  requestunmute: [Object, 4, 1, function(data) {
    if (!Storage.mutes.includes(this.username)) return this.send({status: 'error', message: `You aren't muted!`});
    if (this.muteTimer && this.muteTimer+10000 > Date.now()) return this.send({status: 'error', message: `Wait 10 seconds before using this!`});
    this.muteTimer = Date.now();
    for (const s of Object.values(servers)) for (const t of s.pt) if (Storage.admins.includes(t.username) || Storage.owners.includes(t.username)) t.privateLogs.push({m: this.username+' requested to be unmuted!', c: '#ffff00'});
  }],
  msg: [Object, 4, -1, function(data) {
    if (Storage.mutes.includes(this.username)) return this.send({status: 'error', message: 'You are muted!'});
    const t = servers[this.room].pt.find(t => t.username === this.username), m = servers[this.room].pt.find(t => t.username === data[1]);
    const message = {m: `[${this.username}->${data[1]}] ${clean(data.slice(2).join(' '))}`, c: '#FFFFFF'};
    if (t) {
      t.privateLogs.push(message);
      servers[this.room].send(t);
    }
    if (m) {
      m.privateLogs.push(message);
      servers[this.room].send(m);
    }
  }],
  createteam: [FFA, 4, 2, function(data) {
    if (Storage.mutes.includes(this.username)) return this.send({status: 'error', message: `You can't make teams when you're muted!`});
    if (clean(data[1]) !== data[1]) return this.send({status: 'error', message: 'Team name contains profanity'});
    if (servers[this.room].pt.find(t => Engine.getTeam(t.team) === data[1])) return this.send({status: 'error', message: 'This team already exists.'});
    if (data[1].includes('@leader') || data[1].includes('@requestor#') || data[1].includes(':') || data[1].length > 20) return this.send({status: 'error', message: 'Team name not allowed.'});
    servers[this.room].pt.find(t => t.username === this.username).team = this.username+':'+data[1]+'@leader';
    for (const ai of servers[this.room].ai) if (Engine.getUsername(ai.team) === this.username) ai.team = this.username+':'+data[1];
  }],
  join: [FFA, 4, 2, function(data) {
    if (servers[this.room].pt.find(t => t.username === this.username).team.includes('@leader')) return this.send({status: 'error', message: 'You must disband your team to join. (/leave)'});
    if (!servers[this.room].pt.find(t => Engine.getTeam(t.team) === data[1] && t.team.includes('@leader'))) return this.send({status: 'error', message: 'This team does not exist.'});
    servers[this.room].pt.find(t => t.username === this.username).team += '@requestor#'+data[1];
    servers[this.room].logs.push({m: this.username+' requested to join team '+data[1]+'. Team owner can use /accept '+this.username+' to accept them.', c: '#0000FF'});
  }],
  accept: [FFA, 4, 2, function(data) {
    const leader = servers[this.room].pt.find(t => t.username === this.username), requestor = servers[this.room].pt.find(t => t.username === data[1]);
    if (!requestor) return this.send({status: 'error', message: 'Player not found.'});
    if (leader.team.includes('@leader') && requestor.team.includes('@requestor#') && Engine.getTeam(leader.team) === requestor.team.split('@requestor#')[1]) {
      requestor.team = data[1]+':'+Engine.getTeam(leader.team);
      for (const ai of servers[this.room].ai) if (Engine.getUsername(ai.team) === requestor.username) ai.team = requestor.username+':'+Engine.getTeam(requestor.team);
      servers[this.room].logs.push({ m: data[1]+' has joined team '+Engine.getTeam(leader.team), c: '#40C4FF' });
    }
  }],
  leave: [FFA, 4, 1, function(data) {
    const target = servers[this.room].pt.find(t => t.username === this.username), team = Engine.getTeam(target.team);
    servers[this.room].pt.forEach(t => {
      if (Engine.getTeam(t.team) === team && (target.team.includes('@leader') || this.username === t.username)) {
        t.team = t.username+':'+Math.random();
        for (const ai of servers[this.room].ai) if (Engine.getUsername(ai.team) === t.username) ai.team = t.username+':'+Engine.getTeam(t.team);
      }
    });
  }],
  freeze: [Object, 2, 2, function(data) {
    const t = servers[this.room].pt.find(t => t.username === data[1]);
    if (t) {
      const x = t.x, y = t.y;
      t.freezeInterval = setInterval(() => {
        let ox = t.x, oy = t.y;
        t.x = x;
        t.y = y;
        servers[this.room].override(t, ox, oy);
      }, 15);
    }
  }],
  unfreeze: [Object, 2, 2, function(data) {
    const t = servers[this.room].pt.find(t => t.username === data[1]);
    if (t) clearInterval(t.freezeInterval);
  }],
  filter: [Object, 3, 2, function(data) {
    if (!Storage.filter.includes(data[1].toLowerCase())) Storage.filter.push(data[1].toLowerCase());
  }],
  allow: [Object, 2, 2, function(data) {
    if (Storage.filter.includes(data[1].toLowerCase())) Storage.filter.splice(Storage.filter.indexOf(data[1].toLowerCase()), 1);
  }],
  t: [Object, 4, -1, function(data) {
    if (Storage.mutes.includes(this.username)) return this.send({status: 'error', message: 'You are muted!'}); 
    const team = Engine.getTeam(servers[this.room].pt.find(t => t.username === this.username).team), msg = {m: '[TEAM]['+this.username+'] '+clean(data.slice(1).join(' ')), c: '#FFFFFF'};
    for (const t of servers[this.room].pt) if (Engine.getTeam(t.team) === team) t.privateLogs.push(msg);
  }],
  gpt: [Object, 4, -1, function(data) {
    gpt({prompt: data.slice(1).join(' '), model: 'gpt-4'}, (err, data) => servers[this.room].pt.find(t => t.username === this.username).privateLogs.push({m: err === null ? data.gpt : err, c: '#DFCFBE'}));
  }],
  target: [Object, 2, 3, function(data) {
    const t = servers[this.room].pt.find(t => t.username === data[1]);
    for (let i = 0; i <= data[2]; i++) setTimeout(() => {servers[this.room].b.push(A.template('Block').init(t.x-50, t.y-50, 'airstrike', ':', servers[this.room]))}, i*1000);
  }],
  nuke: [Object, 2, 1, function(data) {
    for (let x = 0; x < 60; x += 2) for (let y = 0; y < 60; y += 2) servers[this.room].b.push(A.template('Block').init(x*100, y*100, 'airstrike', ':', servers[this.room]));
  }],
  arson: [Object, 3, 1, function(data) {
    for (let x = 0; x < 60; x++) for (let y = 0; y < 60; y++) servers[this.room].b.push(A.template('Block').init(x*100, y*100, 'fire', ':', servers[this.room]));
  }],
  newmap: [FFA, 3, -1, function(data) {
    let levelID = data[1] ? Number(data[1]) : Math.floor(Math.random()*ffaLevels.length);
    if (isNaN(levelID) || levelID % 1 !== 0 || levelID >= ffaLevels.length) return this.send({status: 'error', message: 'Out of range or invalid input.'});
    servers[this.room].levelReader(ffaLevels[levelID]);
    for (const t of servers[this.room].pt) {
      let ox = t.x, oy = t.y;
      t.x = servers[this.room].spawn.x;
      t.y = servers[this.room].spawn.y;
      servers[this.room].override(t, ox, oy);
    }
  }],
  ban: [Object, 2, -1, function(data) {
    if (Storage.admins.includes(data[1]) || Storage.owners.includes(data[1])) return this.send({status: 'error', message: `You can't ban another admin!`});
    Storage.bans.push(data[1]);
    let msg = ' banned by '+this.username+' for ' + (data[2] ? 'committing the felony: '+data.slice(2).join(' ') : 'no reason ez!');
    servers[this.room].logs.push({m: data[1]+' was'+msg, c: '#FF0000'});
    servers[this.room].pt.find(t => t.username === data[1])?.socket.send({status: 'error', message: 'You were'+msg});
    for (const socket of sockets) if (socket.username === data[1]) setTimeout(() => socket.close());
  }],
  banlist: [Object, 2, -1, function(data) {
    const t = servers[this.room].pt.find(t => t.username === this.username);
    t.privateLogs.push({m: '-----Ban List-----', c: '#00FF00'});
    for (const ban of Storage.bans) t.privateLogs.push({m: ban, c: '#00FF00'});
  }],
  pardon: [Object, 2, 2, function(data) {
    Storage.bans.splice(Storage.bans.indexOf(data[1]), 1);
    servers[this.room].logs.push({m: data[1]+' was pardoned by '+this.username, c: '#0000FF'});
  }],
  mute: [Object, 3, 2, function(data) {
    if (Storage.mutes.includes(data[1])) return this.send({status: 'error', message: 'They are already muted!'});
    Storage.mutes.push(data[1]);
    servers[this.room].logs.push({m: data[1]+' was muted by '+this.username, c: '#FFFF22'});
  }],
  unmute: [Object, 3, 2, function(data) {
    Storage.mutes.splice(Storage.mutes.indexOf(data[1]), 1);
    servers[this.room].logs.push({m: data[1]+' was unmuted by '+this.username, c: '#0000FF'});
  }],
  kick: [Object, 3, 2, function(data) {
    for (const socket of sockets) if (socket.username === data[1]) {
      socket.send({status: 'error', message: 'You have been kicked by '+this.username});
      setTimeout(() => socket.close());
    }
  }],
  kill: [Object, 2, -1, function(data) {
    for (const s of Object.values(servers)) {
      let t = s.pt.find(t => t.username === (data[1] || this.username));
      if (!t) return;
      t.immune = false;
      for (let i = 0; i < 2; i++) t.damageCalc(t.x, t.y, 6000, this.username);
    }
  }],
  killall: [Object, 2, 1, function(data) {
    for (const t of servers[this.room].pt) for (let i = 0; i < 2; i++) t.damageCalc(t.x, t.y, 6000, this.username);
  }],
  killai: [Object, 1, 1, function(data) {
    for (let i = servers[this.room].ai.length-1; i >= 0; i--) servers[this.room].ai[i].destroy();
  }],
  ai: [Object, 2, 7, function(data) {
    for (let i = 0; i < Number(data[5]); i++) A.template('AI').init(Math.floor(Number(data[1]) / 100) * 100 + 10, Math.floor(Number(data[2]) / 100) * 100 + 10, Number(data[3]), Math.min(20, Math.max(0, Number(data[4]))), data[6], servers[this.room]);
  }],
  spectate: [Object, 3, 2, function(data) {
    for (const server of Object.values(servers)) for (const t of server.pt) if (t.username === data[1]) t.ded = true;
  }],
  live: [Object, 3, 2, function(data) {
    for (const server of Object.values(servers)) for (const t of server.pt) if (t.username === data[1]) {
      t.hp = t.maxHp;
      t.ded = false;
    }
  }],
  switch: [TDM, 3, 2, function(data) {
    if (servers[this.room].mode === 0) for (const t of servers[this.room].pt) if (t.username === (data.length === 1 ? this.username : data[1])) t.color = t.color === '#FF0000' ? '#0000FF' : '#FF0000';
  }],
  start: [TDM, 3, 1, function() {
    if (servers[this.room].mode === 0) {
      servers[this.room].readytime = Date.now();
      servers[this.room].time = 0;
    }
  }],
  reboot: [Object, 2, 1, function() {
    for (const socket of sockets) socket.send({status: 'error', message: 'Restarting Server!'});
    process.exit(1);
  }],
  flushlogs: [Object, 2, -1, function() {
    fs.writeFileSync('log.txt', '');
  }],
  getlogs: [Object, 2, 2, function(data) {
    const logs = fs.readFileSync('log.txt').toString().split('\n').slice(1).reverse(), t = servers[this.room].pt.find(t => t.username === this.username);
    for (let i = Math.min(logs.length, Number(data[1])); i >= 0; i--) t.privateLogs.push({m: logs[i], c: '#A9A9A9'});
  }],
  announce: [Object, 3, -1, function(data) {
    for (const server of Object.values(servers)) {
      server.logs.push({m: '[Announcement]['+this.username+'] '+data.slice(1).join(' '), c: '#FFF87D'});
      for (const t of server.pt) server.send(t);
    }
  }],
  lockchat: [Object, 2, -1, function(data) {
    settings.chat = !settings.chat;
  }],
  lockdown: [Object, 2, -1, function(data) {
    settings.joining = !settings.joining;
  }],
  swrite: [Object, 1, 3, function(data) {
    eval(`try {
      servers['${this.room}']['${data[1]}'] = ${data[2]};
    } catch(e) {
      servers['${this.room}'].pt.find(t => t.username === '${this.username}').socket.send({status: 'error', message: 'Your command gave error: '+e});
    }`);
  }],
  admin: [Object, 1, 2, function(data) {
    if (!Storage.admins.includes(data[1])) Storage.admins.push(data[1]);
  }],
  vip: [Object, 2, 2, function(data) {
    if (!Storage.vips.includes(data[1])) Storage.vips.push(data[1]);
  }],
  removeadmin: [Object, 1, 2, function(data) {
    if (Storage.admins.includes(data[1])) Storage.admins.splice(Storage.admins.indexOf(data[1]), 1);
  }],
  removevip: [Object, 2, 2, function(data) {
    if (Storage.vips.includes(data[1])) Storage.vips.splice(Storage.vips.indexOf(data[1]), 1);
  }],
  twrite: [Object, 1, 4, function(data) {
    eval(`try {
      const server = servers['${this.room}'], tank = server.pt.find(t => t.username === '${data[1]}');
      tank['${data[2]}'] = ${data[3]};
    } catch(e) {
      servers['${this.room}'].pt.find(t => t.username === '${this.username}').socket.send({status: 'error', message: 'Your command gave error: '+e});
    }`);
  }],
  help: [Object, 4, 1, function(data) {
    const t = servers[this.room].pt.find(t => t.username === this.username), authKey = ['n/a', 'Owner', 'Admin', 'VIP', 'Everyone']
    for (const command of Object.keys(Commands)) t.privateLogs.push({m: `/${command} - ${Commands[command][2]} parameters. [${authKey[Commands[command][1]]}]`, c: '#00FF00'});
  }],
};

const wss = new WebSocketServer({port: settings.port});
wss.on('connection', socket => {
  socket._send = socket.send;
  socket.send = data => socket._send(pack(data));
  sockets.add(socket);
  socket.on('message', data => {
    try {
      data = unpack(data);
    } catch(e) {
      return socket.close();
    }
    if (!socket.username) socket.username = data.username;
    if (data.type === 'update') {
      if (Storage.bans.includes(data.username)) {
        socket.send({status: 'error', message: 'You are banned!'});
        return setTimeout(() => socket.close());
      }
      if (servers[socket.room]) servers[socket.room].update(data);
    } else if (data.type === 'join') {
      if (!hasAccess(data.username, 3) && !settings.joining) {
        socket.send({status: 'error', message: `Joining is disabled.`});
        return setTimeout(() => socket.close());
      } else if (clean(data.username) !== data.username) {
        socket.send({status: 'error', message: `Your username didn't pass the profanity check.`});
        return setTimeout(() => socket.close());
      } else if (Storage.bans.includes(data.username)) {
        socket.send({status: 'error', message: 'You are banned!'});
        return setTimeout(() => socket.close());
      }/* else if (!auth(socket.username, data.token)) {
        socket.send({status: 'error', message: 'Token is invalid. Login with the correct authserver.'});
        return setTimeout(() => socket.close());
      }*/
      let server;
      for (const id in servers) {
        if (servers[id] instanceof joinKey[data.gamemode]) {
          if (data.gamemode === 'ffa' && servers[id].pt.length >= settings.players_per_room) continue;
          if (data.gamemode === 'duels' && servers[id].pt.length !== 1) continue;
          if (data.gamemode === 'tdm' && servers[id].mode !== 0) continue;
          if (data.gamemode === 'defense' && servers[id].pt.length > 10) continue;
          server = id;
          break;
        }
      }
      if (!server) {
        server = Math.random();
        servers[server] = new joinKey[data.gamemode]();
      }
      if (servers[server].pt.some(t => t.username === socket.username)) {
        socket.send({status: 'error', message: 'You are already in the server!'});
        return setImmediate(() => socket.close());
      }
      socket.room = server;
      servers[server].add(socket, data.tank);
    } else if (data.type === 'ping') {
      socket.send({event: 'ping', id: data.id});
    } else if (data.type === 'chat') {
      if (!servers[socket.room] || (!hasAccess(socket.username, 3) && !settings.chat)) return;
      if (Storage.mutes.includes(socket.username) || socket.username === '3foe') {
        log(`${socket.username} tried to say "${data.msg}"`);
        return socket.send({status: 'error', message: 'You are muted!'});
      }
      servers[socket.room].logs.push({m: `[${socket.username}] ${clean(data.msg)}`, c: '#ffffff'});
      for (const t of servers[socket.room].pt) servers[socket.room].send(t);
      log(`[${socket.username}] ${clean(data.msg)}`);
    } else if (data.type === 'logs') {
      if (servers[data.room]) socket.send({event: 'logs', logs: servers[data.room].logs}); // Dead?
    } else if (data.type === 'command') {
      const f = Commands[data.data[0]];
      if (!f) return socket.send({status: 'error', message: 'Command not found.'});
      if (!(servers[socket.room] instanceof f[0])) return socket.send({status: 'error', message: 'This command is not available in this server type.'});
      if (data.data.length !== f[2] && f[2] !== -1) return socket.send({status: 'error', message: 'Wrong number of arguments.'});
      if (!hasAccess(socket.username, f[1])) return socket.send({status: 'error', message: `You don't have access to this.`});
      log(`${socket.username} ran command: ${data.data.join(' ')}`);
      f[3].bind(socket)(data.data);
    } else if (data.type === 'list') {
      socket.send({event: 'list', players: servers[socket.room].pt.reduce((a, c) => a.concat(c.username), [])});
    } else if (data.type === 'stats') {
      let gamemodes = {FFA: [], DUELS: [], TDM: [], Defense: [], event: 'stats'};
      for (const id in servers) {
        gamemodes[servers[id].constructor.name][id] = [];
        for (const pt of servers[id].pt) {
          gamemodes[servers[id].constructor.name][id].push(pt.username);
        }
      }
      socket.send(gamemodes);
    }
  });
  socket.on('close', (code, reason) => {
    sockets.delete(socket);
    if (servers[socket.room]) servers[socket.room].disconnect(socket, code, reason);
  });
});
console.log('Listening on port '+settings.port);
