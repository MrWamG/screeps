
const main = {
    roleUpgrader:require('role.upgrader'), // 升级控制器
    roleBuilder:require('role.builder'), // 建筑
    roleExtension:require('role.extension'), // 运输能量至虫巢或扩容器
}

const room_run = {
    sim:require('sim'),
}

const war = require('war');

global.methods = require('methods');
module.exports.loop = function () {
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

    war.run({
        room_name:'sim',
        creep_num:2,
        creepArr
    })

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

        console.log(`<span style="color:#ff0000">${room.name}↑↑↑</span>`)
    } // 每个房间的循环
    
}