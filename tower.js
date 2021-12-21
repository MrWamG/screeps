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

        // 需要维修的建筑
        let repairTargets = room.find(FIND_STRUCTURES,{
            filter: (item) => {
                return item.hits < item.hitsMax
            }
        })
        
        // 如果房间内有敌人，则命令所有的防御塔进行攻击
        if(enemys.length){
            towers.map(item=>{
                let attack = item.attack(enemys[0]);
                if(attack !== OK){
                    console.log('防御塔攻击=>',JSON.stringify(attack))
                }
            })
        }else if(repairTargets.length){ // 如果房间内没有敌人且存在需要维修的建筑
            towers.map((item,index)=>{
                // 只有当tower的能量在最大能量值的八成以上才会开始维修建筑
                if(item.store.energy > (item.energyCapacity * 0.8)){
                    let repair = item.repair(repairTargets[index]);
                    if(repair !== OK){
                        console.log('防御塔维修=>',JSON.stringify(repair))
                    }
                }
            })
        }
    }
}