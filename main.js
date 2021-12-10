const roleUpgrader = require('role.upgrader'); // 升级控制器
const roleBuilder = require('role.builder'); // 建筑
const roleExtension = require('role.extension'); // 运输能量至虫巢或扩容器
const roleClaim = require('role.claim'); // 占领 
const methods = require('methods');// 方法集合
const structure_list = require('structure_list'); // 将所有存在过的建筑存放在room的memory中，当建筑不存在后将自动创造工地
const tower = require('tower'); // 防御塔功能运行
module.exports.loop = function () {
    structure_list.run();
    let creepArr = _.filter(Game.creeps, (creep) => creep);
    
    // 删除无用的creep内存
    for(let name in Memory.creeps){
        if(!Game.creeps[name]){
            delete Memory.creeps[name];
        }
    }
    
    // 每个房间的循环
    for(let room_index in Game.rooms){
        let room = Game.rooms[room_index];

        // 敌人集合
        let enemys = room.find(FIND_CREEPS,{
            filter:item=>{
                return !item.my
            }
        });
        // 房间中用于孵化的能量总值
        let roomEnergy = methods.getSpawnEnergy(room);
        // 最大的工作部件，最低不得小于1，200为1 carry + 1 move + 生产creep本身需要的100能量
        let maxWork = Math.max(1,Math.floor((roomEnergy - 200) / BODYPART_COST['work']));
        
        // Tower防御行为运转中
        tower.run(room,enemys);

        console.log(room.name + '中可用于孵化的能量有:' + roomEnergy)
        methods.role_spawn({
            role_name:'harvester',
            spawn_name:'Spawn1',
            num:2,
            body_json:{'work':maxWork,'carry':1,'move':1}
        });
        
        methods.role_spawn({
            role_name:'upgrade',
            spawn_name:'Spawn1',
            num:5,
            body_json:{'work':maxWork,'carry':1,'move':1}
        });
        
        methods.role_spawn({
            role_name:'builder',
            spawn_name:'Spawn1',
            num:2,
            body_json:{'work':1,'carry':1,'move':1}
        });
        
        for (let i = 0; i < creepArr.length; i++) {
            let creep = creepArr[i];
            if(creep.memory.role === 'harvester'){
                roleExtension.run(creep,1);
            }else if(creep.memory.role === 'upgrade'){
                roleUpgrader.run(creep);
            }else if(creep.memory.role === 'builder'){
                roleBuilder.run(creep,1);
                roleExtension.run(creep,1);
            }
        }
        
    }// 每个房间的循环

    console.log('creeps num: ' + creepArr.length);
}