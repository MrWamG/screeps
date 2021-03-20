module.exports = {

    run: function (creep) {

        if (creep.carry.energy < creep.carryCapacity) {

            var sources = creep.room.find(FIND_SOURCES);

            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {

                creep.moveTo(sources[0], {
                    visualizePathStyle: {
                        stroke: '#ffaa00'
                    }
                });

            }

        } else {

            /*creep.room.find(参数1：查找的类型,参数2：对象数组)*/

            var targets = creep.room.find(FIND_STRUCTURES, {

                /* 这是一个过滤器，过滤建筑，返回建筑类型是扩容器或者虫巢，条件是未满载的*/

                filter: (structure) => {

                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&

                        structure.energy < structure.energyCapacity;

                }

            });

            if (targets.length > 0) {

                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

                    creep.moveTo(targets[0], {
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    });

                }

            }

        }

    }

};