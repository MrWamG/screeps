var roleHarvester = require('harvester');
let roleUpgrader = require('role.upgrader');
module.exports.loop = function () {
    var harvesters = _.filter(Game.creeps, (creep) => creep);

    if(harvesters.length < 20) {
        var newName = 'Harvester' + Game.time;
        Game.spawns['MrWamG'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'harvester'}});
    }
    for(let i = 0;i<harvesters.length && i < 2;i++) {
        let creep = harvesters[i];
        roleHarvester.run(creep);
    }
    for(let i = 2;i<harvesters.length;i++) {
        let creep = harvesters[i];
        roleUpgrader.run(creep);
    }
}