const tower = require('tower'); // 防御塔功能运行
const roleExtension = require('role.extension'); // 运输能量至虫巢或扩容器
const roleTransfer = require('role.transfer'); // 搬运工
global.methods = require('method');
module.exports.loop = function () {
    let creepArr = _.filter(Game.creeps, (creep) => creep);
    for(let i in creepArr){
        let creep = creepArr[i];
        roleTransfer.run(
            creep,
            RESOURCE_ENERGY
        );
    }

    // 房间循环
    for(let room_index in Game.rooms){
        let room = Game.rooms[room_index];
        
        // 敌人集合
        let enemys = room.find(FIND_CREEPS,{
            filter:item=>{
                return !item.my
            }
        });

        // 房间内Spawn和extension的能量总值
        let roomEnergy = room.find(FIND_STRUCTURES,{
            filter:item=>{
                return item.structureType === STRUCTURE_SPAWN || item.structureType === STRUCTURE_EXTENSION
            }
        }).reduce((total,item)=>{
            return total + Number(item.store.energy);
        },0)
        console.log(JSON.stringify(roomEnergy));
    
    }
}