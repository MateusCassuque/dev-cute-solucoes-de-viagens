const express = require('express')
const path = require('path')

const router = express.Router()
const jsonCRUD = require('../../config/jsonCRUD')

const sf = {
    pathU: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'users.json' ),
    pathS: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'services.json' ),
    pathP: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'processes.json' ),
    encoding: 'utf-8'
}

router.get('/login', (req, res) => {
    res.render('auth')
})

router.post('/', async (req, res) => {
    const {email, senha} = req.body

    const users = await jsonCRUD.JSONRead(sf.pathU,sf.encoding).then(res => {
        return res
    })

    const user = users.find(userAdmin => email === userAdmin.email && senha === userAdmin.senha )

    if(!user){
        const message = 'Não autorizado!'
  
        console.log(message)
        res.status(400).render('auth', {message})
    }
    
    console.log(user)
    // req.session.userAdmin = userAdmin
    res.status(200).redirect('/auth/dashboard')  
})

router.get('/logout', (req, res) => {
    // req.session.destroy();
    // res.redirect('/');
})

router.get('/dashboard', async (req, res) => {
    try {
        const processos = await jsonCRUD.JSONRead(sf.pathP,sf.encoding).then(res => {
            return res
        })
        
        const servicos = await jsonCRUD.JSONRead(sf.pathS,sf.encoding).then(res => {
            return res
        })
        
        res.status(200).render('auth/dashboard', {servicos, processos})
    } catch (error) {
        console.log(error)
        res.status(400).send({Error: 'Algo deu errado!: ' + error})
    }
})
    
router.get('/show/:processId', (req, res) => {
    res.render('auth/showProcess')
})

module.exports = app => app.use('/auth', router)