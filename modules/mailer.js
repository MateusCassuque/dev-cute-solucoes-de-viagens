const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')

const {host, port, user, pass} = require('../config/mailer.json')
const { extname } = require('path')

const transport = nodemailer.createTransport({host, port, auth:{
        user,
        pass
    }
})

transport.use('compile', hbs({
    viewEngine: 'handlebars',
    viewPath: path.resolve('./app/resource/mail'),
    extname: '.html'
}))

module.exports = transport