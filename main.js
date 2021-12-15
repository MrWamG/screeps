const roleUpgrader = require('role.upgrader'); // 升级控制器
const roleBuilder = require('role.builder'); // 建筑
const roleExtension = require('role.extension'); // 运输能量至虫巢或扩容器
const roleClaim = require('role.claim'); // 占领 
const methods = require('methods'); // 方法集合
const structure_list = require('structure_list'); // 将所有存在过的建筑存放在room的memory中，当建筑不存在后将自动创造工地
const tower = require('tower'); // 防御塔功能运行
module.exports.loop = function () {
    structure_list.run();
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
        console.log('room',JSON.stringify(room))
        // 敌人集合
        let enemys = room.find(FIND_CREEPS, {
            filter: item => {
                return !item.my
            }
        });
        // 房间中用于孵化的能量总值
        let roomEnergy = methods.getSpawnEnergy(room);

        /** 当前房间的孵化器
         * @type {Array}
         */
        let spawn = room.find(FIND_MY_SPAWNS);
        
        // 最大的工作部件，最低不得小于1，200为1carry + 1move + 生产creep本身需要的100能量
        let maxWork = Math.max(1, Math.floor((roomEnergy - 200) / BODYPART_COST['work']));
        console.log('maxWork', maxWork);
        // Tower防御行为运转中
        tower.run(room, enemys);

        console.log(room.name + '中可用于孵化的能量有:' + roomEnergy)

        // 须要孵化的creep身份及其部件配置
        let role_spawn_arr = [
            {
                role_name: 'harvester',
                spawn:spawn[0],
                num: 2,
                body_json: {
                    'work': 1,
                    'carry': 1,
                    'move': 1
                }
            },{
                role_name: 'upgrade',
                spawn:spawn[0],
                num: 4,
                body_json: {
                    'work': 3,
                    'carry': 2,
                    'move': 2
                }
            },{
                role_name: 'builder',
                spawn:spawn[0],
                num: 2,
                body_json: {
                    'work': 1,
                    'carry': 1,
                    'move': 1
                }
            }
        ];

        // 须要生产的基础creep数量
        let base_creep_num = role_spawn_arr.reduce((total,item)=>{
            return total + item.num
        },0)

        console.log('base_creep_num',base_creep_num)
        // 孵化creep
        if(room.name == 'W41S54'){
            for(let i in role_spawn_arr){
                methods.role_spawn(role_spawn_arr[i]);
            }
        }else if(room.name == 'W42S54'){
            methods.role_spawn({
                role_name: 'harvester',
                spawn:spawn[0],
                num: 2,
                body_json: {'work': 1,'carry': 1,'move': 1}
            });
            methods.role_spawn({
                role_name: 'upgrade',
                spawn:spawn[0],
                num: 2,
                body_json: {'work': 1,'carry': 1,'move': 1}
            });
        }
        for (let i = 0; i < creepArr.length; i++) {
            let creep = creepArr[i];
            if (creep.memory.role === 'harvester') {
                if(room.name == 'W41S54'){
                    roleExtension.run(creep, 1);
                }else if(room.name == 'W42S54'){
                    roleExtension.run(creep, 0);
                }
            } else if (creep.memory.role === 'upgrade') {
                roleUpgrader.run(creep);
            } else if (creep.memory.role === 'builder') {
                roleBuilder.run(creep, 0, room);
            } else if (creep.memory.role === 'claim') {
                roleClaim.run(creep,'W42S54')
            }
        }

        // 只有当基础creep的数量大于等于须要生产的基础creep数量时才会生产claimer
        // 我毕竟须要保障我当前基地的基本运营
        // if(creepArr.filter(item=>{return item.memory.role !== 'claim'}).length >= base_creep_num){
        //     methods.role_spawn({
        //         role_name: 'claim',
        //         spawn_name: 'Spawn1',
        //         num: 1,
        //         body_json: {
        //             'claim': 1,
        //             'move': 6
        //         }
        //     });
        // }
    } // 每个房间的循环
    
    console.log('creeps num: ' + creepArr.length);
}