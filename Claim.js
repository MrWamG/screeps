const roleClaim = require('role.claim');
const roleBuilder = require('role.builder'); // 建筑
/**
 * 占领模块
 * @param {String} room_name 产出claimer的房间
 * @param {Number} base_creep_num 产出claimer房间中存在的爬需要大于多少才开始生产claimer
 * @param {String} target_room_name 要占领的房间名
 */
module.exports = {
    run:function(
        room_name,
        base_creep_num,
        target_room_name
    ){
        // 如果要占领的房间中的控制器已经是自己的了，则生产builder去该房间里建造
        if(Game.rooms[target_room_name] && Game.rooms[target_room_name].controller.my){
            global.methods.role_spawn({
                role_name: 'claimBuilder',
                spawn: Game.rooms[room_name].find(FIND_MY_SPAWNS)[0],
                num: 1,
                body_json: {'work': 1,'carry': 1,'move': 1}
            });
        }else if(Game.rooms[room_name].find(FIND_CREEPS,{// 为了维持我该基地的基本运营，只有当该房间内的基础运转creep大于我给定的base_creep_num时才会生产用以占领房间的爬
            filter(creep){
                return creep.memory.role !== 'claim'
            }
        }).length >= base_creep_num){
            global.methods.role_spawn({
                role_name: 'claim',
                spawn: Game.rooms[room_name].find(FIND_MY_SPAWNS)[0],
                num: 1,
                body_json: {
                    'claim': 1,
                    'move': 6
                }
            });
        }

        for(let i in Game.creeps){
            if(Game.creeps[i].memory.role === 'claim'){
                roleClaim.run(Game.creeps[i],target_room_name);
            }else if(Game.creeps[i].memory.role === 'claimBuilder'){
                roleBuilder.run(Game.creeps[i],0,'',target_room_name);
            }
        }
    }
}