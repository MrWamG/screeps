// 繁殖
Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Harvester1' );

// 寻找资源
var creep = Game.creeps['Harvester1'];
if(creep.store.getFreeCapacity() > 0) {
    var sources = creep.room.find(FIND_SOURCES);
    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);
    }
}
else {
    if( creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
        creep.moveTo(Game.spawns['Spawn1']);
    }
}

// 开始如何升级控制器
//To do that, we need to utilize the memory property of each creep that allows writing custom information into the creep's "memory". Let's do this to assign different roles to our creeps.
//All your stored memory is accessible via the global Memory object. You can use it any way you like.
//Write a property role='harvester' into the memory of the harvester creep and role='upgrader' — to the upgrader creep with the help of the console.
//Documentation:
// Memory object
// Creep.memory
// Code
// 定义角色
Game.creeps['Harvester1'].memory.role = 'harvester';
Game.creeps['Upgrader1'].memory.role = 'upgrader';


// You can check your creeps' memory in either the creep information panel on the left or on the "Memory" tab.

// Now let's define the behavior of the new creep. Both creeps should harvest energy, but the creep with the role harvester should bring it to the spawn, while the creep with the role upgrader should go to the Controller and apply the function upgradeController to it (you can get the Controller object with the help of the Creep.room.controller property).

// In order to do this, we’ll create a new module called role.upgrader.

// Create a new module role.upgrader with the behavior logic of your new creep.
// Documentation:
// RoomObject.room
// Room.controller
// Creep.upgradeController

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.store[RESOURCE_ENERGY] == 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
	}
};

module.exports = roleUpgrader;


// The Controller upgrade gives access to some new structures: walls, ramparts, and extensions. We’ll discuss walls and ramparts in the next Tutorial section, for now let’s talk about extensions.

// Extensions are required to build larger creeps. A creep with only one body part of one type works poorly. Giving it several WORKs will make him work proportionally faster.

// However, such a creep will be costly and a lone spawn can only contain 300 energy units. To build creeps costing over 300 energy units you need spawn extensions.

// =============

// The second Controller level has 5 extensions available for you to build. This number increases with each new level.

// You can place extensions at any spot in your room, and a spawn can use them regardless of the distance. In this Tutorial we have already placed corresponding construction sites for your convenience.

// Let’s create a new creep whose purpose is to build structures. This process will be similar to the previous Tutorial sections. But this time let’s set memory for the new creep right in the method Spawn.spawnCreep by passing it in the third argument.

// Spawn a creep with the body [WORK,CARRY,MOVE], the name Builder1, and {role:'builder'} as its memory.
// Documentation:
// StructureSpawn.spawnCreep

Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Builder1', { memory: { role: 'builder' } } );

// Our new creep won’t move until we define the behavior for the role builder.

// As before, let’s move this role into a separate module role.builder. The building is carried out by applying the method Creep.build to the construction sites searchable by Room.find(FIND_CONSTRUCTION_SITES). The structure requires energy which your creep can harvest on its own.

// To avoid having the creep run back and forth too often but make it deplete the cargo, let’s complicate our logic by creating a new Boolean variable creep.memory.building which will tell the creep when to switch tasks. We'll also add new creep.say call and visualizePathStyle option to the moveTo method to visualize the creep's intentions.

// Create the module role.builder with a behavior logic for a new creep.

// Documentation:
// RoomObject.room
// Room.find
// Creep.build
// Creep.say

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
	}
};

module.exports = roleBuilder;

// main ↓
var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}

// Your extensions have been built. Now let’s learn to work with them.

// Maintaining extensions requires you to teach your harvesters to carry energy not just to a spawn but also to extensions. To do this, you can either use the Game.structures object or search within the room with the help of Room.find(FIND_STRUCTURES). In both cases, you will need to filter the list of items on the condition structure.structureType == STRUCTURE_EXTENSION (or, alternatively, structure instanceof StructureExtension) and also check them for energy load, as before.

