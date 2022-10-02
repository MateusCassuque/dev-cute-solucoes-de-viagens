const express = require('express')
const path = require('path')

const router = express.Router()

const jsonCRUD = require('../../config/jsonCRUD')

const sf = {
  path: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'services.json' ),
  encoding: 'utf-8'
}

router.get('/show/:serviceId', async (req, res) => {
    try{
        const servicos = await jsonCRUD.JSONRead(sf.path,sf.encoding).then(res => {
            return res
        })
        const id = req.params.serviceId * 1
        const servico = servicos.find( s => s.id == id)

        if(!servico){
            res.status(404).send({Erro: 'Service no Found!'})
        }

        res.status(200).render('service/show', {servico})
    }catch(err){
        res.status(400).send({
            Erro: 'Erro ao buscar o serviço pelo Id.'
        })
    }
})

module.exports = app => app.use('/service', router)
