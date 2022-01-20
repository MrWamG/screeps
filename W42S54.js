module.exports = {
    run:function(main,creepArr,spawn,room){
        let roomEnergy = global.methods.getSpawnEnergy(room);
        // 须要孵化的creep身份及其部件配置
        let role_spawn_arr = [
            {
                role_name: 'harvester',
                spawn:spawn[0],
                num: 1,
                body_json: global.methods.setDynamicBodyPart(roomEnergy),// 自适应部件填充
            },{
                role_name: 'upgrade',
                spawn:spawn[0],
                num: 2,
                body_json: global.methods.setDynamicBodyPart(roomEnergy),// 自适应部件填充
            },
            {
                role_name: 'builder',
                spawn:spawn[0],
                num: 1,
                body_json: {'work': 1,'carry': 1,'move': 1}
            },
        ];

        // 须要生产的基础creep数量
        let base_creep_num = role_spawn_arr.reduce((total,item)=>{
            return total + item.num
        },0)
        console.log('base_creep_num',base_creep_num)

        for(let i in role_spawn_arr){
            global.methods.role_spawn(role_spawn_arr[i]);
        }

        let roomCreepArr = creepArr.filter(item=>{
            return item.room.name == room.name
        })

        for (let i = 0; i < roomCreepArr.length; i++) {
            let creep = roomCreepArr[i];
            if (creep.memory.role === 'harvester') {
                main.roleExtension.run(creep, 0);
            } else if (creep.memory.role === 'upgrade') {
                main.roleUpgrader.run(creep);
            } else if (creep.memory.role === 'builder') {                    
                main.roleBuilder.run(creep, 0, 'W42S54Rest');
            }
        }
    }
}