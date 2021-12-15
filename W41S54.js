module.exports = {
    run:function(main,creepArr,spawn,room){
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

        for(let i in role_spawn_arr){
            main.methods.role_spawn(role_spawn_arr[i]);
        }

        let roomCreepArr = creepArr.filter(item=>{
            return item.room.name == room.name
        })

        for (let i = 0; i < roomCreepArr.length; i++) {
            let creep = roomCreepArr[i];
            if (creep.memory.role === 'harvester') {
                console.log(room.name);
                main.roleExtension.run(creep, 1);
            } else if (creep.memory.role === 'upgrade') {
                main.roleUpgrader.run(creep);
            } else if (creep.memory.role === 'builder') {
                main.roleBuilder.run(creep, 1);
            } else if (creep.memory.role === 'claim') {
                main.roleClaim.run(creep,'W42S54')
            }
        }
    }
}