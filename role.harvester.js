module.exports = {
    run(creep,flagName) {
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