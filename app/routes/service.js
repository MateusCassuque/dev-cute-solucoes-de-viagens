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

router.get('/show/:serviceId', async (req, res) => {
    try{
        const servicos = await jsonCRUD.JSONRead(sf.pathS,sf.encoding).then(res => {
            return res
        })
        const id = req.params.serviceId * 1
        const servico = servicos.find( s => s.id == id)

        if(!servico){
            res.status(404).send({Erro: 'Service no Found!'})
        }

        const processos = await jsonCRUD.JSONRead(sf.pathP,sf.encoding).then(res => {
            return res
        })

        const serviceProcessos = processos.filter(pro => pro.servico.id == id)
        
        res.status(200).render('layout/admin', {
            conteudo: 'service/show',
            servico,serviceProcessos
        })
    }catch(err){
        res.status(400).send({
            Erro: 'Erro ao buscar o serviço pelo Id.'
        })
    }
})

router.get('/delete/:processoId', async (req, res) => {
    try {
        const servicos = await jsonCRUD.JSONRead(sf.pathS,sf.encoding).then(res => {
            return res
        })
    
      const id = req.params.processoId * 1
    
      const novosServicos = servicos.filter(pro => pro.id != id)
    
      jsonCRUD.JSONWrite(sf.pathS, novosServicos, sf.encoding)
  
      res.status(200).redirect('/auth/dashboard')
    } catch (error) {
      res.status(400).send({Erro: error})
    }
  
  })

module.exports = app => app.use('/service', router)
