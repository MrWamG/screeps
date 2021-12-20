module.exports = {

    run(creep,sourceIndex = 0) {
        // 如果爬处于采集状态
        if (creep.memory.harvest) {
            let sources = creep.room.find(FIND_SOURCES);

            if (creep.harvest(sources[sourceIndex]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[sourceIndex], {
                    visualizePathStyle: {
                        stroke: '#ffaa00'
                    }
                });
            }

            if (creep.carry.energy == creep.store.getCapacity()) {
                creep.memory.harvest = false;
            }
        } else {
            creep.say('transfer');
            /*creep.room.find(参数1：查找的类型,参数2：对象数组)*/
            let targets = creep.room.find(FIND_STRUCTURES, {

                /* 这是一个过滤器，过滤建筑，返回建筑类型是扩容器或者虫巢，条件是未满载的*/

                filter: (structure) => {

                    return (
                        structure.structureType == STRUCTURE_EXTENSION 
                        || structure.structureType == STRUCTURE_SPAWN 
                        || structure.structureType == STRUCTURE_TOWER 
                    )
                    && structure.energy < structure.energyCapacity
                    || structure.structureType == STRUCTURE_STORAGE;

                }

            });
            
            if (targets.length > 0) {
                // 找到更近的虫巢或扩容器
                let closerTarget = creep.pos.findClosestByRange(targets);

                if (creep.transfer(closerTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

                    creep.moveTo(closerTarget, {
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    });
                }
            }
            
            // 如果能量都运输完毕了，则回到采集状态
            if (creep.carry.energy == 0) {
                creep.memory.harvest = true;
            }

        }

    }

};