module.exports = {
    run(creep) {
        // 如果爬处于提取状态
        if (creep.memory.transfer) {
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
             if (global.methods.objTotalNum(creep.store) == 0) {
                 creep.memory.transfer = false;
             }
        }else{
            let containers = creep.room.find(FIND_STRUCTURES,{
                filter:(structure)=>{
                    return structure.structureType == STRUCTURE_CONTAINER && global.methods.objTotalNum(structure.store) > 0
                }
            });
            
            // 找到容器，需要从容器里面取得资源
            let container = creep.pos.findClosestByRange(containers);
            // 从容器中找到值最高的资源去采集
            if (creep.withdraw(container,global.methods.polesObjValue(container.store).key) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {
                    visualizePathStyle: {
                        stroke: '#ffaa00'
                    }
                });
            }
            if (global.methods.objTotalNum(creep.store) == creep.store.getCapacity()) {
                creep.memory.transfer = true;
            }
        }
    } 
}