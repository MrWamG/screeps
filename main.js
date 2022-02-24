
const main = {
    roleUpgrader:require('role.upgrader'), // 升级控制器
    roleBuilder:require('role.builder'), // 建筑
    roleExtension:require('role.extension'), // 运输能量至虫巢或扩容器
    roleClaim:require('role.claim'), // 占领 
    roleTransfer:require('role.transfer'), // 运输者，目前负责将storage中的资源运输至terminal
    structure_list:require('structure_list'), // 将所有存在过的建筑存放在room的memory中，当建筑不存在后将自动创造工地
    tower:require('tower'), // 防御塔功能运行
}

const room_run = {
    W27S54:require('W27S54'),
    W28S54:require('W28S54'),
}
const Claim = require('Claim');
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

        Claim.run({
            room_name:'W27S54',
            base_creep_num:7,
            target_room_name:'W28S54',
            creepArr
        })
        console.log(`<span style="color:#ff0000">${room.name}↑↑↑</span>`)
    } // 每个房间的循环
    
}