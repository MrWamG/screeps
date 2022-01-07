module.exports = {
    spawn_creeper({
        body_json,
        role_name,
        spawn,
        memory,
    }) {
        let body_part = [];
        Object.entries(body_json).forEach(([key, value]) => body_part.push(...Array(value).fill(key)));
        let newName = role_name + Game.time;
        spawn.spawnCreep(body_part, newName, {
            memory,
        });
    },
    /** 
     * 检索creeps中的身份，对每种身份进行数量要求定义每种身份所需要的身体
     * @param {Object} body_json 身体组件，传入组件的字符串而非常量
     * @param {String} role_name creep的身份名称
     * @param {Object} spawn 使用哪个孵化器生产creep
     * @param {Number} num creep生产的最大数量
     */
    role_spawn({
        body_json = {},
        role_name = '',
        spawn = {},
        num = 0,
    }) {
        let creepArr = _.filter(Game.creeps, (creep) => creep);
        let creep = creepArr.filter(item => {
            return (item.memory.role === role_name) && (item.room === spawn.room);
        })
        if (creep.length < num) {
            this.spawn_creeper({
                body_json,
                role_name,
                spawn,
                memory: {
                    role: role_name
                }
            })
        }
    },
    /** 
     * 获取房间内Spawn以及extension的能量总量
     * @param {Object} room 需要查询的房间对象
     */
    getSpawnEnergy(room) {
        return room.find(FIND_STRUCTURES, {
            filter: item => {
                return item.structureType === STRUCTURE_SPAWN || item.structureType === STRUCTURE_EXTENSION
            }
        }).reduce((total, item) => {
            return total + Number(item.store.energy);
        }, 0)
    },
    /** 
     * 动态身体部件，根据当前房间可用的孵化能量去设置爬的部件
     * @param {Number} roomEnergy 当前房间的能量数
     */
    setDynamicBodyPart(roomEnergy) {
        let dynamicBodyPart = {
            work: 0,
            carry: 0,
            move: 0
        };

        // 100为work,carry,move其中一个最大组件的能量消耗值(work)
        for (let i = 1; i < Math.floor(roomEnergy / 100) + 1; i++) {
            if (i % 2 === 0) {
                dynamicBodyPart.carry++;
                dynamicBodyPart.move++;
            } else {
                dynamicBodyPart.work++;
            }

            // 如果能量不满足一百但大于50则将这50利用干净，转换为move组件
            if (roomEnergy % 100 >= 50 && i === Math.floor(roomEnergy / 100)) {
                dynamicBodyPart.move++;
            }
        }

        for (let i in dynamicBodyPart) {
            // 如果当前能量不满足一个标准的work,carry,move爬的孵化则将它们设置一个最基础的部件要求(1)，避免生产出某一项能量为0的爬以至于无法正常工作
            if (dynamicBodyPart[i] == 0) dynamicBodyPart[i] = 1;
            if (dynamicBodyPart[i] >= 10) dynamicBodyPart[i] = 10; // creep的最大部件数量不得大于50，否则无法spawn 返回状态码-10（无效的部件参数
        }

        return dynamicBodyPart
    },
    /** 
     * 将对象中的键值遍历相加
     * @param {Object} obj 需要遍历的对象
     */
    objTotalNum(obj) {
        if (JSON.stringify(obj) !== '{}') {
            return Object.values(obj).filter((value) => {
                return typeof value === 'number';
            }).reduce((tole, value) => {
                return tole + value;
            });
        } else {
            return 0
        }
    },
    /**
     * 将对象中的最大值/最小值取出
     * @param {Object} data // 需要取出最大值的对象
     * @param {Boolean} getMax // 取最大值还是取最小值
     */
    polesObjValue(data,getMax = true) {
        let list = [];
        for (let i in data) {
            list.push({
                key:i,
                value:parseInt(data[i])
            });
        }
        list.sort((item1, item2) => {
            return item1.value - item2.value;
        });
        return list[getMax ? list.length - 1 : 0];
    },
}