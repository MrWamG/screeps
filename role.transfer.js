// 搬运工
module.exports = {
    run: function (creep) {
        let targets = creep.room.find(FIND_STRUCTURES, {
            /* 这是一个过滤器，过滤建筑，返回建筑类型是扩容器或者虫巢，条件是未满载的*/
            filter: (structure) => {

                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_STORAGE) && structure.energy < structure.energyCapacity;

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
    }
}