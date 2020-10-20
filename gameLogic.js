const Game = (x) => {
    for(let i = 0; i < x.length; i++){
        //l u r d
        if(x[i].direction === 37){
            x[i].x -= 1
        } else if(x[i].direction === 38){
            x[i].y -= 1
        } else if(x[i].direction === 39){
            x[i].x += 1
        } else if(x[i].direction === 40){
            x[i].y += 1
        }
    }
    return x
}

module.exports = Game
