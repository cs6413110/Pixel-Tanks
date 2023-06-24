const SETTINGS = {
  path: '/ffa',
  bans: [],
  banips: [],
  mutes: [],
  admins: ['cs641311', 'DIO', 'Celestial', 'bradley'],
  ppm: 5, // players per room
  log_strain: true, // Show messages per second in logs
  ups_boost: false, // Can lag clients and servers. Recommened false.
  UPS: 120, // updates per second
  filterProfanity: true, // filter profanity
  port: 15132,
  export: true,
}

import http from 'http';
import HyperExpress from 'hyper-express';
import jsonpack from 'jsonpack';
import Filter from 'bad-words';

const filter = new Filter();
export const Core = new HyperExpress.Router();
const Server = new HyperExpress.Server({fast_buffers: true});

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

Core.ws(SETTINGS.path, {idleTimeout: Infinity, max_backpressure: 1}, (socket) => {
  sockets.push(socket);
  socket.originalSend = socket.send;
  socket.send = function(data) {this.originalSend(A.en(jsonpack.pack(data)))}.bind(socket);
  if (SETTINGS.banips.includes(socket.ip)) {
    socket.send({status: 'error', message: 'Your ip has been banned!'});
    return setTimeout(() => {socket.destroy()});
  }
  socket.on('message', (data) => {
    incoming_per_second++;
    try {
      data = jsonpack.unpack(A.de(data));
    } catch(e) {
      return socket.destroy();
    }
    if (!socket.username) {
      if (data.username.includes(' ') || data.username.includes(':')) return socket.destroy();
      const ban = SETTINGS.bans.find(i => i.username === data.username);
      if (ban) {
        setTimeout(() => socket.destroy());
        return socket.send({status: 'error', message: `You are banned. Banned by ${ban.by} for ${ban.reason}. You are banned for ${ban.time} more minutes or until an admin unbans you. You were banned by an admin on this server, not the entire game, so you can join other servers.`});
      }
      socket.username = data.username;
    }
    if (data.type === 'join') {
      let joinedServer = false;
      servers.forEach((s, i) => {
        if (s.pt.length < 10 && !joinedServer) {
          socket.room = i;
          if (s.pt.some(t => t.username === socket.username)) {
            socket.send({status: 'error', message: 'You are already in the server!'});
            return setTimeout(() => socket.destroy());
          }
          http.get(`http://141.148.128.231/verify?username=${socket.username}&token=${data.token}`, res => {
            let body = '';
            res.on('data', chunk => {
              body += chunk;
            });
            res.on('end', () => {
              if (body === 'true') {
                s.add(socket, data.tank);
              } else {
                socket.send({status: 'error', message: `Authentication failure. Your token (${data.token}) does not match with your username (${socket.username}). This can be caused by the authentication servers restarting or by modifying the client. Simply log in again to fix this issue.`});
                setTimeout(() => socket.destroy());
              }
            });
          });
          joinedServer = true;
        }
      });
      if (!joinedServer) {
        servers.push(new FFA());
        servers[servers.length-1].add(socket, data.tank);
        socket.room = servers.length-1;
      }
    } else if (data.type === 'update') {
      servers[socket.room].update(data);
    } else if (data.type === 'ping') {
      socket.send({event: 'ping', id: data.id});
    } else if (data.type === 'chat') {
      if (SETTINGS.mutes.find(i => i.username === socket.username)) return;
      let msg = data.msg;
      try {
        msg = (SETTINGS.filterProfanity ? filter.clean(msg) : msg);
      } catch(e) {}
      servers[socket.room].logs.push({m: '['+socket.username+'] '+msg, c: '#ffffff'});
    } else if (data.type === 'command') {
      const [commandName, ...args] = data.data;
      if (typeof Commands[commandName] === 'function') {
        Commands[commandName].bind(socket)(args);
      } else socket.send({status: 'error', message: 'Command not found.'});
    } else if (data.type === 'stats') {
      const players = servers.reduce((arr, s) => [...arr, ...s.pt.map(t => t.username)], []);
      socket.send({event: 'stats', totalRooms: servers.length, totalPlayers: players.length, players: players, bans: SETTINGS.bans, mutes: SETTINGS.mutes, admins: SETTINGS.admins, out: outgoing_per_second, in: incoming_per_second, sockets: sockets.length});
    } else setTimeout(() => socket.destroy());
  });
  socket.on('close', (code, reason) => {
    if (socket.room !== undefined) servers[socket.room].disconnect(socket, code, reason);
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

  static en(c) {var x='charCodeAt',b,e={},f=c.split(""),d=[],a=f[0],g=256;for(b=1;b<f.length;b++)c=f[b],null!=e[a+c]?a+=c:(d.push(1<a.length?e[a]:a[x](0)),e[a+c]=g,g++,a=c);d.push(1<a.length?e[a]:a[x](0));for(b=0;b<d.length;b++)d[b]=String.fromCharCode(d[b]);return d.join("")}

  static de(b) {var a,e={},d=b.split(""),c=d[0],f=d[0],g=[c],h=256,o=256;for(b=1;b<d.length;b++)a=d[b].charCodeAt(0),a=h>a?d[b]:e[a]?e[a]:f+c,g.push(a),c=a.charAt(0),e[o]=f+c,o++,f=a;return g.join("")}
}

class Engine {

  constructor(id, levels) {
    this.sockets = [];
    this.spawn = {x: 0, y: 0};
    this.id = id;
    this.logs = [];
    this.ai = [];
    this.b = [];
    this.s = [];
    this.pt = [];
    this.d = [];
    this.i = [];
    this.t = [];
    this.levels = levels;
    this.levelReader(this.levels[Math.floor(Math.random()*this.levels.length)]);
    if (!SETTINGS.fps_boost) this.i.push(setInterval(() => this.send(), 1000/SETTINGS.UPS));
    this.i.push(setInterval(() => this.tick(), 1000/60));
  }

  tick() {
    this.ai.concat(this.s).forEach(e => e.update());

    this.pt.forEach(t => {
      if (t.dedEffect) t.dedEffect.time = Date.now()-t.dedEffect.start;
      if (t.class === 'medic' && this.healing !== this.username && !this.ded) {
        const tank = this.pt.find(tank => tank.username === t.healing);
        if ((t.x-tank.x)**2+(t.y-tank.y)**2 < 250000) tank.hp = Math.min(tank.hp+25, tank.maxHp);
      }
      if (t.pushback !== 0) t.pushback += 0.5;
      if (t.fire && this.getTeam(t.fire.team) !== this.getTeam(t.team)) this.damagePlayer(t, {x: this.x, y: this.y, u: this.getUsername(t.fire.team), a: .5});
      this.pt.forEach(tank => {
        if (A.collider(t.x, t.y, 80, 80, tank.x, tank.y, 80, 80)) {
          if (t.immune && tank.canBashed) {
            if (t.class === 'warrior' && t.username !== tank.username) {
              tank.hp -= 50;
            } else if (t.class == 'medic') {
              tank.hp = Math.min(tank.hp+50, tank.maxHp);
            }
            tank.canBashed = false;
            setTimeout(() => {
              tank.canBashed = true;
            }, 800);
          }
        }
      });
      this.b.forEach(b => {
        if (A.collider(t.x, t.y, 80, 80, b.x, b.y, 100, 100) && !t.ded && !t.immune) {
          if (b.type === 'mine' && b.a) {
            setTimeout(() => b.destroy());
          } else if (b.type === 'fire') {
            if (t.fire) {
              clearTimeout(t.fireTimeout);
              t.fire = {team: this.team, frame: t.fire.frame};
            } else {
              t.fire = {team: this.team, frame: 0};
              t.fireInterval = setInterval(() => {
                t.fire.frame = t.fire.frame === 0 ? 1 : 0;
              }, 50);
            }
            t.fireTimeout = setTimeout(() => {
              clearInterval(t.fireInterval);
              t.fire = false;
            }, 2000);
          } else if (b.type === 'spike') {
            this.damagePlayer(t, {a: 1, x: t.x, y: t.y, u: this.getUsername(b.team)});
          }
        }
      });
      if (t.damage) t.damage.forEach(d => {
        d.y -= 4;
      });
      if (t.grapple) this.grapple(t);
    });

    this.d.forEach(d => {
      if (!d.c) return;
      this.pt.forEach(t => {
        if (A.collider(d.x, d.y, d.w, d.h, t.x, t.y, 80, 80) && ((d.a > 0 && this.getTeam(d.team) !== this.getTeam(t.team)) || (d.a < 0 && this.getTeam(d.team) === this.getTeam(t.team)))) {
          this.damagePlayer(t, Object.defineProperty({...d}, 'u', {value: this.getUsername(d.team)}));
        }
      });
      this.b.forEach(b => {
        if (A.collider(d.x, d.y, d.w, d.h, b.x, b.y, 100, 100)) b.damage(d.a);
      });
      this.ai.forEach(ai => {
        if (A.collider(d.x, d.y, d.w, d.h, this.x, this.y, 80, 80) && this.getTeam(ai.team) !== this.getTeam(d.team)) ai.damage(d.a);
      });
      d.c = false;
    });
  }

  grapple(t) {
    const dx = t.grapple.target.x-t.x;
    const dy = t.grapple.target.y-t.y;

    if (dx**2+dy**2 > 400) {
      const angle = Math.atan2(dy, dx);
      const mx = Math.cos(angle)*20;
      const my = Math.sin(angle)*20;

      if (this.collision(t.x+mx, t.y)) t.x += mx;
      if (this.collision(t.x, t.y+my)) t.y += my;
      t.grapple.bullet.sx = t.x+40;
      t.grapple.bullet.sy = t.y+40;
      t.socket.send({event: 'override', data: [{key: 'x', value: t.x}, {key: 'y', value: t.y}]});
      if ((!this.collision(t.x+mx, t.y) || Math.abs(mx) < 2) && (!this.collision(t.x, t.y+my) || Math.abs(my) < 2)) {
        t.grapple.bullet.destroy();
        t.grapple = false;
      }
    } else {
      t.grapple.bullet.destroy();
      t.grapple = false;
    }
  }

  collision(x, y) {
    if (x < 0 || y < 0 || x+80 > 3000 || y+80 > 3000) return false;
    for (const b of this.b) if (A.collider(x, y, 80, 80, b.x, b.y, 100, 100) && b.c) return false;
    return true;
  }

  levelReader(level) {
    let l, q, key = {'=': ['void', Infinity], '#': ['barrier', Infinity], '2': ['strong', 200], '1': ['weak', 100], '0': ['spike', 0], '3': ['gold', 300]};
    for (l = 0; l < level.length; l++) {
      for (q = 0; q < level[l].split('').length; q++) {
        const p = level[l].split('');
        if (p[q] === '@') {
          this.spawn = {x: q*100, y: l*100};
        } else if (key[p[q]]) {
          this.b.push(new Block(q*100, l*100, key[p[q]][1], key[p[q]][0], '_default_:_placeholder_', this));
        }
      }
    }
  }

  add(socket, data) {
    this.sockets.push(socket);
    data = {...data, damage: false, maxHp: data.material*50+300, hp: data.material*50+300, deathsPerMovement: 0, socket: socket, canBashed: true, shields: 0, team: data.username+':'+Math.random(), x: this.spawn.x, y: this.spawn.y, r: 0, pushback: 0, baseRotation: 0, baseFrame: 0, fire: false, healing: data.username};
    socket.send({event: 'override', data: [{key: 'x', value: this.spawn.x}, {key: 'y', value: this.spawn.y}]});
    this.pt.push(data);
    this.logs.push({m: this.joinMsg(data.username), c: '#66FF00'});
  }

  update(data) {
    this.pt.forEach(t => {
      if (t.username !== data.username) return;
      data = data.data;
      if ((t.emote !== data.emote || t.r !== data.r || t.baseFrame !== data.baseFrame || data.use.length || data.fire.length) || (!t.grapple && (t.x !== data.x || t.y !== data.y))) t.deathsPerMovement = 0;
      t.baseRotation = data.baseRotation;
      t.immune = data.immune;
      t.animation = data.animation;
      t.emote = data.emote;
      t.invis = data.invis;
      t.baseFrame = data.baseFrame;
      if (!t.grapple) {
        t.x = data.x;
        t.y = data.y;
      }
      t.r = data.r;
      if (t.ded) return;
      if (t.immune && t.class === 'fire') {
        var team = this.parseTeamExtras(t.team), type = 'fire';
        if ((data.x+80)%100>80 && [45, 90, 135].includes(t.baseRotation)) this.b.push(new Block(Math.floor(t.x/100)*100+100, Math.floor(t.y/100)*100, 100, type, team, this));
        if ((data.x)%100<20 && [225, 270, 315].includes(t.baseRotation)) this.b.push(new Block(Math.floor(t.x/100)*100-100, Math.floor(t.y/100)*100, 100, type, team, this));
        if ((data.y+80)%100>80 && [135, 180, 225].includes(t.baseRotation)) this.b.push(new Block(Math.floor(t.x/100)*100, Math.floor(t.y/100)*100+100, 100, type, team, this));
        if ((data.y)%100<20 && [315, 0, 45].includes(t.baseRotation)) this.b.push(new Block(Math.floor(t.x/100)*100, Math.floor(t.y/100)*100-100, 100, type, team, this));
      } else if (t.immune && t.class === 'builder') { // OPTIMIZE fire boost 
        this.b.forEach(b => {
          if (!Math.sqrt(Math.pow(t.x-b.x, 2)+Math.pow(t.y-b.y, 2)) < 100) return;
          b.hp = Math.min(b.maxHp, b.hp+10);
          b.s = true;
          clearTimeout(b.bar);
          b.bar = setTimeout(() => {
            b.s = false;
          }, 3000);
        });
      }
      if (data.use.includes('dynamite')) {
        this.s.forEach(s => {
          if (!this.getUsername(s.team) === t.username || s.type !== 'dynamite') return;
          this.d.push(new Damage(s.x-100, s.y-100, 200, 200, 100, s.team, this));
          setTimeout(() => {
            s.destroy();
          });
        });
      }
      if (data.use.includes('toolkit')) {
        if (t.healInterval) {
          t.healInterval = clearInterval(t.healInterval);
          clearTimeout(t.healTimeout);
        } else {
          t.healInterval = setInterval(() => {
            t.hp = Math.min(t.maxHp, t.hp+1);
            this.ai.forEach(a => {
              if (this.getUsername(a.team) === t.username) a.hp = Math.min(600, a.hp+1);
            });
          }, 100);
          t.healTimeout = setTimeout(() => {
            t.hp = t.maxHp;
            this.ai.forEach(a => {
              if (this.getUsername(a.team) === t.username) a.hp = Math.min(600, a.hp+1);
            });
            t.healInterval = clearInterval(t.healInterval);
          }, 7500);
        }
      }
      if (data.use.includes('tape')) {
        t.hp = Math.min(t.maxHp, t.hp+t.maxHp/4);
        this.ai.forEach(a => {
          if (this.getUsername(a.team) === t.username) a.hp = Math.min(600, a.hp+150);
        });
      }
      if (data.use.includes('glu')) {
        clearInterval(t.gluInterval);
        clearTimeout(t.gluTimeout);
        t.gluInterval = setInterval(() => {
          t.hp = Math.min(t.maxHp, t.hp+3);
          this.ai.forEach(a => {
            if (this.getUsername(a.team) === t.username) a.hp = Math.min(600, a.hp+3);
          });
        }, 100);
        t.gluTimeout = setTimeout(() => {
          clearInterval(t.gluInterval);
        }, 5000);
      }
      if (data.use.includes('block')) {
        const coordinates = [{r: [337.5, 360], dx: -10, dy: 80}, {r: [0, 22.5], dx: -10, dy: 80}, {r: [22.5, 67.5], dx: -100, dy: 80}, {r: [67.5, 112.5], dx: -100, dy: -10}, {r: [112.5, 157.5], dx: -100, dy: -100}, {r: [157.5, 202.5], dx: -10, dy: -100}, {r: [202.5, 247.5], dx: 80, dy: -100}, {r: [247.5, 292.5], dx: 80, dy: -10}, {r: [292.5, 337.5], dx: 80, dy: 80}];
        for (const coord of coordinates) {
          if (t.r >= coord.r[0] && t.r < coord.r[1]) {
            this.b.push(new Block(t.x+coord.dx, t.y+coord.dy, {strong: 200, weak: 100, gold: 300, mine: 0, spike: 0, fortress: 400}[data.blockType], data.blockType, t.team, this));
            break;
          }
        }
      }
      if (data.use.includes('flashbang')) {
        this.pt.forEach(tank => {
          if (!A.collider(tank.x-860, tank.y-560, 1800, 1200, t.x, t.y, 80, 80) || tank.username === t.username) return;
          tank.flashbanged = true;
          clearTimeout(tank.flashbangTimeout);
          tank.flashbangTimeout = setTimeout(() => {
            tank.flashbanged = false;
          }, 1000);
        });
      }
      if (data.use.includes('bomb')) {
        this.b.forEach(b => {
          if (A.collider(t.x, t.y, 80, 80, b.x, b.y, 100, 100)) setTimeout(b.destroy);
        });
      }
      if (data.use.includes('turret')) {
        this.ai.forEach(a => {
          if (this.getUsername(a.team) === t.username) setTimeout(() => {
            this.ai.delete(a);
          });
          this.ai.push(new Ai(t.x, t.y, 0, t.team, this));
        });
      }
      if (data.use.includes('buff')) {
        t.buff = true;
        setTimeout(() => {
          t.buff = false;
        }, 10000);
      }
      if (data.use.includes('healSwitch')) {
        var a = [];
        this.pt.forEach(tank => {
          if (this.getTeam(tank.team) === this.getTeam(t.team)) a.push(username);
        });
        t.healing = a[(a.indexOf(t.healing)+1)%a.length]; //lots of brain cells died for this line of code <R.I.P>
      }
      if (data.use.includes('mine')) this.b.push(new Block(t.x, t.y, 0, 'mine', t.team, this));
      if (data.use.includes('shield')) t.shields = Math.min(500, t.shields+100);
      if (data.airstrike) {
        this.logs.push({c: '#ffffff', m: 'attempt airstrike at '+data.airstrike.x+', '+data.airstrike.y});
        this.b.push(new Block(data.airstrike.x, data.airstrike.y, Infinity, 'airstrike', this.parseTeamExtras(t.team), this));
      }
      if (data.fire.length > 0) {
        t.pushback = -6;
        data.fire.forEach(s => {
          this.s.push(new Shot(t.x+40, t.y+40, s.x, s.y, s.type, s.r, s.type === 'grapple' ? t.username : this.parseTeamExtras(t.team), this));
        });
      }   
    });
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
          return ['updates', 'socket', 'render', 'healInterval', 'healTimeout', 'flashbangTimeout', 'grapple', 'gluInterval', 'ti', 'gluInterval', 'gluTimeout', 'fireTimeout', 'fireInterval'].includes(key) ? undefined : value;
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

  damagePlayer(victim, damage) {
    if (victim.immune || victim.ded) return;
    if (victim.shields > 0 && damage.a > 0) return victim.shields -= damage.a;
    if (victim.buff) damage.a *= .75;
    victim.hp = Math.min(victim.maxHp, victim.hp-damage.a);
    if (victim.damage) clearTimeout(victim.damage.ti);
    victim.damage = {d: (victim.damage ? victim.damage.d : 0)+damage.a, x: damage.x, y: damage.y, ti: setTimeout(() => {victim.damage = false}, 1000)};
    if (victim.hp <= 0 && this.ondeath) this.ondeath(victim, this.pt.find(t => t.username === damage.u));
  }

  deathMsg(victim, killer) {
    const deathMessages = [
      `${victim} was killed by ${killer}`,
      `${victim} was put out of their misery by ${killer}`,
      `${victim} was assassinated by ${killer}`,
      `${victim} got comboed by ${killer}`,
      `${victim} got eliminated by ${killer}`,
      `${victim} was crushed by ${killer}`,
      `${victim} had a skill issue while fighting ${killer}`,
      `${victim} was sniped by ${killer}`,
      `${victim} was exploded by ${killer}`,
      `${victim} was executed by ${killer}`,
      `${victim} was deleted by ${killer}`,
      `${victim} was killed by THE PERSON WITH KILLSTREAK ---> ${killer}`,
      `${victim} got buffed, but get nerfed harder by ${killer}`,
      `${victim} got flung into space by ${killer}`,
      `${victim} was pound into paste by ${killer}`,
      `${victim} was fed a healthy dose of explosives by ${killer}`,
      `${victim} became another number in ${killer}'s kill streak`,
      `${victim} got wrecked by ${killer}`,
      `${victim} got hit by a steamroller driven by DIO`
    ];
    return deathMessages[Math.floor(Math.random()*messages.length)];
  }

  joinMsg(player) {
    var junk = [
      '{IDOT} joined the game',
      '{IDOT} spawned',
      '{IDOT} joined',
      '{IDOT} wants a killsteak',
      '{IDOT} exists',
      "{IDOT} has been summoned",
      "{IDOT} is back",
      "a wild {IDOT} spawned",
      "{IDOT} is here to kill them all",
      "{IDOT} doesn't have anything better to do",
      "{IDOT} is here to fight to the death",
    ];
    return junk[Math.floor(Math.random() * junk.length)].replace('{IDOT}', player);
  }

  rageMsg(player) {
    var rageMessage = [
      '{IDOT}.exe is unresponsive',
      '{IDOT} left the game',
      '{IDOT} ragequit',
      '{IDOT} stopped existing',
      '{IDOT} got away',
      'wild {IDOT} fled',
      "{IDOT} disconnected",
      "{IDOT} lost internet connection",
      "{IDOT} is not found",
    ];
    return junk[Math.floor(Math.random() * junk.length)].replace('{IDOT}', player);
  }

  parseTeamExtras(s) {
    return s.replace('@leader', '').split('@requestor#')[0];
  }

  getUsername(s) {
    return this.parseTeamExtras(s).split(':')[0];
  }

  getTeam(s) {
    return this.parseTeamExtras(s).split(':')[1];
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
}

class Block {
  constructor(x, y, health, type, team, host) {
    this.x = x;
    this.y = y;
    this.maxHp = health;
    this.hp = health;
    this.type = type;
    this.host = host;
    this.s = false; // show health bar
    this.c = !['spike', 'mine', 'fire', 'airstrike'].includes(type); // collision
    this.team = team;
    if (['spike', 'mine', 'fire'].includes(type)) this.sd = setTimeout(() => this.destroy(), type === 'fire' ? 5000 : 30000);
    if (type === 'airstrike') {
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          this.host.d.push(new Damage(this.x + Math.random() * 200, this.y + Math.random() * 200, 200, 200, 200, this.team, this.host));
        }, 5000 + Math.random() * 500);
        setTimeout(this.destroy.bind(this), 6000);
      }
    } else if (type === 'mine') {
      this.a = false; // armed or not
      setTimeout(() => {
        this.a = true;
      }, 3000);
    }
  }

  damage(d) {
    this.hp = Math.max(this.hp - d, 0);
    if (this.hp !== Infinity) {
      this.s = true;
      clearTimeout(this.bar);
      this.bar = setTimeout(() => {
        this.s = false;
      }, 3000);
    }
    if (this.hp <= 0) this.destroy();
  }

  destroy() {
    clearTimeout(this.sd);
    if (this.type === 'mine') this.host.d.push(new Damage(this.x, this.y, 100, 100, 50, this.team, this.host));
    const index = this.host.b.indexOf(this);
    if (index !== -1) this.host.b.splice(index, 1);
  }
}

class Shot {
  constructor(x, y, xm, ym, type, rotation, team, host) {
    this.settings = {damage: {bullet: 20, shotgun: 20, grapple: 0, powermissle: 100, megamissle: 200, healmissle: -300, dynamite: 0, fire: 0}, speed: {bullet: 1, shotgun: .8, grapple: 2, powermissle: 1.5, megamissle: 1.5, healmissle: 1.5, dynamite: .8, fire: .9}};

    this.damage = 0;
    this.team = team;
    this.r = rotation;
    this.type = type;
    this.host = host;
    this.e = Date.now();

    var d = 18;
    this.xm = xm*(d/Math.sqrt(xm*xm+ym*ym));
    this.ym = ym*(d/Math.sqrt(xm*xm+ym*ym));
    var data = Shot.calc(x, y, xm, ym);
    this.x = data.x;
    this.y = data.y;

    if (xm == 0 && ym == 1) {
      this.x = x;
      this.y = 35+y;
    } else if (xm == -1 && ym == 0) {
      this.x = -35+x;
      this.y = y;
    } else if (xm == 0 && ym == -1) {
      this.x = x;
      this.y = -35+y;
    } else if (xm == 1 && ym == 0) {
      this.x = 35+x;
      this.y = y;
    }
    this.sx = this.x;
    this.sy = this.y;
    
    var pt = A.search(this.host.pt, 'username', this.host.getUsername(this.team));
    if (!pt) this.destroy();
    this.damage = this.settings.damage[this.type]/500*pt.maxHp*(pt.buff ? 1.5 : 1);
    this.md = this.damage;
    this.xm *= this.settings.speed[this.type];
    this.ym *= this.settings.speed[this.type];
  }

  static calc(x, y, xm, ym) {
    const sgn = ((ym / xm) * -20 - (ym / xm) * 20) < 0 ? -1 : 1;
    const sqrtVal = Math.sqrt(-40 * -40 + ((ym / xm) * -20 - (ym / xm) * 20) * ((ym / xm) * -20 - (ym / xm) * 20));
    const sqrtTerm = Math.sqrt(1000 * (sqrtVal * sqrtVal) - ((20 * (ym / xm) * -20 - (-20) * (ym / xm) * 20) * (20 * (ym / xm) * -20 - (-20) * (ym / xm) * 20)));

    const x1 = ((20 * (ym / xm) * -20 - (-20) * (ym / xm) * 20) * ((ym / xm) * -20 - (ym / xm) * 20) + sgn * -40 * sqrtTerm) / (sqrtVal * sqrtVal);
    const x2 = ((20 * (ym / xm) * -20 - (-20) * (ym / xm) * 20) * ((ym / xm) * -20 - (ym / xm) * 20) - sgn * -40 * sqrtTerm) / (sqrtVal * sqrtVal);
    const y1 = (-(20 * (ym / xm) * -20 - (-20) * (ym / xm) * 20) * -40 + Math.abs(((ym / xm) * -20 - (ym / xm) * 20)) * sqrtTerm) / (sqrtVal * sqrtVal);
    const y2 = (-(20 * (ym / xm) * -20 - (-20) * (ym / xm) * 20) * -40 - Math.abs(((ym / xm) * -20 - (ym / xm) * 20)) * sqrtTerm) / (sqrtVal * sqrtVal);

    return {x: ym >= 0 ? x1 * 2 + x : x2 * 2 + x, y: ym >= 0 ? y1 * 2 + y : y2 * 2 + y};
  }

  collision() {
    var key = {bullet: false, shotgun: false, powermissle: 100, megamissle: 150, healmissle: 100, fire: false};

    var r = A.each(this.host.pt, function(i, s, host, key) {
      if (A.collider(this.x, this.y, 80, 80, s.x, s.y, 10, 10) && !this.ded) {
        if (s.type === 'grapple') {
          if (this.grapple) this.grapple.bullet.destroy();
          this.grapple = {target: A.search(host.pt, 'username', host.getUsername(s.team)), bullet: s};
          s.update = () => {};
          return false;
        } else if (s.type === 'dynamite') {
          A.assign(s, 'target', this, 'offset', [this.x-s.x, this.y-s.y], 'update', function() {
            this.x = this.target.x-this.offset[0];
            this.y = this.target.y-this.offset[1];
          });
          return false;
        } else if (s.type === 'fire') {
          if (this.fire) {
            clearTimeout(this.fireTimeout);
            this.fire = {team: s.team, frame: this.fire.frame};
          } else {
            this.fire = {team: s.team, frame: 0};
            this.fireInterval = setInterval(function() {this.fire.frame = this.fire.frame === 0 ? 1 : 0}.bind(this), 50);
          }
          this.fireTimeout = setTimeout(function() {
            clearInterval(this.fireInterval);
            this.fire = false;
          }.bind(this), 2000);
        } else {
          if (key[s.type]) host.d.push(new Damage(s.x-key[s.type]/2+10, s.y-key[s.type]/2+10, key[s.type], key[s.type], s.damage, s.team, host)); else if (host.getTeam(this.team) !== host.getTeam(s.team)) host.damagePlayer(this, {a: s.damage, x: s.x, y: s.y, u: host.getUsername(s.team)});
          return true;
        }
      }
    }, null, null, this, this.host, key);
    if (r !== undefined) return r;

    var r = A.each(this.host.ai, function(i, s, host, key) {
      if (A.collider(this.x, this.y, 80, 80, s.x, s.y, 10, 10)) {
        if (s.type === 'dynamite') {
          A.assign(s, 'target', this, 'offset', [this.x-s.x, this.y-s.y], 'update', function() {
            this.x = this.target.x-this.offset[0];
            this.y = this.target.y-this.offset[1];
          });
          return false;
        } else {
          if (key[s.type]) host.d.push(new Damage(s.x-key[s.type]/2+10, s.y-key[s.type]/2+10, key[s.type], key[s.type], s.damage, s.team, host)); else if (host.getTeam(this.team) !== host.getTeam(s.team)) this.damage(s.damage);
          return true;
        }
      }
    }, null, null, this, this.host, key);
    if (r !== undefined) return r;

    var r = A.each(this.host.b, function(i, s, host, key) {
      if (A.collider(this.x, this.y, 100, 100, s.x, s.y, 10, 10) && this.c) {
        if (s.type === 'grapple') {
          var pt = A.search(host.pt, 'username', host.getUsername(s.team));
          if (pt.grapple) pt.grapple.bullet.destroy();
          pt.grapple = {target: this, bullet: s};
        } else if (s.type === 'dynamite') {
          A.assign(s, 'target', this, 'offset', [this.x-s.x, this.y-s.y], 'update', function() {
            this.x = this.target.x-this.offset[0];
            this.y = this.target.y-this.offset[1];
          });
          return false;
        } else if (s.type === 'fire') {
          host.b.push(new Block(this.x, this.y, Infinity, 'fire', s.team, host));
          return true;
        } else {
          if ((this.type === 'fortress' || this.type === 'mine') && host.getTeam(this.team) === host.getTeam(s.team)) return;
          if (key[s.type]) host.d.push(new Damage(s.x-key[s.type]/2+10, s.y-key[s.type]/2+10, key[s.type], key[s.type], s.damage, s.team, host)); else this.damage(s.damage);
          return true;
        }
      }
    }, null, null, this, this.host, key);
    if (r !== undefined) return r;

    if (this.x < 0 || this.x > 3000 || this.y < 0 || this.y > 3000) {
      if (this.type === 'grapple') {
        var pt = A.search(this.host.pt, 'username', this.host.getUsername(this.team));
        if (pt.grapple) pt.grapple.bullet.destroy();
        pt.grapple = {target: {x: this.x, y: this.y}, bullet: this};
      }
      return true;
    }
    return false;
  }

  update() {
    const time = (Date.now() - this.e) / 15;
    this.x = time * this.xm + this.sx;
    this.y = time * this.ym + this.sy;
    this.d = Math.sqrt(Math.pow(this.x - this.sx, 2) + Math.pow(this.y - this.sy, 2));
    if (this.type === 'shotgun') {
      this.damage = this.md - (this.d / 300) * this.md;
      if (this.d >= 300) this.destroy();
    }
    if (this.type === 'dynamite') this.r += 5;
    if (this.collision()) this.destroy();
  }

  destroy() {
    const index = this.host.s.indexOf(this);
    if (index !== -1) this.host.s.splice(index, 1);
  }
}

class Damage {
  constructor(x, y, w, h, a, team, host) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.a = a;
    this.team = team;
    this.c = true;
    this.host = host;
    this.f = 0;
    setInterval(function() {
      this.f++;
    }.bind(this), 18);
    setTimeout(function() {
      this.destroy();
    }.bind(this), 200);
  }

  destroy() {
    const index = this.host.d.indexOf(this);
    if (index !== -1) this.host.d.splice(index, 1);
  }
}

class Ai {
  constructor(x, y, type, team, host) {
    /*
      0 -> turret
      1 -> normal
      2 -> shotgun
    */
    this.x = x;
    this.y = y;
    this.r = 0;
    this.team = team;
    this.host = host;
    this.hp = 600;
    this.p = 0;
    this.setup = false;
    setTimeout(function() {
      this.setup = true;
    }.bind(this), 1000);
    if (type === 0) {
      this.turret = true;
    } else {
      this.turret = false;
    }
    this.canFire = true;
    var l = 0;
    while (l < this.host.pt.length) {
      if (this.host.pt[l].username === this.host.getUsername(this.team)) {
        this.cosmetic = this.host.pt[l].cosmetic;
      }
      l++;
    }
  }

  update() {
    if (!this.setup) return;
    if (!this.identify()) {
      return
    };
    this.aim();
    if (this.canFire) {
      this.fire();
      this.canFire = false;
      setTimeout(function() {this.canFire = true}.bind(this), 300);
    }
    if (this.pushback !== 0) this.pushback += 0.5;
  }

  toAngle(x, y) {
    var angle = Math.atan2(x, y) * 180 / Math.PI
    angle = -angle //-90;
    if (angle < 0) {
      angle += 360;
    }
    if (angle >= 360) {
      angle -= 360;
    }
    return angle;
  }

  toPoint(angle) {
    var theta = (-angle) * Math.PI / 180;
    var y = Math.cos(theta);
    var x = Math.sin(theta);
    if (x < 0) {
      if (y < 0) {
        return {
          x: -1,
          y: Math.round(-Math.abs(y / x) * 1000) / 1000,
        };
      } else {
        return {
          x: -1,
          y: Math.round(Math.abs(y / x) * 1000) / 1000,
        };
      }
    } else {
      if (y < 0) {
        return {
          x: 1,
          y: Math.round(-Math.abs(y / x) * 1000) / 1000,
        };
      } else {
        return {
          x: 1,
          y: Math.round(Math.abs(y / x) * 1000) / 1000,
        };
      }
    }
  }

  identify() {
    var targets = [];
    A.each(this.host.pt, function(i, ai, host, targets) {if (host.getTeam(this.team) !== host.getTeam(ai.team) && !this.ded && (!this.invis || ai.hp !== 400)) targets.push({idot: this, distance: Math.sqrt(Math.pow(this.x-ai.x, 2)+Math.pow(this.y-ai.y, 2))})}, null, null, this, this.host, targets);
    A.each(this.host.ai, function(i, ai, host, targets) {if (host.getTeam(this.team) !== host.getTeam(ai.team)) targets.push({idot: this, distance: Math.sqrt(Math.pow(this.x-ai.x, 2)+Math.pow(this.y-ai.y, 2))})}, null, null, this, this.host, targets);
    if (targets.length === 0) {
      this.r += 1;
      return false; // no idots :(
    }
    targets.sort((a, b) => {return a.distance - b.distance}); // sort array to closest target
    if (targets[0].distance > 1000) {
      this.r += 1;
      return false; // out of range
    }
    this.target = targets[0].idot; // select closest idot
    return true;
  }

  aim() {
    this.r = this.toAngle(this.target.x - this.x, this.target.y - this.y);
  }

  fire() {
    this.p = -3;
    var data = this.toPoint(this.r);
    this.host.s.push(new Shot(this.x + 40, this.y + 40, data.x, data.y, 'bullet', 0, this.team, this.host));
  }

  damage(d) {
    this.hp -= d;
    if (this.hp <= 0) {
      this.host.ai.splice(this.host.ai.indexOf(this), 1);
    }
  }
}

class FFA extends Engine {
  constructor(ip) {
    super(ip, ffaLevels);
  }

  add(socket, data) {
    /*
      onjoin
    */
    super.add(socket, data);
  }

  update(data) {
    /*
      on update
    */
    super.update(data);
  }  

  disconnect(socket, code, reason) {
    super.disconnect(socket, code, reason);
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

class DUELS extends Engine {
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

}

Server.use(Core);
if (!SETTINGS.export) Server.listen(SETTINGS.port);
