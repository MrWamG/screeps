const roleHarvester = require('harvester'); // 采集资源至虫巢
const roleUpgrader = require('role.upgrader'); // 升级控制器
const roleBuilder = require('role.builder'); // 建筑
const roleExtension = require('role.extension'); // 运输能量至虫巢或扩容器
module.exports.loop = function () {
    let creepArr = _.filter(Game.creeps, (creep) => creep);
    
    // for (let name in Game.rooms) {
    //     console.log("房间 " +name+"有"+Game.rooms[name].energyAvailable+"能量");
    // }

    for(let name in Memory.creeps){
        if(!Game.creeps[name]){
            delete Memory.creeps[name];
        }
    }

    if (creepArr.length < 20) {
        let newName = 'Harvester' + Game.time;
        Game.spawns['MrWamG'].spawnCreep([ WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], newName, {
            memory: {
                role: 'harvester'
            }
        });
    }
    for (let i = 0; i < creepArr.length; i++) {
        let creep = creepArr[i];
        if(i<6){
            roleExtension.run(creep);
        }else if(i<10){
            roleExtension.run(creep,1);
        }else{
            roleUpgrader.run(creep);
        }
    }
    // console.log('creeps num: ' + creepArr.length);
}