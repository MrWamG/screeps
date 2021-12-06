let roleBuilder = {
    /**
     * @param {Object} creep 指定的爬
     * @param {Number} sourceIndex 能量矿下标
     * @param {Object} specify 指定某个工地进行建造
     */
    run: function (creep,sourceIndex = 0,specify) {
        /* 如果爬虫处于建筑状态且负载的能量为0的时候*/
        /* && 且 左右两边都为真时即为真，一假即假*/
        if (creep.memory.building && creep.carry.energy == 0) {
            /* 将爬虫设置为非建筑状态，并说出🔄 harvest*/
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        /* 如果爬虫不处于建筑状态且爬虫能量满载的时候*/
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            /* 将爬虫设置为建筑状态，并说出🔄 harvest*/
            creep.memory.building = true;
            creep.say('🚧 build');
        }
        /* 如果爬虫处于建筑状态*/
        if (creep.memory.building) {
            /* 获取当前爬虫房间内的待建设的建筑数组*/
            let buildTargets = specify || creep.room.find(FIND_CONSTRUCTION_SITES);

            /* 获取需要维修的建筑 */
            let repairTargets = creep.room.find(FIND_STRUCTURES,{
                filter: (item) => {
                    return item.hits < item.hitsMax
                }
            })
            /* 如果有等待的需要建造的建筑*/
            if (buildTargets.length) {
                // 找到更近的虫巢或扩容器
                let closerTarget = creep.pos.findClosestByRange(buildTargets);
                if (creep.build(closerTarget) == ERR_NOT_IN_RANGE) {
                    /* 向该建筑移动，并用颜色#ffffff标记路线*/
                    creep.moveTo(closerTarget, {
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    });
                }
            }else if(repairTargets.length){// 如果没有需要建造的工地则去维护建筑
                if(creep.repair(repairTargets) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairTargets, {
                        visualizePathStyle: {
                            stroke: '#d2ff3c'
                        }
                    });
                }
            }
        }else { /* 否则去采集资源 */
            let sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[sourceIndex]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[sourceIndex], {
                    visualizePathStyle: {
                        stroke: '#ffaa00'
                    }
                });
            }
        }
    }
};

module.exports = roleBuilder;