var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {
    let rooms = Game.rooms;
    for(let room_index in rooms){
        let room = rooms[room_index];
        let structures = room.find(FIND_STRUCTURES,{
            filter: (item) => {
                return item.structureType == STRUCTURE_ROAD
            }
        })
        for(let structure_index in structures){
            let structure = structures[structure_index];
            if(structure.ticksToDecay > 20){
                if(!room.memory.structure_list){
                    room.memory.structure_list = [];
                }else{
                    let index = room.memory.structure_list.findIndex(item=>{
                        return item.pos.x == structure.pos.x && item.pos.y == structure.pos.y
                    })
                    if(index == -1){
                        room.memory.structure_list.push({
                            pos:structure.pos,
                            structureType:structure.structureType
                        })
                    }
                }
            }
        }
        console.log(JSON.stringify(room.memory))
        console.log(JSON.stringify(structures))
        for(let j in room.memory.structure_list){
            let structure = room.memory.structure_list[j];
            room.createConstructionSite(structure.pos.x, structure.pos.y, structure.structureType);
        }
    }
}