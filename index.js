const Game = require('./assets/gameLogic')
const collisionCheck = require('./assets/collisionCheck');

const easyAi = require('./assets/easyAi')
const hardAi = require('./assets/hardAi')

const PORT = process.env.PORT || 8000

//# FOR DEVELOPMENT
// const httpServer = require('http').createServer((req, res) => {
//     res.setHeader('Content-Type', 'text/html');
// });
// const io = require('socket.io')(httpServer);

//# FOR DEPLOYMENT
const httpsServer = require('http').createServer((req, res) => {
    const headers = {
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Origin": "*", //or the specific origin you want to give access to,
        "Access-Control-Allow-Credentials": false
    };
    res.writeHead(200, headers);
    res.end();
});


const io = require('socket.io')(httpsServer);

let game = []
let playersId = []
let players = [
    {x: 16,y: 14, userId: null, direction: null},
    {x: 47,y: 14, userId: null, direction: null},
    {x: 16,y: 41, userId: null, direction: null},
    {x: 47,y: 41, userId: null, direction: null}
]
let leftOvers = [] // for people waiting in queu
let coordsArray = [{x: 16,y: 14}, {x: 47,y: 14}, {x: 16,y: 41}, {x: 47,y: 41}]
let x = 64
let y = 56
let gameTimer
let gameOver = false

if(game.length === 0){
    for(let i = 0; i < x; i++){
        for(let j = 0; j < y; j++){
            game.push({x: i, y: j})
        }
    }
}
// console.log(game)
const start = (socket) => {
    console.log('Starting Game!!!')
    count = 0
    gameOver = true
    gameTimer = setInterval(() => {
        for(let i = 0; i < players.length; i++){
            if(players[i].x ===  null || players[i].y === null){
                // console.log('passing Push to players...')
            } else {
                //add to array cause player is alive
                coordsArray.push({x: players[i].x, y:players[i].y})
            }
            if(players[i].userId === "BOT"){
                let botDirection = hardAi(players[i].x, players[i].y, players[i].direction, coordsArray)
                // console.log("TESTING...", test)
                players[i].direction = botDirection
            }
        }
        for(let i = 0; i < players.length; i++){
            const check = players.filter(pos => (players[i].userId !== null && players[i].x === pos.x && players[i].y === pos.y))
            if(check.length > 1){
                console.log('Players dead...', check)
                for(let i = 0; i < check.length; i++){
                    let index = players.indexOf(check[i])
                    players[index].userId = null
                    players[index].direction = null
                    players[index].x = null
                    players[index].y = null
                }
            }
        }
        Game(players)
        if(collisionCheck(players, coordsArray) !== false){
            const check = collisionCheck(players, coordsArray)
            // console.log(check)
            for(let i = 0; i < check.length; i++){
                players[check[i]].userId = null
                players[check[i]].direction = null
                players[check[i]].x = null
                players[check[i]].y = null
            }
            console.log('Player is dead...')
        }
        winnerCheck(socket)
        //check if players on top of each other.
        socket.broadcast.emit('game-start', JSON.stringify(players))
        socket.emit('game-start', JSON.stringify(players))
    },300)
}

const winnerCheck = (socket) => {
    let temp = 4
    for(let i = 0; i < players.length; i++){
        if(players[i].userId === null || undefined){
            temp--
        }
    }
    // console.log(temp)
    if(temp === 1 || temp === 0){
        reset(socket)
    }
}

const reset = (socket) => {
    console.log('Halting GAME...')
    //for loop here you add the userid back in
    for(let i = 0; i < playersId.length; i++){
        players[i].userId = playersId[i]
    }
    count = 0
    coordsArray = []
    gameOver = false
    players[0].direction = null
    players[1].direction = null
    players[2].direction = null
    players[3].direction = null
    players[0].x = 16
    players[1].x = 47
    players[2].x = 16
    players[3].x = 47
    players[0].y = 14
    players[1].y = 14
    players[2].y = 41
    players[3].y = 41
    // console.log('Reset, Ready for players input...\n',players)
    socket.broadcast.emit('gameOver', JSON.stringify({message: true}))
    socket.emit('gameOver', JSON.stringify({message: true}))
    return clearInterval(gameTimer)
}

// ServerSocketLogic@@@Here
io.on('connection', socket => {
    // init connection
    if(playersId.length < 4){
        playersId.push(socket.id)
    } else if(playersId.length >= 4){
        leftOvers.push(socket.id)
    }
    console.log('User connected: ', socket.id);

    for(let i = 0; i < playersId.length; i++){
        players[i].userId = playersId[i]
    }
    console.log('Line 49: Players,', players, 'leftOvers: ', leftOvers)

    socket.broadcast.emit('setId', JSON.stringify(playersId))
    socket.emit('setId', JSON.stringify(playersId))

    socket.on('player direction', (res) => {
        if(res !== '{}'){
            const data = JSON.parse(res)
            // console.log('data', data)
            if(playersId.includes(data.userId)){
                for(let i = 0; i < players.length; i++){
                    if(data.userId === players[i].userId && data.direction !== players[i].direction){
                        // console.log("New Direction: ", data.userId, players[i].userId)
                        players[i].direction = data.direction
                }   }
        }}
        //check if all players ready
        let count = 0
        for(let i = 0; i < players.length; i++){
            if(players[i].direction !== null){
                // console.log('Player added direction',players[i])
                count++
            }
        }
        if(count === players.length && gameOver === false){
            start(socket)
        }
        // console.log('New Direction', players)
    })

    socket.on('initNewGame', () => {
        if(gameOver === false){
            console.log('Force Starting')
            let count = 0
            for(let i = 0; i < players.length; i++){
                if(players[i].direction !== null){
                    count++
                }
                if(players[i].userId === null){
                    players[i].userId = 'BOT'
                }
            }
            if(count == 0){
                console.log('Passing no directions selected')
            } else {
                console.log(`Adding ${players.length - count} bots...`)
                gameOver = true
                start(socket)
            }
        }
        // console.log(players)
        return
    })

    socket.on('disconnect', (res) => {
        console.log('User Disconnected...', socket.id)
        for(let i = 0; i < playersId.length; i++){
            if(playersId[i] === socket.id){
                playersId.splice(i, 1)
                players[i].userId = null
                players[i].direction = null
                if(leftOvers.length > 0){
                    playersId.push(leftOvers[0])
                    players[i].userId = leftOvers[0].userId
                    leftOvers.shift()
                }
            }
        }
        // add newUser from queu
        for(let i = 0; i < leftOvers.length; i++){
            if(leftOvers[i] === socket.id){
                console.log('Splicing user...', socket.id)
                leftOvers.splice(i, 1)
            }
        }
    })

})

httpsServer.listen(PORT, () => {
    console.log('Server is running...');
});