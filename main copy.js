const roleUpgrader = require('role.upgrader'); // 升级控制器
const roleBuilder = require('role.builder'); // 建筑
const roleExtension = require('role.extension'); // 运输能量至虫巢或扩容器
const roleClaim = require('role.claim'); // 占领 
const roleRoad = require('role.road'); // 道路维护
module.exports.loop = function () {
    roleRoad.run();
    let creepArr = _.filter(Game.creeps, (creep) => creep);
    // for (let name in Game.rooms) {
    //     console.log("房间 " +name+"有"+Game.rooms[name].energyAvailable+"能量");
    // }

    for(let name in Memory.creeps){
        if(!Game.creeps[name]){
            delete Memory.creeps[name];
        }
    }
    function spawn_creeper({body,memory}){
        let newName = 'Harvester' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(body, newName, {
            memory,
        });
    }
    if (creepArr.length < 4) {
        spawn_creeper({
            body:[ WORK,WORK,WORK,WORK, CARRY,CARRY,MOVE,MOVE,MOVE],
            memory:{
                role: 'harvester'
            }
        })
    }else if (creepArr.length < 10) {
        spawn_creeper({
            body:[ WORK,WORK,WORK,WORK, CARRY,CARRY,MOVE,MOVE,MOVE],
            memory:{ 
                role: 'upgrade'
            }
        })
    }
    for (let i = 0; i < creepArr.length; i++) {
        let creep = creepArr[i];
        if(i<2){
            roleExtension.run(creep,1);
        }else if(i<4){
            roleExtension.run(creep);
        }else if(i<10){
            roleUpgrader.run(creep);
        }else{
            roleClaim.run(creep,'E32S36');
            
        }
    }
    console.log('creeps num: ' + creepArr.length);
}