"use strict";

module.exports = {
  run: function run(creep) {
    var sourceIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if (creep.carry.energy < creep.carryCapacity) {
      var sources = creep.room.find(FIND_SOURCES);

      if (creep.harvest(sources[sourceIndex]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[sourceIndex], {
          visualizePathStyle: {
            stroke: '#ffaa00'
          }
        });
      }
    } else {
      /*creep.room.find(参数1：查找的类型,参数2：对象数组)*/
      var targets = creep.room.find(FIND_STRUCTURES, {
        /* 这是一个过滤器，过滤建筑，返回建筑类型是扩容器或者虫巢，条件是未满载的*/
        filter: function filter(structure) {
          return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
        }
      });

      if (targets.length > 0) {
        // 找到更近的虫巢或扩容器
        var closerTarget = creep.pos.findClosestByRange(targets);

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
};