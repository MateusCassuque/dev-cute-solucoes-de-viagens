const express = require('express')
const path = require('path')

const router = express.Router()
const jsonCRUD = require('../../config/jsonCRUD')

const sf = {
    pathU: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'users.json' ),
    pathS: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'services.json' ),
    pathSb: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'subservicos.json' ),
    pathP: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'processes.json' ),
    pathSP: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'subprocessos.json' ),
    encoding: 'utf-8'
}


router.get('/create', async (req, res) => {
    try{
        res.status(200).render('layout/admin', {
            conteudo: 'postagem/create'
        })
    }catch(error){
        res.status(400).send(error)
    }
})

router.post('/conteudo', async (req, res) => {
    try{
        console.log(req.body)
        res.status(200).render('layout/admin', {
            conteudo: 'postagem/create'
        })
    }catch(error){
        res.status(400).send(error)
    }
})

module.exports = app => app.use('/post', router)