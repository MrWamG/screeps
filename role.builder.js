let roleBuilder = {
    run: function (creep,sourceIndex = 0) {
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
            let buildTargets = creep.room.find(FIND_CONSTRUCTION_SITES);

            /* 获取需要维修的建筑 */
            let repairTargets = creep.room.find(FIND_STRUCTURES,{
                filter: (item) => {
                    return item.hits < item.hitsMax
                }
            })
            /* 如果有等待的需要建造的建筑*/
            if (repairTargets.length) {
                if(creep.repair(road) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(road, {
                        visualizePathStyle: {
                            stroke: '#d2ff3c'
                        }
                    });
                }
            }else if(buildTargets.length){// 如果没有需要维修的建筑则去建造建筑
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