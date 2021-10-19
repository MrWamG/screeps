module.exports = {
    spawn_creeper({
        body,
        role_name,
        memory
    }) {
        let newName = role_name + Game.time;
        Game.spawns['Spawn1'].spawnCreep(body, newName, {
            memory,
        });
    },
    // 检索creeps中的身份，对每种身份进行数量要求定义每种身份所需要的身体
    role_spawn(role_name, num, body) {
        let creepArr = _.filter(Game.creeps, (creep) => creep);
        let creep = creepArr.filter(item => {
            return item.memory.role === role_name;
        })
        if (creep.length < num) {
            this.spawn_creeper({
                body,
                role_name,
                memory: {
                    role: role_name
                }
            })
        }
    }
}