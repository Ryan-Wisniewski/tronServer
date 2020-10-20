const Game = require('./gameLogic')
const collisionCheck = require('./collisionCheck');

const PORT = process.env.PORT || 8000

//# FOR DEVELOPMENT
// const httpServer = require('http').createServer((req, res) => {
//     res.setHeader('Content-Type', 'text/html');
// });
// const io = require('socket.io')(httpServer);

//# FOR DEPLOYMENT
const httpsServer = require('https').createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');
});
const io = require('socket.io')(httpsServer);

let game = []
let playersId = []
let players = [
    {x: 16,y: 14, userId: null, direction: null},
    {x: 48,y: 14, userId: null, direction: null},
    {x: 16,y: 42, userId: null, direction: null},
    {x: 48,y: 42, userId: null, direction: null}
]
let leftOvers = [] // for people waiting in queu
let coordsArray = []
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
                    }
                }
            }
        }
        //check if all players ready
        let count = 0
        for(let i = 0; i < players.length; i++){
            if(players[i].direction !== null){
                console.log('Player added direction',players[i])
                count++
            }
        }
        if(count === players.length && gameOver === false){
            console.log('Starting Game!!!')
            count = 0
            gameOver= true
            gameTimer = setInterval(() => {
                for(let i = 0; i < players.length; i++){
                    if(players[i].x ===  null || players[i].y === null){
                        console.log('passing Push to players...')
                    } else {
                        //add to array cause player is alive
                        coordsArray.push({x: players[i].x, y:players[i].y})
                    }
                }
                Game(players)
                if(collisionCheck(players, coordsArray) !== false){
                    const check = collisionCheck(players, coordsArray)
                    players[check].userId = null
                    players[check].direction = null
                    players[check].x = null
                    players[check].y = null
                    winnerCheck()
                }
                socket.broadcast.emit('game-start', JSON.stringify(players))
                socket.emit('game-start', JSON.stringify(players))
            },300)
        }
        // console.log('New Direction', players)
    })

    const winnerCheck = () => {
        console.log('Player is dead...')
        let temp = 4
        for(let i = 0; i < players.length; i++){
            if(players[i].userId === null){
                temp--
            }
        }
        if(temp === 1){
            reset()
        }
    }

    const reset = () => {
        console.log('Halting GAME one player is alive...')
        //for loop here you add the userid back in
        for(let i = 0; i < players.length; i++){
            players[i].userId = playersId[i]
        }
        coordsArray = []
        gameOver = false
        players[0].direction = null
        players[1].direction = null
        players[2].direction = null
        players[3].direction = null
        players[0].x = 16
        players[1].x = 48
        players[2].x = 16
        players[3].x = 48
        players[0].y = 14
        players[1].y = 14
        players[2].y = 42
        players[3].y = 42
        console.log('Reset, Ready for players input...\n',players)
        socket.broadcast.emit('gameOver', JSON.stringify({message: true}))
        socket.emit('gameOver', JSON.stringify({message: true}))
        return clearInterval(gameTimer)
    }

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

httpServer.listen(PORT, () => {
    console.log('Server is running...');
});