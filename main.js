const roleUpgrader = require('role.upgrader'); // 升级控制器
const roleBuilder = require('role.builder'); // 建筑
const roleExtension = require('role.extension'); // 运输能量至虫巢或扩容器
const roleClaim = require('role.claim'); // 占领 
const roleRoad = require('role.road'); // 道路维护
const methods = require('methods');// 方法集合
const structure_list = require('structure_list'); // 将所有存在过的建筑存放在room的memory中，当建筑不存在后将自动创造工地
module.exports.loop = function () {
    roleRoad.run();
    structure_list.run();
    let creepArr = _.filter(Game.creeps, (creep) => creep);
    // for (let name in Game.rooms) {
    //     console.log("房间 " +name+"有"+Game.rooms[name].energyAvailable+"能量");
    // }

    for(let name in Memory.creeps){
        if(!Game.creeps[name]){
            delete Memory.creeps[name];
        }
    }
    
    methods.role_spawn({
        role_name:'harvester',
        spawn_name:'Spawn1',
        num:3,
        body:[
            WORK
            ,CARRY
            ,MOVE
        ]
    });
    
    methods.role_spawn({
        role_name:'builder',
        spawn_name:'Spawn1',
        num:2,
        body:[
            WORK,WORK,WORK,WORK,
            CARRY,CARRY,
            MOVE,MOVE,MOVE
        ]
    });

    methods.role_spawn({
        role_name:'upgrade',
        spawn_name:'Spawn1',
        num:5,
        body:[
            WORK,WORK,WORK,WORK
            ,CARRY,CARRY
            ,MOVE,MOVE,MOVE
        ]
    });

    for (let i = 0; i < creepArr.length; i++) {
        let creep = creepArr[i];
        // let harvester = creepArr.filter(item=>{
        //     return item.memory.role === 'harvester'
        // });
        // for(let j = 0; j < harvester.length; j++) {
        //     if(j < 2){
        //         roleExtension.run(harvester[j]);
        //     }else{
        //         roleExtension.run(harvester[j],1);
        //     }
        // }
        if(creep.memory.role === 'harvester'){
            roleExtension.run(creep,1);
        }else if(creep.memory.role === 'upgrade'){
            roleUpgrader.run(creep);
        }else if(creep.memory.role === 'builder'){
            roleBuilder.run(creep);
        }
    }

    console.log('creeps num: ' + creepArr.length);
}