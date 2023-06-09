const SETTINGS = {
  path: '/ffa',
  bans: [],
  banips: [],
  mutes: [],
  admins: ['cs641311', 'DIO', 'Celestial', 'bradley'],
  ppm: 5, // players per room
  log_strain: true, // Show messages per second in logs
  ups_boost: false, // Can lag clients and servers. Recommened false.
  UPS: 60, // updates per second
  filterProfanity: true, // filter profanity
  port: 15132,
  export: true,
}

import fetch from 'node-fetch';
import HyperExpress from 'hyper-express';
import jsonpack from 'jsonpack';
import Filter from 'bad-words';
import {Engine} from './public/js/engine.js';

const filter = new Filter();
export const Core = new HyperExpress.Router();
const Server = new HyperExpress.Server({fast_buffers: true});
const encode = (c) => {let x='charCodeAt',b,e={},f=c.split(""),d=[],a=f[0],g=256;for(b=1;b<f.length;b++)c=f[b],null!=e[a+c]?a+=c:(d.push(1<a.length?e[a]:a[x](0)),e[a+c]=g,g++,a=c);d.push(1<a.length?e[a]:a[x](0));for(b=0;b<d.length;b++)d[b]=String.fromCharCode(d[b]);return d.join("")}
const decode = (b) => {let a,e={},d=b.split(""),c=d[0],f=d[0],g=[c],h=256,o=256;for(b=1;b<d.length;b++)a=d[b].charCodeAt(0),a=h>a?d[b]:e[a]?e[a]:f+c,g.push(a),c=a.charAt(0),e[o]=f+c,o++,f=a;return g.join("")}
const deathMessages = [
  `{victim} was killed by {killer}`,
  `{victim} was put out of their misery by {killer}`,
  `{victim} was assassinated by {killer}`,
  `{victim} got comboed by {killer}`,
  `{victim} got eliminated by {killer}`,
  `{victim} was crushed by {killer}`,
  `{victim} had a skill issue while fighting {killer}`,
  `{victim} was sniped by {killer}`,
  `{victim} was exploded by {killer}`,
  `{victim} was executed by {killer}`,
  `{victim} was deleted by {killer}`,
  `{victim} was killed by THE PERSON WITH KILLSTREAK ---> {killer}`,
  `{victim} got buffed, but get nerfed harder by {killer}`,
  `{victim} got flung into space by {killer}`,
  `{victim} was pound into paste by {killer}`,
  `{victim} was fed a healthy dose of explosives by {killer}`,
  `{victim} became another number in {killer}'s kill streak`,
  `{victim} got wrecked by {killer}`,
  `{victim} got hit by a steamroller driven by DIO`
];
const joinMessages = [
  `{idot} joined the game`,
  `{idot} spawned`,
  `{idot} joined`,
  `{idot} wants a killsteak`,
  `{idot} exists`,
  `{idot} has been summoned`,
  `{idot} is back`,
  `a wild {idot} spawned`,
  `{idot} is here to kill them all`,
  `{idot} doesn't have anything better to do`,
  `{idot} is here to fight to the death`,
];
const rageMessages = [
  `{idot}.exe is unresponsive`,
  `{idot} left the game`,
  `{idot} ragequit`,
  `{idot} stopped existing`,
  `{idot} got away`,
  `wild {idot} fled`,
  `{idot} disconnected`,
  `{idot} lost internet connection`,
  `{idot} is not found`,
];
var sockets = [], servers = [], incoming_per_second = 0, outgoing_per_second = 0, ffaLevels = [
  ['22 2 =2222222222222222222222=1','22 = == ===================21=','    =      # # #           122','2=   = #   #   # ## ## #  1 =2','  = @= ##  ## ##         1  =2','=  ==  2## #   # #      1   =2','2=    222### # # #     1  # =2','2  ##22222##   #      1     =2','2=  ##22222##  # #   1      =2','2=   ##22222##      1       =2','2= #  ##22222##    1  #   # =2','2= ##  ##22222##  1         =2','2= ###  ##222221 1  # ##### =2','2= # ##  ##222111   #     # =2','2= # ###  ##211111#  #  # # =2','2= #   ##  #111112##  #   # =2','2= # #   #   111222##  #  # =2','2= ##### #  1 122222##  # # =2','2=         1  ##22222##  ## =2','2= #   #  1    ##22222##  # =2','2=       1      ##22222##   =2','2=      1   # # ###22222##  =2','2=     1      #   ##22222##  2','2= #  1     # # # ###222    =2','2=   1      # # # # ##2  ==  =','2=  1         # # #  ## =  =  ','2= 1  # ## ## # # #   # =   =2','221           #   #      =    ','=12=================== =  = 22','1=2222222222222222222222= 2 22'],
  ['2     =    #     #  #  =     2', ' ==2=    # #  #  #  #    =2== ', ' =  = =  #    #     #  = =  = ', ' 2 == =  #### # #####  = == 2 ', ' ==== =  #    #     #  = ==== ', '      1  # #     #  #  1      ', '= ===11  # # ### # ##  11=== =', '         # #     #  #         ', '  222#   ############         ', ' 22222#                ###### ', ' 22222#   2  2222  2   #  # # ', ' 22222#                #  # # ', ' 22222#     # 11 #     # ## # ', ' 22222#   2  1111  2   #    # ', ' 22222#   2 11@ 11 2   # ## # ', ' 22222#   2 11  11 2   #  # # ', ' 22222#   2  1111  2   #  # # ', ' 22222#     # 11 #     #### # ', ' 22222#                     # ', ' 22222#   2  2222  2   ## # # ', ' 22222#                #  # # ', '  222#   ############  ###### ', '         #    ##    #         ', '= ===11  # #      # #  11=== =', '      1  #    ##    #  1      ', ' ==== =  #    ##    #  = ==== ', ' 2 == =  #    ##    #  = == 2 ', ' =  = =  #    ##    #  = =  = ', ' ==2=    # #      # #    =2== ', '2     =  #    ##       =     2'],
  ['========   #      #   =========', '======     2      2     =======', '====11     #      #     11=====', '===111      #    #      111====', '==111#########22#########111==', '==11##   #          #   ##11==', '=   # #                ###   =', '=   #  2    #    #    ####   =', '    #   2            # 1 #    ', '    #    2          #  # #    ', '    # 1   #        ##1## #    ', '#2# #      #####2##   #  # #2#', '   ##      2222222#1### ###   ', '    #      #2    22 #    #    ', '    2  1   #2 @  2######1#    ', '    2    1 #2    22    # 2    ', '    #      #2    2####1# #    ', '   ## #    #222222# #  # ##   ', '#2# #      #####2## #1##1# #2#', '    #     1        ##  # #    ', '    #   1     1     ##1# #    ', '    #    #        1  #   #    ', '=   #          #      ####   =', '=   ### 1  1        1  ###   =', '==11###                 ##11==', '==111#########22#########111==', '===111      #    #      111===', '====11     #      #     11====', '======     2      2     ======', '========   #      #   ========'],
  ['===========================222', '===========        ========222', '========    ###  #    =====222', '======222####           =====2', '===== 2###    #  11#1111#====2', '====  ##22 ####  111111111===2', '===  ##22###  1  #111#1111#==2', '=== ##  ##  1 1  #111##111#==2', '==22#  ## 1 1 1   1111111122=2', '==2##2## 1   ####  #1111#122=2', '==2#22# 1 1         11111122=2', '=  #2##    #  22  # 111111#222', '= ## # 11                2222=', '=2#  #   #   #  #   #      22=', '=2# ##111# 2  @   2 #        =', '=22 #    # 2      2 #  2### #=', '=####1 2 #   #  #   ### 1  # =', '=2222 2#              1# #   =', '22221  2 1 #  22  # ## 1  ## =', '2=222#21 2        # 1 # #   ==', '2=222 #      ####   #1  # # ==', '2=2 # 12 1 1  #   ## ###  # ==', '2==2     2 22 2 # 1 1   # #===', '2==  12 2 2#   #1  # # #   ===', '2===   #   2 1 # #1#  ####====', '2====  2 21 12 # #   ##  =====', '2=====   1 2#  # # ##   ======', '222=====   1   ###    ========', '222======== 2 1#   ============', '222==========================='],
  ['=====         ==         =====', '===     ====  ==           ===', '===        =  =====        ===', '=          =  =====          =', '=   = =       ==       = =   =', '   = =        ==        = =   ', '      = =   ====     = =      ', '     = =    ====      = =     ', '            ==                ', '            ==   ===          ', '        =                 =   ', '  ==  ===                 === ', '  ==        =1111=  ====      ', '  ==        1    1  ====      ', '========    1 @  1    ========', '========    1    1    ========', '      ====  1    1        ==  ', '      ====  =1111=        ==  ', '  =                 ===   ==  ', ' ====                 =       ', '  =             ==            ', '                ==          = ', '     = =      ====    = =   = ', '      = =     ====   = =      ', '   = =        ==        = =   ', '=   = =    =====       = =   =', '=          =====             =', '===           ==  ===      ===', '===           ==    ===    ===', '=====         ==         ====='],
  ['   #   #   #  ==   ##  # #   #','   #   #   #  == #  # ##   # #','   #   #   #2 == ####    #    ','## # ### ###2 == #  # ## ## ##','           22 ==   ## #       ',' ###    ##### == #    # ######',' ##  222  ##  == # ## #    #  ','11# 22222    1== #    #### # #','1## 22      11==    # #       ','1#          11==## ## # ######','  #     11111 ==    # # #     ','    #   111   == ## #   #     ','    #         22    # ###     ','    #        2222 #       # # ','============22@ 22============','============22  22============','       2     2222             ',' ##2######### 22         111  ',' # 2        # ==       11     ',' # ######## # ==     ##    #  ',' # #     22 # ==     ##    ## ',' # # #2## # # ==              ','2# # #2 # # # ==          2   ',' # # # 2# # #2========    22  ',' # # ##2# # # ==         2    ',' # 22     # # ==        # # # ',' # ######## # == 2 2  2 ##### ',' #        2 # ==  2 2   #   # ',' #########2## == 2 2 2      # ','      2       ==        #   # '],
  ['=   ==========================','     =========================','  @  222 =   =   =   =   =====','     ===   =   =   =   =   222','=   =========1============1==2','==2==########1############1##2','==2==#  1        #          # ','==2==#1    1   1 #          # ','==  =#   1   1   # 1    ##  # ','=== =#          1# 1      # # ','==  =#  1   1    # 1  #   # # ','== ==# 1  1    1 #    #     # ','==  =#       1   #     ##   # ','=== 11  1     2#####2       # ','==  =#    1  222111222      # ','== ==#      1#211 112#  111 # ','==  =# 1 1   #11   11#      # ','=== =#########1     1######## #','==  =#       #11   11#    # # ','== ==#  111  #211 112#  2 # # ','==  =#       222111222    # # ','=== =#        2#####2     2 # ','==  =#    ##     #     #  # # ','== ==#      #    #    ##  # # ','==  =#  #   #  1 # 2      # 2 ','=== =#  #      1 #        # # ','=== 11   ##    1 ####2####### ','===2=#           #        ### ','===2=###################2#### ','===222                        '],
  ['==============================','=======================1======','==============================','=  #22       #        22#    =','=  ##22      #       222#    =','=    #22     1      222 #    =','=    #22     1     222  #    =','=    ##22    #    222  #     =','= 22  # 222  # 2 22    1     =','= 22  1   2 2#1 22     1     =','=     1   221#112  11  #     =','=     #   211 111  11  #     =','=     #   #1   1#      #     =','=##22##2221  @   ########11##=','=     #   1#   #1      #     =','=     1   11   11 11   #     =','=     1    1   1  11   1     =','=     #   #11111       1     =','=    ##   ##   ##      #     =','=    #   1#2    #1     #     =','=    #  11       11    ##    =','=  ### 11         11    #    =','=  #  ##           ##   #    =','=  # ###  ##  ##  ####  #    =','=  ##                ## #    =','=  ######             # #    =','=22#########22###22######22===','=                          ===','=                          ===','=============================='],
  ['==============================','=======================1======','==============================','=  #22       #        22#    =','=  ##22      #       222#    =','=    #22  T  1  T   222 #    =','=    #22     1     222  #    =','=    ##22    #    222  #     =','= T2  # 222  # 2 22    1  T  =','= 2T  1   2 1#1 22     1     =','=     1   211#112  11  #     =','=     #   T11 11T  11  #     =','=     #   11   11      #     =','=##22##2221  @  1########11##=','=     #   11   11      #     =','=     1   T1   1T 11   #     =','=     1    1   1  11   1     =','= T   #   #11111       1     =','=    ##   ##   ##      #     =','=    #   1#2    #1     #     =','=    #  11       11    ## T  =','=  ### 11         11    #    =','=  #  ##   T  T    ##   #    =','=  # ###  ##  ##  ####  #    =','=  ##                ## #    =','=  ######             # #    =','=22#########22###22######22===','=                          ===','=    T                 T   ===','=============================='],
  ['   =   =       11 1 1 ========','   = = = =  111    111        ','   = = = = 1  1  111 1        ',' === = = = 1 111111      ==   ','     = = = 111 11  1 1   ==   ','====== = = 1    11 111   ==   ','       = =   11 1  1     ==   ',' ======= = 11 11 11 1    ==   ','         =   11 11  11   ==   ','==========  1 ###  11    ==   ','           1 ##2#### 1   ==   ','            ##22222##    ==   ','  # # #    ##2222222##   ==   ','           #222222222#   ==   ','           #222222222#   ==   ',' #     #  ##222222222#   ==   ',' #  @  #   2222222222#   ==   ',' #     #  ##222222222#   ==   ','           ##222222##    ==   ','            ##222###     ==   ','  # # #      #####            ','                              ','                      ========','#### #####  ==== ======= = = =','   # #   #  =       = =       ',' #     # #  = === === == =====','   ###   #  ===          =    ',' #     # #  =   = = = ==== =  ','   ###   #  = === = =   =  =  ',' #     # #  = =   = = =   ==  '],
  ['          =  =##=  #         #','          =  =  =  #      #   ','       =22=  =  =         #   ','   @   =  =  =  = #= ==== = ##','       =  =22=  =             ','       =  =# =  =  = =  = =   ','       =  1  1  1  =      =   ','  ======  1  1  1  =      =   ','  2       = #=  =  = =  = =   ','  2       =  =  =             ','======11===22=  =# = ==== =## ','    2#    2  =  =  #          ','    2   # 2  1  =         #   ','======11====11  ======11======','#                            #','#                            #','======11======  ======11======','             =  =       = 1   ',' #         # =  =   =====     ','     ====    =  =          1 1','    ==  ==   =  = =    1 1    ','## ==    ==  =  = =  1 1   11 ','   =  #   =  1  1 =         1 ',' ##= ###  =  1  1 =    1 1    ','   =  #  ==  =  ===  1    1 1 ','        ==   =  =     1 1     ','     ====    =  = 1 1   1   1 ','      #      =  =  1  1  1    ','=     # #  # =  =   1       1 ','==      #    =##= 1    1   1  '],
], duelsLevels = [
  ['                      ### #   ','      ####       # ##         ','   #      ## #  ##        #  #','#        ###  ######      # # ','     ###            ##     ## ','   ##                ##  ###  ','  #              #            ',' #      #   #       ###   #  #','#     ##         ##   ##      ','      #                       ','           #### #       #    #','  #       #      #         # #','  ###  ##      #  #     #    #','    #  #       #   #        # ','    ### #      #         ## # ','    # #        #  #         # ','     ##  #     #         #    ','     ##  #     #         #    ','     ##   #    #        #  #  ','      ##     #         #  ##  ','        # #    #     ##   #   ',' # ###  #   #     #       #   ',' #      ##   #   #      ###  #',' #      # #  ###  ### ##     #','       #      # #####       # ','  ####        #            ## ','  #   ##                 ##   ',' ##    #   # ## #        #    ','  #           ##              ','                              '],
];

