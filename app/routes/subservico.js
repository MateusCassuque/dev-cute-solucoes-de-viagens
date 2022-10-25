const express = require('express')
const path = require('path')
const router = express.Router()

const Subservico =  require('../models/Subservicos')


const jsonCRUD = require('../../config/jsonCRUD')

const sf = {
    
    pathU: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'users.json' ),

    path: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'subservicos.json' ),
    
    pathS: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'services.json' ),
    
    pathP: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'processes.json' ),

    encoding: 'utf-8'
}

router.post('/', async (req, res) => {
    try {
        const valor = req.body.preco * 1

        const preco = valor.toLocaleString('pt-AO', {style: 'currency', currency: 'AOA'})

        const subservico = {
            name: req.body.name,
            preco: preco
        }
        const novoSubservico = new Subservico(subservico)

        res.status(200).render('layout/home', {
            conteudo: 'subservico/create',
            subservico
        })

    } catch (error) {
        res.status(400).send({Erro: 'Erro criar o sub-Serviço: ' + error})
    }
})

router.get('/create', async (req, res) => {
    try{
        const subservico = null
        res.status(200).render('layout/home', {
            conteudo: 'subservico/create',
            subservico
        })
    }catch(err){
        res.status(400).send({
            Erro: 'Erro ao buscar o serviço pelo Id.'
        })
    }
})

router.get('/show/:serviceId', async (req, res) => {
    try{
        const subServicos = await jsonCRUD.JSONRead(sf.path,sf.encoding).then(res => {
            return res
        })
        const id = req.params.serviceId * 1
        const subServico = subServicos.find( s => s.id == id)

        if(!subServico){
            res.status(404).send({Erro: 'Service no Found!'})
        }

        res.status(200).render('layout/home', {
            conteudo: 'subservico/show',
            subServico
        })

    }catch(err){
        res.status(400).send({
            Erro: 'Erro ao buscar o serviço pelo Id.'
        })
    }
})

router.get('/:serviceId', async (req, res) => {
    try{
        const subServicos = await jsonCRUD.JSONRead(sf.path,sf.encoding).then(res => {
            return res
        })
        const id = req.params.serviceId * 1
        const subServico = subServicos.find( s => s.id == id)

        if(!subServico){
            res.status(404).send({Erro: 'Service no Found!'})
        }

        var clientNovo = null

        res.status(200).render('layout/home', { 
            conteudo: 'subservico/index',    
            subServico, clientNovo 
        })
    }catch(err){
        res.status(400).send({
            Erro: 'Erro ao buscar o serviço pelo Id.'
        })
    }
})

router.get('/delete/:subServicoId', async (req, res) => {
  try {
    const subServicos = await jsonCRUD.JSONRead(sf.path,sf.encoding).then(res => {
        return res
    })
  
    const id = req.params.subServicoId * 1
  
    const novosSubServico = subServicos.filter(pro => pro.id != id)
  
    jsonCRUD.JSONWrite(sf.path, novosSubServico, sf.encoding)

    res.status(200).redirect('/auth/dashboard')
  } catch (error) {
    res.status(400).send({Erro: error})
  }

})

router.post('/edit/:processoId', async (req, res) => {
    try {
        const id = req.params.processoId * 1
        
        const subservicos = await jsonCRUD.JSONRead(sf.path,sf.encoding).then(res => {
            return res
        })

        const estado = req.body.estado
        const subservico = subservicos.find(sbs => sbs.id == id)

        subservico.name = req.body.name
        
        const valor = req.body.preco * 1

        subservico.preco = valor.toLocaleString('pt-AO', {style: 'currency', currency: 'AOA'})

        

        if(estado === 'Concluido'){
            subservico.estado = true
        }else{
            subservico.estado = false
        }
        
        const novosProcessos = subservicos.filter(pro => pro.id != id)

        novosProcessos.push(subservico)

        jsonCRUD.JSONWrite(sf.path, novosProcessos, sf.encoding)

        res.status(200).redirect('/auth/dashboard')
    } catch (error) {
        res.status(400).send({Erro: 'Erro ao Editar o Sub-Serviço' + error})
    }
})

module.exports = app => app.use('/subservico', router)
