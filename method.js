module.exports = {
    spawn_creeper({
        body_json,
        role_name,
        spawn_name,
        memory,
    }) {
        let body_part = [];
        Object.entries(body_json).forEach(([key,value]) => body_part.push(...Array(value).fill(key)));
        let newName = role_name + Game.time;
        if(Game.spawns[spawn_name]){
            Game.spawns[spawn_name].spawnCreep(body_part, newName, {
                memory,
            });
        }else{
            console.log(spawn_name + '不存在');
        }
    },
    /** 检索creeps中的身份，对每种身份进行数量要求定义每种身份所需要的身体
    * @param {Object} body_json 身体组件，传入组件的字符串而非常量
    * @param {String} role_name creep的身份名称
    * @param {String} spawn_name 使用哪个孵化器生产creep
    * @param {Number} num creep生产的最大数量
    */
    role_spawn({
        body_json = {},
        role_name = '',
        spawn_name = '',
        num = 0,
    }) {
        let creepArr = _.filter(Game.creeps, (creep) => creep);
        let creep = creepArr.filter(item => {
            return item.memory.role === role_name;
        })
        if (creep.length < num) {
            this.spawn_creeper({
                body_json,
                role_name,
                spawn_name,
                memory: {
                    role: role_name
                }
            })
        }
    },
    /** 获取房间内Spawn以及extension的能量总量
     * @param {Object} room 需要查询的房间对象
     */
    getSpawnEnergy(room) {
        return room.find(FIND_STRUCTURES,{
            filter:item=>{
                return item.structureType === STRUCTURE_SPAWN || item.structureType === STRUCTURE_EXTENSION
            }
        }).reduce((total,item)=>{
            return total + Number(item.store.energy);
        },0)
    }
}