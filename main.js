var roleHarvester = require('harvester');// 采集资源至虫巢
let roleUpgrader = require('role.upgrader');// 升级控制器
let roleBuilder = require('role.builder');// 建筑
let roleExtension = require('role.extension');// 运输能量至虫巢或扩容器
module.exports.loop = function () {
    var harvesters = _.filter(Game.creeps, (creep) => creep);

    if(harvesters.length < 20) {
        var newName = 'Harvester' + Game.time;
        Game.spawns['MrWamG'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'harvester'}});
    }
    for(let i = 0;i<harvesters.length && i < 5;i++) {
        let creep = harvesters[i];
        roleExtension.run(creep);
    }
    for(let i = 5;i<harvesters.length;i++) {
        let creep = harvesters[i];
        roleUpgrader.run(creep);
    }
}