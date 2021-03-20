"use strict";

var roleHarvester = require('harvester'); // 采集资源至虫巢


var roleUpgrader = require('role.upgrader'); // 升级控制器


var roleBuilder = require('role.builder'); // 建筑


var roleExtension = require('role.extension'); // 运输能量至虫巢或扩容器


module.exports.loop = function () {
  var creepArr = _.filter(Game.creeps, function (creep) {
    return creep;
  });

  for (var name in Game.rooms) {
    console.log("房间 " + name + "有" + Game.rooms[name].energyAvailable + "能量");
  }

  if (creepArr.length < 15) {
    var newName = 'Harvester' + Game.time;
    Game.spawns['MrWamG'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], newName, {
      memory: {
        role: 'harvester'
      }
    });
  }

  for (var i = 0; i < creepArr.length && i < 5; i++) {
    var creep = creepArr[i];
    roleExtension.run(creep);
  } // for (let i = 5; i < creepArr.length; i++) {
  //     let creep = creepArr[i];
  //     roleBuilder.run(creep);
  // }


  for (var _i = 5; _i < creepArr.length; _i++) {
    var _creep = creepArr[_i];
    roleUpgrader.run(_creep);
  }
};