let roleBuilder = {
    /**
     * @param {Object} creep 指定的爬
     * @param {Number} sourceIndex 能量矿下标
     * @param {Object} specify 指定某个工地进行建造
     * @param {String} restFlag 休息点的FLAG名称
     * @param {String} target_room_name 去哪个房间进行工作
     */
    run: function (creep,sourceIndex = 0,restFlag = "",target_room_name) {

        // 如果指定了目标房间则先往目标房间走
        if(target_room_name && target_room_name !== creep.room.name){
            creep.moveTo(new RoomPosition(25, 25, target_room_name), {
                visualizePathStyle: {
                    stroke: '#00ffff'
                }
            });
            return;
        }

        // 没能量了就进入采集状态
        if(creep.carry.energy == 0){
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        /* 如果爬虫处于建筑状态*/
        if (creep.memory.building) {
            /* 获取当前爬虫房间内的待建设的建筑数组*/
            let buildTargets = creep.room.find(FIND_CONSTRUCTION_SITES);

            /* 需要刷的墙 */
            let wallTargets = [];
            /* 获取需要维修的建筑 */
            let repairTargets = creep.room.find(FIND_STRUCTURES,{
                filter: (item) => {
                    if(item.structureType === 'constructedWall' || item.structureType === 'rampart'){
                        if(item.hits < 10000){
                            wallTargets.push(item);
                        }
                    }else{
                        return item.hits < item.hitsMax
                    }
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
                let closerTarget = creep.pos.findClosestByRange(repairTargets);
                if(creep.repair(closerTarget) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closerTarget, {
                        visualizePathStyle: {
                            stroke: '#d2ff3c'
                        }
                    });
                }
            }else if(wallTargets.length){ // 如果基础建筑都维护完了则去刷墙
                let closerTarget = creep.pos.findClosestByRange(wallTargets);
                if(creep.repair(closerTarget) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closerTarget, {
                        visualizePathStyle: {
                            stroke: '#d2ff3c'
                        }
                    });
                }
            }else{// 如果既不用建造又不用维修则找一处不会影响到其他爬的地方休息待命
                if(restFlag){
                    let restPoint = Game.flags[restFlag]
                    creep.moveTo(restPoint, {
                        visualizePathStyle: {
                            stroke: '#000000'
                        }
                    });
                }
            }
        }else { /* 否则去采集资源 */
            // 如果能量满了就进入建造状态
            if(creep.carry.energy == creep.carryCapacity){
                creep.memory.building = true;
                creep.say('🚧 build');
            }
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