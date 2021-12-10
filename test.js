var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {
    for(let i in Game.rooms){
        let room = Game.rooms[i];
        let towers = room.find(FIND_MY_STRUCTURES,{
            filter:item=>{
                return item.structureType == STRUCTURE_TOWER
            }
        });
        let enemys = room.find(FIND_CREEPS,{
            filter:item=>{
                return !item.my
            }
        });
        // console.log(JSON.stringify(enemys))
        if(enemys.length){
            towers.map(item=>{
                let attack = item.attack(enemys[0]);
                if(attack !== OK){
                    console.log('防御塔=>',JSON.stringify(attack))
                }
            })
        }
    }
}