if (SETTINGS.log_strain) setInterval(() => {
  console.log('Incoming: ' + incoming_per_second + ' | Outgoing: ' + outgoing_per_second);
  incoming_per_second = 0;
  outgoing_per_second = 0;
}, 1000);

setInterval(() => {
  SETTINGS.bans = SETTINGS.bans.filter(ban => {
    ban.time--;
    return ban.time > 0;
  });

  SETTINGS.mutes = SETTINGS.mutes.filter(mute => {
    mute.time--;
    return mute.time > 0;
  });
}, 60000);

Core.ws(SETTINGS.path, {idleTimeout: Infinity, max_backpressure: 1}, socket => {
  sockets.push(socket);
  socket._send = socket.send;
  socket.send = (data) => {
    socket._send(encode(jsonpack.pack(data)));
  };
  if (SETTINGS.banips.includes(socket.ip)) {
    socket.send({status: 'error', message: 'Your ip has been banned!'});
    return setImmediate(() => socket.destroy());
  }
  socket.on('message', async (data) => {
    incoming_per_second++;
    try {
      data = jsonpack.unpack(decode(data));
    } catch(e) {
      return socket.destroy();
    }
    if (!socket.username) {
      if (/\s|:/.test(data.username)) return socket.destroy();
      const ban = SETTINGS.bans.find(i => i.username === data.username);
      if (ban) {
        socket.send({status: 'error', message: `You are banned. Banned by ${ban.by} for ${ban.reason}. You are banned for ${ban.time} more minutes or until an admin unbans you. You were banned by an admin on this server, not the entire game, so you can join other servers.`});
        return setImmediate(() => socket.destroy());
      }
      socket.username = data.username;
    }
    if (data.type === 'join') {
      let joinable = servers.filter(s => s.pt.length < SETTINGS.ppm).sort((a, b) => a.pt.length-b.pt.length);
      if (joinable.length === 0) {
        joinable[0] = new FFA();
        servers.push(joinable[0]);
      } else if (joinable[0].pt.some(t => t.username === socket.username)) {
        socket.send({status: 'error', message: 'You are already in the server!'});
        return setImmediate(() => socket.destroy());
      }
      const { username, token, tank } = data;
      try {
        const res = await fetch(`http://141.148.128.231/verify?username=${username}&token=${token}`);
        const body = await res.text();
        if (body === 'true') {
          joinable[0].add(socket, tank);
          socket.room = servers.indexOf(joinable[0]);
        } else {
          socket.send({status: 'error', message: 'Invalid Token.'});
          setImmediate(() => socket.destroy());
        }
      } catch(e) {
        socket.send({status: 'error', message: 'Cannot verify token. '+e});
        console.log('Cannot connect to authentication servers! '+e);
        return setImmediate(() => socket.destroy());
      }
    } else if (data.type === 'update') {
      servers[socket.room].update(data);
    } else if (data.type === 'ping') {
      socket.send({event: 'ping', id: data.id});
    } else if (data.type === 'chat') {
      if (SETTINGS.mutes.find(i => i.username === socket.username)) return;
      let msg = data.msg;
      try {
        msg = SETTINGS.filterProfanity ? filter.clean(msg) : msg;
      } catch(e) {}
      servers[socket.room].logs.push({m: `[${socket.username}] ${msg}`, c: '#ffffff'});
    } else if (data.type === 'command') {
      const [commandName, ...args] = data.data, func = Commands[commandName];
      if (typeof func === 'function') {
        func.bind(socket)(args);
      } else socket.send({status: 'error', message: 'Command not found.'});
    } else if (data.type === 'stats') {
      const players = servers.reduce((arr, s) => [...arr, ...s.pt.map(t => t.username)], []);
      socket.send({event: 'stats', totalRooms: servers.length, totalPlayers: players.length, players: players, bans: SETTINGS.bans, mutes: SETTINGS.mutes, admins: SETTINGS.admins, out: outgoing_per_second, in: incoming_per_second, sockets: sockets.length});
    } else setTimeout(() => socket.destroy());
  });
  socket.on('close', (code, reason) => {
    if (servers[socket.room]) servers[socket.room].disconnect(socket, code, reason);
  });
});
const Commands = {
  createteam: data => {
    if (data.length !== 2) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    if (servers[this.room].pt.find(t => servers[this.room].getTeam(t.team) === data[1])) return this.send({status: 'error', message: 'This team already exists.'});
    if (data[1].includes('@leader') || data[1].includes('@requestor#') || data[1].includes(':') || data[1].length > 20) return this.send({status: 'error', message: 'Team name not allowed.'});
    servers[this.room].pt.find(t => t.username === this.username).team = this.username+':'+data[1]+'@leader';
    servers[this.room].logs.push({m: this.username+' rcreated team '+data[1]+'. Use /join '+data[1]+' to join.', c: '#0000FF'});
  },
  join: data => {
    if (data.length !== 2) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    if (servers[this.room].pt.find(t => t.username === this.username).team.includes('@leader')) return this.send({status: 'error', message: 'You must disband your team to join. (/leave)'});
    if (!servers[this.room].pt.find(t => servers[this.room].getTeam(t.team) === data[1] && t.team.includes('@leader'))) return this.send({status: 'error', message: 'This team does not exist.'});
    servers[this.room].pt.find(t => t.username === this.username).team += '@requestor#'+data[1];
    servers[this.room].logs.push({m: this.username+' requested to join team '+data[1]+'. Team owner can use /accept '+this.username+' to accept them.', c: '#0000FF'});
  },
  accept: data => {
    if (data.length !== 2) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    var leader = servers[this.room].pt.find(t => t.username === this.username), requestor = servers[this.room].pt.find(t => t.username === data[1]);
    if (!requestor) return this.send({status: 'error', message: 'Player not found.'});
    if (leader.team.includes('@leader') && requestor.team.includes('@requestor#') && servers[this.room].getTeam(leader.team) === requestor.team.split('@requestor#')[1]) {
      requestor.team = data[1]+':'+servers[this.room].getTeam(leader.team);
      servers[this.room].logs.push({ m: data[1]+' has joined team '+servers[this.room].getTeam(leader.team), c: '#40C4FF' });
    }
  },
  leave: () => {
    var target = servers[this.room].pt.find(t => t.username === this.username);
    if (target.team.includes('@leader')) servers[this.room].pt.forEach(t => {
      if (servers[this.room].getTeam(t.team) === servers[this.room].getTeam(target.team)) t.team = t.username+':'+Math.random();
    });
    target.team = this.username+':'+Math.random();
  },
  pay: data => {
    if (!SETTINGS.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    if (data.length !== 3 || new Number(data[2]) === NaN) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    servers[this.room].pt.forEach(t => {
      if (t.username === data[1]) this.socket.send({event: 'pay', amount: new Number(data[2])});
    });
    servers[this.room].logs.push({m: data[1]+' was paid '+data[2]+' by '+this.username, c: '#FFFF20'});
  },
  newmap: data => {
    if (!SETTINGS.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    servers[this.room].b = [];
    servers[this.room].levelReader(ffaLevels[Math.floor(Math.random()*ffaLevels.length)]);
    servers[this.room].pt.forEach(t => {
      t.x = servers[this.room].spawn.x;
      t.y = servers[this.room].spawn.y;
      t.socket.send({event: 'override', data: [{key: 'x', value: t.x}, {key: 'y', value: t.y}]});
    });
  },
  banip: data => {
    return this.send({status: 'error', messsage: "We wouldn't want another evanism catastrophe, now, would we?"});
    if (!SETTINGS.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    if (data.length !== 2) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    var ip;
    try {
      var ip = servers[this.room].pt.find(t => t.username === data[1]).socket.ip;
    } catch(e) {
      return this.send({status: 'error', message: 'Player not found.'});
    }
    SETTINGS.banips.push(ip);
    sockets.forEach(s => {
      if (!s.ip === ip) return;
      s.send({status: 'error', message: 'You were just ip banned!'});
      setTimeout(() => {
        s.destroy();
      });
    });
    servers[this.room].logs.push({m: data[1]+`'s ip, `+ip+`, has been banned.`, c: '#FF0000'});
  },
  unbanip: data => {
    if (!SETTINGS.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    if (data.length !== 2) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    if (SETTINGS.banips.indexOf(data[1]) !== -1) SETTINGS.banips.splice(SETTINGS.banips.indexOf(data[1]), 1);
    servers[this.room].logs.push({m: data[1]+' ip has been unbanned.', c: '#0000FF'});
  },
  ban: data => {
    if (!SETTINGS.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    if (data.length < 4 || isNaN(data[2])) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    if (SETTINGS.admins.includes(data[1])) return this.send({status: 'error', message: `You can't ban another admin!`});
    var l = 3, reason = '', server = servers[this.room];
    while (l<data.length) {
      reason += data[l]+' ';
      l++;
    }
    SETTINGS.bans.push({ username: data[1], by: this.username, time: data[2], reason: reason });
    server.logs.push({ m: this.username+' banned '+data[1]+' for '+data[2]+' minutes because "'+reason+'"', c: '#FF0000' });
    sockets.forEach(s => {
      if (s.username !== data[1]) return;
      s.send({status: 'error', message: 'You were just banned!'});
      setTimeout(() => {
        s.destroy();
      });
    });
  },
  bans: data => {
    if (!SETTINGS.admins.includes(this.username)) return this.send({ status: 'error', message: 'You are not a server admin!' });
    if (data[1]) {
      if (!A.each(SETTINGS.bans, function(i, server) {
        server.logs = server.logs.concat([{m: this.username+`'s Ban Info:`, c: '#FFFF22'}, {m: 'For: '+this.reason, c: '#FFFF22'}, {m: 'Time left: '+this.time, c: '#FFFF22'}, {m: 'Issued by: '+this.by, c: '#FFFF22'}]);
        return true;
      }, 'username', data[1], servers[this.room])) servers[this.room].logs.push({m: '/bans: '+data[1]+' is not banned.', c: '#FF0000'});
    } else {
      var players = [];
      A.each(SETTINGS.bans, function(i, p) {p.push(this.username)}, null, players);
      servers[this.room].logs = servers[this.room].logs.concat([{m: 'Bans Info:', c: '#FFFF22'}, {m: 'All Banned Players: '+players, c: '#FFFF22'}]);
    }
  },
  unban: data => {
    if (!SETTINGS.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    if (data.length !== 2) return this.send({ status: 'error', message: 'Command has invalid arguments.' });
    A.each(SETTINGS.bans, function(i) {SETTINGS.bans.splice(i, 1)}, 'username', data[1]);
    servers[this.room].logs.push({m: data[1]+' is unbanned.', c: '#0000FF'});
  },
  mute: data => {
    if (!SETTINGS.admins.includes(this.username)) {
      this.send({ status: 'error', message: 'You are not a server admin!' });
      return;
    }
    if (data.length !== 3 || isNaN(data[2])) {
      this.send({ status: 'error', message: 'Command has invalid arguments.' });
      return;
    }
    SETTINGS.mutes.push({
      username: data[1],
      by: this.username,
      time: data[2],
    });
    servers[this.room].logs.push({m: data[1]+' was muted for '+data[2]+' minutes by '+this.username, c: '#FFFF22'});
  },
  mutes: data => {
    if (!SETTINGS.admins.includes(this.username)) {
      this.send({ status: 'error', message: 'You are not a server admin!' });
      return;
    }
    if (data[1]) {
      if (!A.each(SETTINGS.mutes, function(i, server) {
        server.logs = server.logs.concat([{m: this.username+`'s Mute Info:`, c: '#FFFF22'}, {m: 'Time left: '+this.time, c: '#FFFF22'}, {m: 'Issued by: '+this.by, c: '#FFFF22'}]);
        return true;
      }, 'username', data[1], servers[this.room])) servers[this.room].logs.push({m: '/mutes: '+data[1]+' is not muted.', c: '#FF0000'});
    } else {
      var players = [];
      A.each(SETTINGS.mutes, function(i, p) {p.push(this.username)}, null, null, players);
      servers[this.room].logs = servers[this.room].logs.concat([{m: 'Mutes Info:', c: '#FFFF22'}, {m: 'All Muted Players: '+players, c: '#FFFF22'}]);
    }
  },
  unmute: data => {
    if (!SETTINGS.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    if (data.length !== 2) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    A.each(SETTINGS.mutes, function(i) {SETTINGS.mutes.splice(i, 1)}, 'username', data[1]);
    servers[this.room].logs.push({m: data[1]+' is unmuted.', c: '#0000FF'});
  },
  kick: data => {
    if (!SETTINGS.admins.includes(this.username)) return this.send({ status: 'error', message: 'You are not a server admin!' });
    if (data.length != 2) return this.send({ status: 'error', message: 'Command has invalid arguments.' });
    A.each(sockets, function(i, socket, data) {
      if (this.username === data[1]) {
        this.send({status: 'error', message: 'You have been kicked by '+socket.username});
        setTimeout(function() {this.destroy()}.bind(this));
      }
    }, null, null, this, data);
  },
  kill: data => {
    if (!SETTINGS.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    if (data.length != 2) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    A.each(servers, function(i) {A.each(this.pt, function(i) {this.ded = true}, 'username', data[1])}, null, null, data);
  },
  cosmetic: data => {
    if (!SETTINGS.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    if (data.length !== 3) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    var pt = A.search(servers[this.room].pt, 'username', data[1]);
    if (pt === undefined) return this.send({status: 'error', message: 'Player Not Found.'}); else pt.cosmetic = data[2].replaceAll('_', ' ');
  }
};

class A {
  static each(arr, func, key, value, ...param) {
    var l = 0;
    while (l<arr.length) {
      if ((key === undefined || key === null) ? true : (arr[l][key] === value)) {
        var r;
        if (typeof func === 'string') {
          r = arr[l][func].apply(arr[l], param);
        } else {
          param.unshift(l);
          r = func.apply(arr[l], param);
          param.shift();
        }
        if (r !== undefined) return r;
      }
      l++;
    }
  }

  static search(arr, key, value) {
    var l = 0;
    while (l<arr.length) {
      if (arr[l][key] === value) {
        return arr[l];
      }
      l++;
    }
  }

  static collider(x, y, w, h, x2, y2, w2, h2) {
    return ((x > x2 || x+w > x2) && (x < x2+w2 || x+w < x2+w2) && (y > y2 || y+h > y2) && (y < y2+h2 || y+h < y2+h2)) ? true: false;
  }

  static assign(...param) {
    var l = 1;
    while (l<param.length-1) {
      param[0][param[l]] = param[l+1];
      l+=2;
    }
  }
}

class Multiplayer extends Engine {
  constructor(levels) {
    super(levels);
    this.sockets = [];
    this.logs = [];
    if (!SETTINGS.fps_boost) this.i.push(setInterval(() => this.send(), 1000/SETTINGS.UPS));
  }

  override(t) {
    t.socket.send({event: 'override', data: [{key: 'x', value: t.x}, {key: 'y', value: t.y}]});
  }

  add(socket, data) {
    data.socket = socket;
    this.sockets.push(socket);
    this.logs.push({m: this.joinMsg(data.username), c: '#66FF00'});
    super.add(data);
  }

  update(data) {
    super.update(data);
  }

  send() {
    const view = {x: -860, y: -560, w: 1880, h: 1280};
    this.pt.forEach(t => {
      var message = {blocks: [], tanks: [], ai: [], bullets: [], explosions: [], logs: this.logs, event: 'hostupdate'};
      this.b.forEach(b => {
        if (A.collider(b.x, b.y, 100, 100, t.x+view.x, t.y+view.y, view.w, view.h)) message.blocks.push(JSON.parse(JSON.stringify(b, (key, value) => {
          return ['host', 'bar', 'sd'].includes(key) ? undefined : value;
        })));
      });
      this.pt.forEach(pt => {
        if (A.collider(pt.x, pt.y, 80, 80, t.x+view.x, t.y+view.y, view.w, view.h)) message.tanks.push(JSON.parse(JSON.stringify(pt, (key, value) => {
          return ['updates', 'socket', 'render', 'healInterval', 'healTimeout', 'flashbangTimeout', 'grapple', 'gluInterval', 'ti', 'gluInterval', 'gluTimeout', 'fireTimeout', 'fireInterval', 'healing'].includes(key) ? undefined : value;
        })));
      });
      this.ai.forEach(ai => {
        if (A.collider(ai.x, ai.y, 80, 80, t.x+view.x, t.y+view.y, view.w, view.h)) message.ai.push(JSON.parse(JSON.stringify(ai, (key, value) => {
          return ['team', 'host', 'canFire', 'target'].includes(key) ? undefined : value;
        })));
      });
      this.s.forEach(s => {
        if (A.collider(s.x, s.y, 10, 10, t.x+view.x, t.y+view.y, view.w, view.h)) message.bullets.push(JSON.parse(JSON.stringify(s, (key, value) => {
          return ['host', 'd', 'damage', 'ra', 'target', 'offset', 'settings', 'md'].includes(key) ? undefined : value;
        })));
      });
      this.d.forEach(d => {
        if (A.collider(d.x, d.y, d.w, d.h, t.x+view.x, t.y+view.y, view.w, view.h)) message.explosions.push({...d, host: 'x', a: 'x', c: 'x'});
      });
      t.socket.send(message);
      outgoing_per_second++;
    });
  }

  disconnect(socket, code, reason) {
    this.sockets.splice(this.sockets.indexOf(socket), 1);
    A.each(this.pt, function(i, pt) {pt.splice(i, 1)}, 'username', socket.username, this.pt);
    A.each(this.ai, function(i, ai, host, username) {
      if (host.getUsername(this.team) === username) ai.splice(i, 1);
    }, null, null, this.ai, this, socket.username);
    if (this.pt.length === 0) {
      A.each(this.i, function() {clearInterval(this)});
      A.each(this.t, function() {clearTimeout(this)});
      if (servers.length - 1 === servers.indexOf(this)) servers = []; else servers[servers.indexOf(this)] = new FFA();
      return;
    }
    this.logs.push({m: this.rageMsg(socket.username), c: '#E10600'});
  }

  deathMsg(victim, killer) {
    return deathMessages[Math.floor(Math.random()*deathMessages.length)].replace('{victim}', victim).replace('{killer}', killer);
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

  ondeath(t, m) {
    t.ded = true;
    if (m.deathEffect) t.dedEffect = {
      x: t.x,
      y: t.y,
      r: t.r,
      id: m.deathEffect,
      start: Date.now(),
      time: 0,
    }
    t.deathsPerMovement++;
    if (t.deathsPerMovement === 1) {
      this.logs.push({m: this.deathMsg(t.username, m.username), c: '#FF8C00'});
      m.socket.send({event: 'kill'});
    } else this.logs.push({m: m.username+' killed an afk player!', c: '#FF0000'});
    A.each(this.ai, function(i, host, t) {
      if (host.getUsername(this.team) === t.username) {
        host.ai.splice(i, 1);
        i--;
      }
    }, null, null, this, t);
    setTimeout(function() {
      t.socket.send({event: 'ded'});
      t.socket.send({event: 'override', data: [{key: 'x', value: this.spawn.x}, {key: 'y', value: this.spawn.y}]});
      A.assign(t, 'x', this.spawn.x, 'y', this.spawn.y, 'ded', false, 'hp', t.maxHp);
    }.bind(this), 10000);
  }

  ontick() {}
}

/*class DUELS extends Engine {
  constructor(ip) {
    super(ip, duelsLevels);
    this.mode = 0; // 0 -> waiting for players to join, 1 -> waiting for second player to join, 2 -> 10 second ready timer, 3 -> match active, 4 -> gameover and server shutdown
  }

  add(socket, data) {
    super.add(socket, data);
    if (this.mode === 0) {
      this.global = 'Waiting For Player...';
      this.mode++;
    } else if (this.mode === 1) {
      this.readytime = Date.now();
      this.mode++;
      this.global = 'Starting in 10';
    } else return socket.send("Internal Server Error. You were redirected to a room that couldn't accept you.");
  }

  update(data) {
    if ([0, 1, 2].includes(this.mode)) return;
    super.update(data);
  }

  

  ontick() {

  }

}*/

Server.use(Core);
if (!SETTINGS.export) Server.listen(SETTINGS.port);