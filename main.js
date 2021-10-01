const roleUpgrader = require('role.upgrader'); // 升级控制器
const roleBuilder = require('role.builder'); // 建筑
const roleExtension = require('role.extension'); // 运输能量至虫巢或扩容器
const roleClaim = require('role.claim'); // 占领 
const roleRoad = require('role.road'); // 道路维护
const methods = require('methods');// 方法集合
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

    methods.role_spawn('harvester',4,[
        WORK,WORK,WORK,WORK,
        CARRY,CARRY,
        MOVE,MOVE,MOVE
    ]);

    methods.role_spawn('upgrade',6,[
        WORK,WORK,WORK,WORK,
        CARRY,CARRY,
        MOVE,MOVE,MOVE
    ]);

    for (let i = 0; i < creepArr.length; i++) {
        let creep = creepArr[i];
        if(creep.memory.role === 'harvester'){
            roleExtension.run(creep);
        }else if(creep.memory.role === 'upgrade'){
            roleUpgrader.run(creep);
        }
    }

    console.log('creeps num: ' + creepArr.length);
}