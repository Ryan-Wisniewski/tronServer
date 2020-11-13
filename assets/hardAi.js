backwards = {37:39, 38:40, 39:37, 40:38}

const hardAi = (x, y, direction, coords) => {
    if(direction === null){
        // direction = Math.floor(Math.random() * 4) + 37
        direction = 37 //for testin
        // console.log(direction)
    }
    for(let i = 0; i < coords.length; i++){
        // console.log(coords[i].x,coords[i].y, x,y, direction)
        if(direction === 37 && (coords[i].x === x - 1 || 0 === x - 1) && coords[i].y === y){
            console.log('changeDirectionFromLeft',x,y)

            if(coords.some(coord => (
                0 === y - 1 && coord.x === x
                || 0 === y - 2 && coord.x === x
                || coord.y === y - 1 && coord.x === x
                || coord.y === y - 2 && coord.x === x
                )))
            {
                console.log('go downCHECKKK',x, y, coords[i])
                direction = 40

            } else if(coords.some(coord => (
                56 === y + 1 && coord.x === x
                || 56 === y + 2 && coord.x === x
                || coord.y === y + 1 && coord.x === x
                || coord.y === y + 2 && coord.x === x
                ))){
                console.log('goUP')
                direction = 38
            } else {
                const randomDir = Math.floor(Math.random() * 2)
                randomDir === 0 ? direction = 38 : direction = 40
                console.log('Random choice both dir ok',randomDir, direction)
            }

        } else if(direction === 38 && (coords[i].y === y - 1 || 0 === y - 1) && coords[i].x === x){
            console.log('changeDirectionFromUP',x,y)

            if(coords.some(coord => (
                coord.y === y && 0 === x - 1
                || coord.y === y && 0 === x - 2
                || coord.y === y && coord.x === x - 1
                || coord.y === y && coord.x === x - 2
                )))
            {
                console.log('go Right')
                direction = 39
            }  else if(coords.some(coord => (
                64 === x + 1 && coord.y === y
                || 64 === x + 2 && coord.y === y
                || coord.x === x + 1 && coord.y === y
                || coord.x === x + 2 && coord.y === y
                ))){
                console.log('go Left')
                direction = 37
            } else {
                const randomDir = Math.floor(Math.random() * 2)
                randomDir === 0 ? direction = 37 : direction = 39
            }

        } else if(direction === 39 && (coords[i].x === x + 1 || 64 === x + 1) && coords[i].y === y){
            console.log('changeDirectionFromRight',x,y)
            if(coords.some(coord => (
                0 === y - 1 && coord.x === x
                || 0 === y - 2 && coord.x === x
                || coord.y === y - 1 && coord.x === x
                || coord.y === y - 1 && coord.x === x
                )))
            {
                console.log('go down')
                direction = 40
            } else if(coords.some(coord => (
                56 === y + 1 && coord.x === x
                || 56 === y + 2 && coord.x === x
                || coord.y === y + 1 && coord.x === x
                || coord.y === y + 2 && coord.x === x
                ))){
                console.log('goUP')
                direction = 38
            } else {
                const randomDir = Math.floor(Math.random() * 2)
                randomDir === 0 ? direction = 38 : direction = 40
                console.log('Random choice both dir ok',randomDir, direction)
            }

        } else if(direction === 40 && (coords[i].y === y + 1 || 56 === y + 1) && coords[i].x === x){
            console.log('changeDirectionFromDown',x,y)
            if(coords.some(coord => (
                coord.y === y && 0 === x - 1
                || coord.y === y && 0 === x - 2
                || coord.y === y && coords.x === x - 1
                || coord.y === y && coords.x === x - 2
                )))
                {
                console.log('go right')
                direction = 39
            } else if(coords.some(coord => (
                64 === x + 1 && coord.y === y
                || 64 === x + 2 && coord.y === y
                || coord.x === x + 1 && coord.y === y
                || coord.x === x + 2 && coord.y === y
                ))){
                console.log('go Left')
                direction = 37
            } else {
                const randomDir = Math.floor(Math.random() * 2)
                randomDir === 0 ? direction = 37 : direction = 39
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