const express = require('express')
const path = require('path')
const router = express.Router()

const Subservico =  require('../models/Subservicos')


const jsonCRUD = require('../../config/jsonCRUD')

const sf = {
    
    pathU: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'users.json' ),

    path: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'subservico.json' ),
    
    pathS: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'services.json' ),
    
    pathP: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'processes.json' ),

    encoding: 'utf-8'
}

router.post('/', async (req, res) => {
    try {
        const subservico  = req.body

        const novoSubservico = new Subservico(subservico)

        res.render('subservico/create', {novoSubservico})

    } catch (error) {
        console.log(error)
    }
})

router.get('/create', async (req, res) => {
    try{

        res.status(200).render('subservico/create', {  })
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

        res.status(200).render('subservico', { subServico })
    }catch(err){
        res.status(400).send({
            Erro: 'Erro ao buscar o serviço pelo Id.'
        })
    }
})

router.get('/delete/:subServicoId', async (req, res) => {
  try {
    const subServicos = await jsonCRUD.JSONRead(sf.pathP,sf.encoding).then(res => {
        return res
    })
  
    const id = req.params.subServicoId * 1
  
    const novosSubServico = subServicos.filter(pro => pro.id != id)
  
    jsonCRUD.JSONWrite(sf.pathP, novosSubServico, sf.encoding)

    res.status(200).redirect('/auth/dashboard')
  } catch (error) {
    res.status(400).send({Erro: error})
  }

})

// router.post('/edit/:processoId', async (req, res) => {
//     try {
//         const id = req.params.processoId * 1
        
//         const processos = await jsonCRUD.JSONRead(sf.pathP,sf.encoding).then(res => {
//             return res
//         })
        
//         const processo = processos.find(pro => pro.id == id)

//         const estado = req.body.estado

//         processo.client.name = req.body.name
//         processo.client.apelido = req.body.apelido
//         processo.client.telefone = req.body.telefone
//         processo.client.bi = req.body.bi
//         processo.client.passaport = req.body.passaport
//         processo.client.nascimento = req.body.nascimento
//         processo.client.passaportDate = req.body.passaportDate

//         if(estado === 'Concluido'){
//             processo.estado = true
//         }else{
//             processo.estado = false
//         }
        
//         const novosProcessos = processos.filter(pro => pro.id != id)

//         novosProcessos.push(processo)

//         jsonCRUD.JSONWrite(sf.pathP, novosProcessos, sf.encoding)

//         res.status(200).redirect('/auth/dashboard')
//     } catch (error) {
//         res.status(400).send({Erro: error})
//     }
// })

module.exports = app => app.use('/subservico', router)
