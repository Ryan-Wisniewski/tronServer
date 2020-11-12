// bot need
// random direction
// while moving in that direction look for a wall
// if 2 spaces from ded change direction !backwards
// run until dead

const easyAi = (x, y, direction, coords) => {
    // console.log(x,y,direction,coords)
    if(direction === null){
        direction = Math.floor(Math.random() * 4) + 37
        // console.log(direction)
    }
    let dirBool = Math.floor(Math.random() * 2)
    for(let i = 0; i < coords.length; i++){
        // console.log(coords[i].x,coords[i].y, x,y, direction)
        if(direction === 37 && (coords[i].x === x - 2 || 0 === x - 2) && coords[i].y === y){
            // console.log('changeDirection')
            if (dirBool === 0) {
                direction = 38
            } else if(dirBool === 1){
                direction = 40
            }
        } else if(direction === 38 && (coords[i].y === y - 2 || 0 === y - 2) && coords[i].x === x){
            // console.log('changeDirection')
            if (dirBool === 0) {
                direction = 37
            } else if(dirBool === 1){
                direction = 39
            }
        } else if(direction === 39 && (coords[i].x === x + 2 || 64 === x + 2) && coords[i].y === y){
            // console.log('changeDirection')
            if (dirBool === 0) {
                direction = 38
            } else if(dirBool === 1){
                direction = 40
            }
        } else if(direction === 40 && (coords[i].y === y + 2 || 56 === y + 2) && coords[i].x === x){
            // console.log('changeDirection')
            if (dirBool === 0) {
                direction = 37
            } else if(dirBool === 1){
                direction = 39
            }
        }
    }
    return direction
}

// always true
// console.log(easyAi(16, 14, null, [{x: 15, y: 14}, {x: 14, y: 13}, {x: 17, y: 14}, {x: 16, y: 13},{x: 16, y: 15}]))
// allways false
// console.log(easyAi({x: 16,y: 14,direction: null}, [[13,13], [14,13]]))

module.exports = easyAi