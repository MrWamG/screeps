module.exports = {
    run:function(){
        console.log(JSON.stringify(Game.rooms))
        console.log(JSON.stringify(Game.rooms.memory))
        Game.rooms.memory = 1;
    }
}