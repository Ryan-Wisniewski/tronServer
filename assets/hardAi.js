backwards = {37:39, 38:40, 39:37, 40:38}

const hardAi = (x, y, direction, coords) => {
    if(direction === null){
        direction = Math.floor(Math.random() * 4) + 37
        // direction = 37 //for testin
        console.log(direction)
    }
    for(let i = 0; i < coords.length; i++){
        // console.log(coords[i].x,coords[i].y, x,y, direction)
        
        if(direction === 37 && (coords[i].x === x - 1 || 0 === x - 1) && coords[i].y === y){
            console.log('changeDirection1', x,y, y- 1)
            console.log(coords)
            if(coords.some(coord => (coord.y === y - 1 && coord.x === x || coord.y === y - 2 && coord.x === x))){
                console.log('go up')
                 direction = 38
            } else{
                console.log('elseeee', coords)
                 direction = 40
            }

        } else if(direction === 38 && (coords[i].y === y - 1 || 0 === y - 1) && coords[i].x === x){
            console.log('changeDirection2')
            if(coords.some(coord => (coord.y === y && coord.x === x - 1 || coord.y === y && coord.x === x- 2))){
                console.log('go left')
                 direction = 37
            } else{
                console.log('elseeee', coords)
                 direction = 39
            }

        } else if(direction === 39 && (coords[i].x === x + 1 || 64 === x + 1) && coords[i].y === y){
            console.log('changeDirection3')
            if(coords.some(coord => (coord.y === y + 1 && coord.x === x || coord.y === y + 2 && coord.x === x))){
                console.log('go up')
                 direction = 40
            } else{
                console.log('elseeee', coords)
                 direction = 38
            }

        } else if(direction === 40 && (coords[i].y === y + 1 || 56 === y + 1) && coords[i].x === x){
            console.log('changeDirection4')
            if(coords.some(coord => (coord.y === y && coord.x === x + 1 || coord.y === y && coord.x === x + 2))){
                console.log('go left')
                 direction = 39
            } else{
                console.log('elseeee', coords)
                 direction = 37
            }
        }
    }
    return direction
}

// always true
// console.log(hardAi(16, 14, null, [{x: 15, y: 14}, {x: 14, y: 13}, {x: 17, y: 14}, {x: 16, y: 13},{x: 16, y: 15}]))
// allways false
// console.log(hardAi(16,14,null, [7]))

module.exports = hardAi