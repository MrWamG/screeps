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
            /*creep.room.find(参数1：查找的类型,参数2：对象数组)*/
            let baseEnergyStructures = creep.room.find(FIND_STRUCTURES, {
                /* 这是一个过滤器，过滤建筑，返回建筑类型是扩容器或者虫巢，条件是未满载的*/
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_EXTENSION 
                        || structure.structureType == STRUCTURE_SPAWN 
                        || structure.structureType == STRUCTURE_TOWER 
                    )
                    && structure.energy < structure.energyCapacity
                }
            });
            
            // 运输目标
            let target = null;
            // 先装满基础能量设施
            if (baseEnergyStructures.length > 0) {
                // 找到更近的虫巢或扩容器
                target = creep.pos.findClosestByRange(baseEnergyStructures);
            }else{
                // 如果基础能量设施的能量都是满的，那么就去填充storage
                target = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {    
                        return structure.structureType == STRUCTURE_STORAGE;
                    }
                })[0];
            }

            if(target){
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {
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