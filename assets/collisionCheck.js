const collisionCheck = (playersArray, collisionArray) => {
    let p = playersArray
    let c = collisionArray
    let temp = []
    for(let i = 0; i < p.length; i++){
        for(let j = 0; j < c.length; j++){
            if((p[i].x === c[j].x && p[i].y === c[j].y)
            || p[i].x <= -1 || p[i].y <= -1
            || p[i].x >= 64 || p[i].y >= 56){
                if(p[i].userId){
                    if(!temp.includes(i)){
                        temp.push(i)
                    }
                }
            }
        }
    }
    if(temp.length > 0){
        return temp
    } else {
        return false
    }
}

module.exports = collisionCheck