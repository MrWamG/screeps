"use strict";

var roleHarvester = require('harvester'); // 采集资源至虫巢


var roleUpgrader = require('role.upgrader'); // 升级控制器


var roleBuilder = require('role.builder'); // 建筑


var roleExtension = require('role.extension'); // 运输能量至虫巢或扩容器


module.exports.loop = function () {
  var harvesters = _.filter(Game.creeps, function (creep) {
    return creep;
  });

  if (harvesters.length < 20) {
    var newName = 'Harvester' + Game.time;
    Game.spawns['MrWamG'].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: {
        role: 'harvester'
      }
    });
  }

  for (var i = 0; i < harvesters.length && i < 5; i++) {
    var creep = harvesters[i];
    roleExtension.run(creep);
  }

  for (var _i = 5; _i < harvesters.length; _i++) {
    var _creep = harvesters[_i];
    roleUpgrader.run(_creep);
  }
};