// Refine the logic in the module role.harvester.
// Documentation:
// Game.structures
// Room.find
// StructureExtension
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
	}
};

module.exports = roleHarvester;

// To know the total amount of energy in the room, you can use the property Room.energyAvailable. Let’s add the output of this property into the console in order to track it during the filling of extensions.

// Fill all the 5 extensions and the spawn with energy.
// Documentation:
// Room.energyAvailable

var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    for(var name in Game.rooms) {
        console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}

// Excellent, all the structures are filled with energy. It’s time to build somebody large!

// In total, we have 550 energy units in our spawn and extensions. It is enough to build a creep with the body [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE]. This creep will work 4 times faster than a regular worker creep. Its body is heavier, so we’ll add another MOVE to it. However, two parts are still not enough to move it at the speed of a small fast creep which would require 4xMOVEs or building a road.

// Spawn a creep with the body [WORK,WORK,WORK,CARRY,MOVE,MOVE], the name HarvesterBig, and harvester role.

Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],
    'HarvesterBig',
    { memory: { role: 'harvester' } } );

// Building this creep took energy from all storages and completely drained them.

// Now let’s select our creep and watch it work.

// Click on the creep Harvester2.


// Hence, by upgrading your Controller, constructing new extensions and more powerful creeps, you considerably improve the effectiveness of your colony work. Also, by replacing a lot of small creeps with fewer large ones, you save CPU resources on controlling them which is an important prerequisite to play in the online mode.

// In the next section, we’ll talk about how to set up the automatic manufacturing of new creeps.

// 新creep自动建造

// Until now, we have created new creeps directly in the console. It’s not a good idea to do it constantly since the very idea of Screeps is making your colony control itself. You will do well if you teach your spawn to produce creeps in the room on its own.

// This is a rather complicated topic and many players spend months perfecting and refining their auto-spawning code. But let’s try at least something simple and master some basic principles to start with.



// You will have to create new creeps when old ones die from age or some other reasons. Since there are no events in the game to report death of a particular creep, the easiest way is to just count the number of required creeps, and if it becomes less than a defined value, to start spawning.

// There are several ways to count the number of creeps of the required type. One of them is filtering Game.creeps with the help of the _.filter function and using the role in their memory. Let’s try to do that and bring the number of creeps into the console.

// Add the output of the number of creeps with the role harvester into the console.
// Documentation:
// Game.creeps
// lodash.filter
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

module.exports.loop = function () {

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
    }
}

// Let’s say we want to have at least two harvesters at any time. The easiest way to achieve this is to run StructureSpawn.spawnCreep each time we discover it’s less than this number. You may not define its name (it will be given automatically in this case), but don’t forget to define the needed role.

// We may also add some new RoomVisual call in order to visualize what creep is being spawned.

// Add the logic for StructureSpawn.spawnCreep in your main module.
// Documentation:
// StructureSpawn.spawnCreep
// RoomVisual

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

module.exports.loop = function () {

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);

    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'harvester'}});        
    }
    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
    }
}

// Now let’s try to emulate a situation when one of our harvesters dies. You can now give the command suicide to the creep via the console or its properties panel on the right.

// Make one of the harvesters suicide.
// Documentation:
// Creep.suicide

Game.creeps['Harvester1'].suicide(); // creep自杀

// As you can see from the console, after we lacked one harvester, the spawn instantly started building a new one with a new name.

// An important point here is that the memory of dead creeps is not erased but kept for later reuse. If you create creeps with random names each time it may lead to memory overflow, so you should clear it in the beginning of each tick (prior to the creep creation code).

// Add code to clear the memory.

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);

    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'harvester'}});
    }
    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
    }
}

// Now the memory of the deceased is relegated to oblivion which saves us resources.

// Apart from creating new creeps after the death of old ones, there is another way to maintain the needed number of creeps: the method StructureSpawn.renewCreep. Creep aging is disabled in the Tutorial, so we recommend that you familiarize yourself with it on your own.

// Documentation:
// StructureSpawn.renewCreep