/**
 * 战争模块，目前为手动操作模式
 * @param {String} room_name 生产战斗单位的房间名称
 * @param {Number} creep_num 需要生产多少个战斗单位
 * @param {Array} creepArr 全局中所有的AI，我需要通过它来找出战斗单位（不在该函数中进行查找避免额外的CPU消耗）
 * @param {Object} body_json AI部件
 * @param {String} attack_room_name 要攻击的房间名称
 */
module.exports = {
    run({
        room_name = '',
        creep_num = 1,
        creepArr,
        body_json = {'tough':15,'move': 5,'heal': 4,'ranged_attack': 4},
        attack_room_name = ''
    }){
        let flag = Game.flags['Attack'];
        console.log('flags',JSON.stringify(flag));
        // 因为我需要进行跨房间战斗，所以我不能只获取指定房间内的战斗AI
        // 找出我在全局中的战斗AI
        let fighters = _.filter(Game.creeps, (creep) => {
            return creep.memory.role === 'fighter'
        });
        console.log(JSON.stringify(Game.rooms));
        // 由一个指定房间生产指定数量的战斗AI。数量视 creep_num 数字
        if(fighters.length <= creep_num){
            global.methods.spawn_creeper({
                role_name: 'fighter',
                memory:{
                    role:'fighter'
                },
                spawn: Game.rooms[room_name].find(FIND_MY_SPAWNS)[0],
                num: 1,
                body_json
            });
        }

        // 要攻击的敌人集合，一个格子上可能会存在多个单位(比如护罩与其他建筑/AI)
        let enemys = [];

        /**
         * 如果FLAG所处位置没有敌方单位则进行移动，如果有则进行攻击
         * 我需要去区分是对单个单位进行攻击还是对creep所处位置附近范围内的敌方单位进行自动攻击
         * 自动攻击 AttackTo 指定攻击 Attack
         * 但无论是自动攻击还是指定攻击都需要先移动到旗帜位置后再展开攻击行为
         */
        
        if(flag && Game.rooms[attack_room_name]){
            enemys = Game.rooms[attack_room_name].lookAt(flag.pos);
        }

        // 命令全局中所有的战斗AI
        for(let i in fighters){
            let fighter = fighters[i];
            // 指定攻击的优先级是要高于自动攻击的

            // 主要是因为我的远程攻击模块被摧毁了，所以导致返回了-12
            // 相应模块的摧毁都会导致相应功能不可使用
            let enemy = enemys.length && enemys[0][enemys[0].type];
            fighter.heal(fighter);
            if(fighter.rangedAttack(enemy) !== OK) {
                // 使用RoomPosition达到跨房间效果
                fighter.moveTo(new RoomPosition(flag.pos.x,flag.pos.y,attack_room_name))
            }
        }
    }
}