// 目前的功能是将资源从storage中搬运至terminal
module.exports = {
    /**
     * @param {Object} creep 执行人
     * @param {String} resourceType 需要搬运的资源类型
     */
    run: function (
        creep,
        resourceType
    ) {
        let storage = creep.room.storage;
        let terminal = creep.room.terminal;
        if(storage && terminal){
            if(global.methods.objTotalNum(creep.store) == 0 ){
                if(creep.withdraw(storage,resourceType) == ERR_NOT_IN_RANGE){
                    creep.moveTo(storage, {
                        visualizePathStyle: {
                            stroke: '#ffaa00'
                        }
                    });
                }
            }else{
                if (creep.transfer(terminal, resourceType) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(terminal, {
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    });
                }
            }
        }
    }
}