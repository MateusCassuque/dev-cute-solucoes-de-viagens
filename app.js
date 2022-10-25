const express = require('express')
const bodyParser = require('body-parser')

// const session = require('express-session')
// const connect = require('connect-flash')


const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const morgan = require('morgan')


app.set('views', __dirname + '/app/views')
app.set('view engine', 'ejs')

// app.use(express.cookieParser('DSV'))
// app.use(express.session())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/app/public'))
app.use(morgan("dev"))

// const mensagens = []

// io.on('connection', socket => {
//   console.log('Usuário Conectado: ' + socket.id)

//   socket.emit('previusMessage', mensagens)

//   socket.on('sendMessage', data => {
//     mensagens.push(data)

//     socket.broadcast.emit('recivedMessage', data)
//   })
// })

require('./app/routes/index')(app)

const port = process.env.PORT || 3003

app.listen(port, (()=>{
  console.log('SERVIDOR RONDANDO')
  console.log('ACESSE EM: http://127.0.0.1:'+port)
}))
