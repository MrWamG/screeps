var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {
    let rooms = Game.rooms;
    let creepArr = _.filter(Game.creeps, (creep) => creep);
    for (let i = 0; i < creepArr.length; i++) {
        let creep = creepArr[i];
        for(let room_index in rooms){
            let room = rooms[room_index];
            let roads = room.find(FIND_STRUCTURES,{
                filter: (item) => {
                    return item.structureType == STRUCTURE_ROAD
                }
            })
            for(let road_index in roads){
                let road = roads[road_index];
                if(road.hits < road.hitsMax){
                    if (creep.memory.status == 0) {
                        let sources = creep.room.find(FIND_SOURCES);
                        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(sources[0]);
                        }
                        if (creep.carry.energy == creep.carryCapacity) {
                            creep.memory.status = 1;
                        }
                    }else{
                        if (creep.carry.energy == 0) {
                            creep.memory.status = 0;
                        }
                        if(creep.repair(road) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(road);
                        }
                    }
                }
                console.log(JSON.stringify(roads))
            }
        }
    }
}