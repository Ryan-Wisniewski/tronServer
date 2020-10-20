const collisionCheck = (playersArray, collisionArray) => {
    let p = playersArray
    let c = collisionArray
    for(let i = 0; i < p.length; i++){
        for(let j = 0; j < c.length; j++){
            if((p[i].x === c[j].x && p[i].y === c[j].y)
            || p[i].x <= 0 || p[i].y <= 0 
            || p[i].x >= 64 || p[i].y >= 56){
                if(p[i].userId){
                    let temp = i
                    return temp
                }
            }
        }
    }
    return false
}

module.exports = collisionCheck