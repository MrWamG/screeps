"use strict";

var roleHarvester = require('harvester'); // 采集资源至虫巢


var roleUpgrader = require('role.upgrader'); // 升级控制器


var roleBuilder = require('role.builder'); // 建筑


var roleExtension = require('role.extension'); // 运输能量至虫巢或扩容器


module.exports.loop = function () {
  var creepArr = _.filter(Game.creeps, function (creep) {
    return creep;
  }); // for (let name in Game.rooms) {
  //     console.log("房间 " +name+"有"+Game.rooms[name].energyAvailable+"能量");
  // }


  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }

  if (creepArr.length < 15) {
    var newName = 'Harvester' + Game.time;
    Game.spawns['MrWamG'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], newName, {
      memory: {
        role: 'harvester'
      }
    });
  }

  for (var i = 0; i < creepArr.length; i++) {
    var creep = creepArr[i];

    if (i < 3) {
      roleExtension.run(creep, 1);
    } else if (i < 7) {
      roleExtension.run(creep);
    } else if (i < 12) {
      roleExtension.run(creep, 1);
    } else {
      roleUpgrader.run(creep);
    }
  }

  console.log('creeps num: ' + creepArr.length);
};