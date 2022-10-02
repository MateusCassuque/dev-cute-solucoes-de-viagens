const express = require('express')
const router = express.Router()


const User = require('../models/User')
const Servico = require('../models/Servico')
const Processo = require('../models/Processo')

const servicos = require('../../config/jsons/services.json').reverse()
const processos = require('../../config/jsons/processes.json').reverse()


const user = require('../../config/jsons/users.json')

const userAdmin = user[0]

router.get('/login', (req, res) => {
    res.render('auth')
})

router.post('/', (req, res) => {
    const {email, senha} = req.body

    if((email === userAdmin.email) && (senha === userAdmin.senha)){
        // req.session.userAdmin = userAdmin
      res.redirect('/auth/dashboard')  
    }else{
        const message = 'Não autorizado!'
        res.render('auth', {message})
    }
})

router.get('/logout', (req, res) => {
    // req.session.destroy();
    // res.redirect('/');
})

router.get('/dashboard', (req, res) => {

    res.render('auth/dashboard', { userAdmin, servicos, processos})

})


router.get('/show/:processId', (req, res) => {
    res.render('auth/showProcess')
})

module.exports = app => app.use('/auth', router)