module.exports = {
    /**
     * 挖掘者，不负责搬运，走动至相应container的位置上进行挖掘，让能量掉落在container上
     * @param {Object} creep 执行该角色的creep
     * @param {String} flagName container上flag的名字
     * @param {String} sourceType 需要采集的资源类型
     */
    run(creep,flagName,sourceType) {
        let sources = creep.room.find(FIND_SOURCES);
        let source = creep.pos.findClosestByRange(sources);
        let containerPos = creep.room.find(FIND_FLAGS,{
            filter:(flag)=>{
                return flag.name == flagName
            }
        });
        creep.moveTo(containerPos[0], {
            visualizePathStyle: {
                stroke: '#ffaa00'
            }
        });
        creep.harvest(source)
    }
}