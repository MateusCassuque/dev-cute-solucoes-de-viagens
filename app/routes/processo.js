const express = require('express')
const path = require('path')
const router = express.Router()

const Processo =  require('../models/Processo')
const Subprocesso =  require('../models/Subprocesso')

const mailer = require('../../modules/mailer')


const jsonCRUD = require('../../config/jsonCRUD')

const sf = {
    pathU: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'users.json' ),
    pathS: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'services.json' ),
    pathSbS: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'subservicos.json' ),
    pathP: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'processes.json' ),
    pathSP: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'subprocessos.json' ),
    encoding: 'utf-8'
}

router.post('/:servicoId', async (req, res) => {
    try {

        const servicos = await jsonCRUD.JSONRead(sf.pathS,sf.encoding).then(res => {
          return res
        })

        const client  = req.body

        const id = req.params.servicoId * 1

        var servico = servicos.find( s => s.id == id)

        const processo = new Processo(client, servico)

        var clientNovo = client
        
        console.log(client, servico)

        try {
            mailer.sendMail({
                to: 'mateusAbril7@gmail.com',
                from: 'mateusAbril2@gmail.com',
                template: 'newProcess',
                context: {servico, client}
            })
            
        } catch (error) {
            
        } 

        res.status(200).render('layout/home', {
            conteudo: 'service/index',
            servico, clientNovo
        })

    } catch (error) {
        console.log(error)
    }
})

router.post('/sub/:servicoId', async (req, res) => {
    try {

        const subservicos = await jsonCRUD.JSONRead(sf.pathSbS,sf.encoding).then(res => {
          return res
        })

        const client  = req.body

        const id = req.params.servicoId * 1

        var subServico = subservicos.find(sub => sub.id == id)

        const subprocesso = new Subprocesso(client, subServico)

        var clientNovo = client

        res.status(200).render('layout/home', {
            conteudo: 'subservico/index',    
            subServico, clientNovo
        })

    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/sub/show/:serviceId', async (req, res) => {
    try{
        
        const subprocessos = await jsonCRUD.JSONRead(sf.pathSP,sf.encoding).then(res => {
            return res
        })
        const id = req.params.serviceId * 1
        const processo = subprocessos.find( s => s.id == id)

        if(!processo){
            res.status(404).send({Erro: 'Service no Found!'})
        }

        res.status(200).render('layout/admin', {
            conteudo: 'process/show',    
            processo 
        })
    }catch(err){
        res.status(400).send({
            Erro: 'Erro ao buscar o serviço pelo Id.'
        })
    }
})


router.get('/sub/delete/:processoId', async (req, res) => {
    try {
      const subprocessos = await jsonCRUD.JSONRead(sf.pathSP,sf.encoding).then(res => {
          return res
      })
    
      const id = req.params.processoId * 1
    
      const novossubProcessos = await subprocessos.filter(pro => pro.id != id)
    
      jsonCRUD.JSONWrite(sf.pathSP, novossubProcessos, sf.encoding)
  
      res.status(200).redirect('/auth/dashboard')
    } catch (error) {
      res.status(400).send({Erro: error})
    }
  
  })
  
  router.post('/sub/edit/:processoId', async (req, res) => {
      try {
          const id = req.params.processoId * 1
          
          const subprocessos = await jsonCRUD.JSONRead(sf.pathSP,sf.encoding).then(res => {
              return res
          })
          
          const subprocesso = subprocessos.find(pro => pro.id == id)
  
          const estado = req.body.estado
  
          subprocesso.client.name = req.body.name
          subprocesso.client.apelido = req.body.apelido
          subprocesso.client.telefone = req.body.telefone
          subprocesso.client.bi = req.body.bi
          subprocesso.client.passaport = req.body.passaport
          subprocesso.client.nascimento = req.body.nascimento
          subprocesso.client.passaportDate = req.body.passaportDate
  
          if(estado === 'Concluido'){
              subprocesso.estado = true
          }else{
              subprocesso.estado = false
          }
          
          const novosProcessos = subprocessos.filter(pro => pro.id != id)
  
          novosProcessos.push(subprocesso)
  
          jsonCRUD.JSONWrite(sf.pathSP, novosProcessos, sf.encoding)
  
          res.status(200).redirect('/auth/dashboard')
      } catch (error) {
          res.status(400).send({Erro: error})
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

        res.status(200).render('layout/admin', {
            conteudo: 'process/show',    
            processo 
        })

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
  
    const novosProcessos = await processos.filter(pro => pro.id != id)
  
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
