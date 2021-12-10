module.exports = {
    /**
     * @param {Object} room 房间 
     * @param {Array} enemys 敌人集合
     */
    run: function(room,enemys){

        // 从建筑中找出房间内所有的防御塔
        let towers = room.find(FIND_MY_STRUCTURES,{
            filter:item=>{
                return item.structureType == STRUCTURE_TOWER
            }
        });
        
        // 如果房间内有敌人，则命令所有的防御塔进行攻击
        if(enemys.length){
            towers.map(item=>{
                let attack = item.attack(enemys[0]);
                if(attack !== OK){
                    console.log('防御塔=>',JSON.stringify(attack))
                }
            })
        }
    }
}