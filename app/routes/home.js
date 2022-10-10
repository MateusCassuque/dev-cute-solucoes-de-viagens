const express = require('express')
const path = require('path')
const multer = require('multer')

const router = express.Router();
const jsonCRUD = require('../../config/jsonCRUD')
const Servico = require('../models/Servico')
const multerConfig = require('../../config/multerConfig')


const cService = {
  path: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'services.json' ),
  encoding: 'utf-8'
}

const subServicosCro = [
  {
    tipo: 'Agendamento',
    preco: 15000,
  },

  {
    tipo: 'Reserva Hotel',
    preco: 6000,
  },
 
  {
    tipo: 'Reserva de Vôo',
    preco: 2500,
  },

  {
    tipo: 'Formulário',
    preco: 6000,
  },

] 
const subServicos = []

const preench = (() => {
  subServicosCro.forEach(s => {
    s.preco = s.preco.toLocaleString('pt-AO', {style: 'currency', currency: 'AOA'})
    subServicos.push(s)
  })
})

router.get('/', async (req,res) => {
  try {
    const servicos = await jsonCRUD.JSONRead(cService.path, cService.encoding).then(res => {
      return res
    })
    if(subServicos.length == 0){
      preench()
    }
    res.status(200).render('home', {subServicos, servicos})
  } catch (error) {
    res.status(400).res.send({
      Error: 'Erro to access the home page'
    })
  }
})


router.get('/register', (req, res) => {
  res.render('home/createService')
})

router.post('/sendImage/:servicoId', multer(multerConfig).single('file'), async (req, res) => {
  const id = req.params.servicoId * 1 
  const image = req.file
  
  try {
    const servicos = await jsonCRUD.JSONRead(cService.path, cService.encoding).then(res => {
      return res
    })
    
  const novoServicos = servicos.map(s => {
    if(s.id == id){
      s.imagem = image.filename
    }
    return s
  })
  jsonCRUD.JSONWrite(cService.path, novoServicos, cService.encoding)
    
    res.status(200).redirect('/auth/dashboard')
  } catch (error) {
      res.status(400).send({erro: 'Error to send image: ' + error})
  }

})

router.post('/', async (req, res) => {
  try{
    const servico = {...req.body}
    const valor = servico.preco * 1
    servico.preco = valor.toLocaleString('pt-AO', {style: 'currency', currency: 'AOA'})
    
    //Transformando as strings de microServicos e de requisitos rescebidas do req.body em array de strings
    const reqArray = servico.requisitos.split(',')
    servico.requisitos = reqArray
    
    const servArray = servico.microServicos.split(',')
    servico.microServicos = servArray

    const newServico = new Servico(servico)

    const servicos = await jsonCRUD.JSONRead(cService.path, cService.encoding).then(res => {
      return res
    })
    
    if (!servicos) {
      res.status(404).send({Erro: 'Serviço não encontrado!'})
    }

    servico.id = servicos.length + 1

    res.status(200).send(servico)

  }catch(error){
    res.status(400).res.send({error: 'Error to create service: ' + error})
  }
    
})

router.get('/service/:servicoId', async (req, res) => {
  try {
    const servicos = await jsonCRUD.JSONRead(cService.path, cService.encoding).then(res => {
      return res
    })
    
    if (!servicos) {
      res.status(404).send({Erro: 'Serviço não encontrado!'})
    }

    const id = req.params.servicoId * 1
  
    const servico = servicos.find( s => s.id == id)

    var clientNovo = null
  
    res.status(200).render('service', { servico, clientNovo })
  } catch (error) {
    res.status(400).send({
      Error: 'Erro ao encontrar o serviço'
    })
  }
})

router.get('/remove', async (req, res) => {
  // const servicos = await jsonCRUD.JSONRead(cService.path, cService.encoding).then(res => {
  //   return res
  // })

  // const novaArray = servicos.map(s => {
  //   if(s.id == 1){
  //     s.name = 'Alterado'
  //   }
  //   return s
  // })
  // jsonCRUD.JSONWrite(cService.path, novaArray, cService.encoding)
  // console.log(novaArray)
  
  // res.render('auth/showProcess', {novaArray})
})
module.exports = app => app.use('/', router); 