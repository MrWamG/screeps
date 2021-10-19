/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.claim');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function (creep,room_name) {
        // 要占领的房间
        const room = Game.rooms[room_name];
        // 如果该房间不存在就先往房间走
        if (!room) {
            creep.moveTo(new RoomPosition(25, 25, room_name))
        }
        else {
            // 如果房间存在了就说明已经进入了该房间
            // 移动到房间的控制器并占领
            if (creep.claimController(room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(room.controller)
            }
        }
    }
};