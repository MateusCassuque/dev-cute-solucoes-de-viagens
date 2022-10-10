const express = require('express')
const path = require('path')
const router = express.Router()

const Processo =  require('../models/Processo')


const jsonCRUD = require('../../config/jsonCRUD')

const sf = {
    pathU: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'users.json' ),
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

        var clientNovo = client

        res.render('service', {servico, clientNovo})

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

        res.status(200).render('process/show', { processo })
    }catch(err){
        res.status(400).send({
            Erro: 'Erro ao buscar o serviço pelo Id.'
        })
    }
})

router.get('/delete/:processoId', async (req, res) => {
  try {
    const processos = await jsonCRUD.JSONRead(sf.pathP,sf.encoding).then(res => {
        return res
    })
  
    const id = req.params.processoId * 1
  
    const novosProcessos = processos.filter(pro => pro.id != id)
  
    jsonCRUD.JSONWrite(sf.pathP, novosProcessos, sf.encoding)

    res.status(200).redirect('/auth/dashboard')
  } catch (error) {
    res.status(400).send({Erro: error})
  }

})

router.post('/edit/:processoId', async (req, res) => {
    try {
        const id = req.params.processoId * 1
        
        const processos = await jsonCRUD.JSONRead(sf.pathP,sf.encoding).then(res => {
            return res
        })
        
        const processo = processos.find(pro => pro.id == id)

        const estado = req.body.estado

        processo.client.name = req.body.name
        processo.client.apelido = req.body.apelido
        processo.client.telefone = req.body.telefone
        processo.client.bi = req.body.bi
        processo.client.passaport = req.body.passaport
        processo.client.nascimento = req.body.nascimento
        processo.client.passaportDate = req.body.passaportDate

        if(estado === 'Concluido'){
            processo.estado = true
        }else{
            processo.estado = false
        }
        
        const novosProcessos = processos.filter(pro => pro.id != id)

        novosProcessos.push(processo)

        jsonCRUD.JSONWrite(sf.pathP, novosProcessos, sf.encoding)

        res.status(200).redirect('/auth/dashboard')
    } catch (error) {
        res.status(400).send({Erro: error})
    }
})

module.exports = app => app.use('/processo', router)
