
const main = {
    roleUpgrader:require('role.upgrader'), // 升级控制器
    roleBuilder:require('role.builder'), // 建筑
    roleExtension:require('role.extension'), // 运输能量至虫巢或扩容器
    roleClaim:require('role.claim'), // 占领 
    structure_list:require('structure_list'), // 将所有存在过的建筑存放在room的memory中，当建筑不存在后将自动创造工地
    tower:require('tower'), // 防御塔功能运行
}

const room_run = {
    W41S54:require('W41S54'),
    W42S54:require('W42S54'),
}
global.methods = require('methods');
module.exports.loop = function () {
    // main.structure_list.run();
    if (Game.cpu.bucket >= 10000) {
        Game.cpu.generatePixel();
    }
    // 删除无用的creep内存
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    let creepArr = _.filter(Game.creeps, (creep) => creep);

    // 每个房间的循环
    for (let room_index in Game.rooms) {
        // 当前房间
        let room = Game.rooms[room_index];
        console.log(`<span style="color:#00ffff">${room.name}↓↓↓</span>`)
        
        // 敌人集合
        let enemys = room.find(FIND_CREEPS, {
            filter: item => {
                return !item.my
            }
        });
        // 房间中用于孵化的能量总值
        let roomEnergy = global.methods.getSpawnEnergy(room);

        /** 当前房间的孵化器
         * @type {Array}
         */             
        let spawn = room.find(FIND_MY_SPAWNS);
        
        // 最大的工作部件，最低不得小于1，200为1carry + 1move + 生产creep本身需要的100能量
        let maxWork = Math.max(1, Math.floor((roomEnergy - 200) / BODYPART_COST['work']));
        console.log('maxWork', maxWork);
        // Tower防御行为运转中
        main.tower.run(room, enemys);

        console.log(room.name + '中可用于孵化的能量有:' + roomEnergy)
        // 孵化creep
        for(let i in room_run){
            if(room.name == i){
                room_run[i].run(main,creepArr,spawn,room);
                console.log(
                    room.name + '中creeps num: '
                    + creepArr.filter(item=>{
                        return item.room.name == room.name
                    }).length
                );
            }
        }
        
        // 只有当基础creep的数量大于等于须要生产的基础creep数量时才会生产claimer
        // 我毕竟须要保障我当前基地的基本运营
        // if(creepArr.filter(item=>{return item.memory.role !== 'claim'}).length >= base_creep_num){
        //     global.methods.role_spawn({
        //         role_name: 'claim',
        //         spawn_name: 'Spawn1',
        //         num: 1,
        //         body_json: {
        //             'claim': 1,
        //             'move': 6
        //         }
        //     });
        // }
        
        console.log(`<span style="color:#ff0000">${room.name}↑↑↑</span>`)
    } // 每个房间的循环
    
}