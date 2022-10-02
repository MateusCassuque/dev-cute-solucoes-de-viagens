const express = require('express')
const path = require('path')
const router = express.Router()

const Processo =  require('../models/Processo')
const Servico = require('../models/Servico')


const jsonCRUD = require('../../config/jsonCRUD')

const sf = {
  pathS: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'services.json' ),
  pathP: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'processes.json' ),
  encoding: 'utf-8'
}

router.post('/:servicoId', async (req, res) => {
    try {

        const servicos = await jsonCRUD.JSONRead(sf.pathS,sf.encoding).then(res => {
          return res
        })

        const client  = req.body

        const id = req.params.servicoId * 1

        var servico = null

        servicos.forEach( s => {
            if(s.id == id){
                servico = s
            }
        })

        const processo = new Processo(client, servico)

        res.render('service', {servico})

    } catch (error) {
        console.log(error)
    }
})

router.get('/show/:serviceId', async (req, res) => {
    try{
        const processos = await jsonCRUD.JSONRead(sf.pathP,sf.encoding).then(res => {
            return res
        })
        const id = req.params.serviceId * 1
        const processo = processos.find( s => s.id == id)

        if(!processo){
            res.status(404).send({Erro: 'Service no Found!'})
        }

        const processoId = processo.id
        const servico = processo.servico
        const client = processo.client

        res.status(200).render('process/show', {processoId, servico, client})
    }catch(err){
        res.status(400).send({
            Erro: 'Erro ao buscar o serviço pelo Id.'
        })
    }
})

module.exports = app => app.use('/processo', router)
