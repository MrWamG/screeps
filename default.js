module.exports.loop = function () {
    Game.spawns['MrWamG'].spawnCreep( [WORK, CARRY, MOVE], 'creep1' );
    Game.spawns['MrWamG'].spawnCreep( [WORK, CARRY, MOVE], 'creep2' );
    Game.spawns['MrWamG'].spawnCreep( [WORK, CARRY, MOVE], 'creep3' );
    Game.spawns['MrWamG'].spawnCreep( [WORK, CARRY, MOVE], 'creep4' );
    Game.spawns['MrWamG'].spawnCreep( [WORK, CARRY, MOVE], 'creep5' );
    Game.spawns['MrWamG'].spawnCreep( [WORK, CARRY, MOVE], 'creep6' );
    Game.spawns['MrWamG'].spawnCreep( [WORK, CARRY, MOVE], 'creep7' );
    Game.spawns['MrWamG'].spawnCreep( [WORK, CARRY, MOVE], 'creep8' );
    Game.spawns['MrWamG'].spawnCreep( [WORK, CARRY, MOVE], 'creep9' );
    Game.spawns['MrWamG'].spawnCreep( [WORK, CARRY, MOVE], 'creep10' );
    Game.spawns['MrWamG'].spawnCreep( [WORK, CARRY, MOVE], 'creep11' );
    Game.spawns['MrWamG'].spawnCreep( [WORK, CARRY, MOVE], 'creep12' );
    Game.spawns['MrWamG'].spawnCreep( [WORK, CARRY, MOVE], 'creep13' );
    Game.spawns['MrWamG'].spawnCreep( [WORK, CARRY, MOVE], 'creep14' );
    Game.spawns['MrWamG'].spawnCreep( [WORK, CARRY, MOVE], 'creep15' );
    Game.spawns['MrWamG'].spawnCreep( [WORK, CARRY, MOVE], 'creep16' );
    Game.spawns['MrWamG'].spawnCreep( [WORK, CARRY, MOVE], 'creep17' );
    Game.spawns['MrWamG'].spawnCreep( [WORK, CARRY, MOVE], 'creep18' );
    Game.spawns['MrWamG'].spawnCreep( [WORK, CARRY, MOVE], 'creep19' );
    Game.spawns['MrWamG'].spawnCreep( [WORK, CARRY, MOVE], 'creep20' );
    Game.spawns['MrWamG'].spawnCreep( [WORK, CARRY, MOVE], 'creep21' );
    Game.spawns['MrWamG'].spawnCreep( [WORK, CARRY, MOVE], 'creep22' );
	for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        const target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        // 总量50 最低0
        // 接下来要解决的是如何一旦到达0后一直增加到50才触发分支
        if(creep.store.getFreeCapacity() > 0){
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }else{

        }
        // if(creep.store.getFreeCapacity() > 0) {
        //     var sources = creep.room.find(FIND_SOURCES);
        //     if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
        //         creep.moveTo(target);
        //     }
        // }
        // else {
        //     if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        //         creep.moveTo(creep.room.controller);
        //     }
            
        // }
    }
}

// if(creep.transfer(Game.spawns['MrWamG'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
//     creep.moveTo(Game.spawns['MrWamG']);
// }

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.store[RESOURCE_ENERGY] == 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
	}
};

module.exports = roleUpgrader;

/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('harvester');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run:function(creep){
        const target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);

        if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
        else {
            if(creep.transfer(Game.spawns['MrWamG'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['MrWamG']);
            }
        }
    }
};