const express = require('express')
const path = require('path')
const multer = require('multer')

const router = express.Router();
const jsonCRUD = require('../../config/jsonCRUD')
const Servico = require('../models/Servico')
const multerConfig = require('../../config/multerConfig')


const dbc = {
  path: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'services.json' ),
  pathSbs: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'subservicos.json' ),
  encoding: 'utf-8'
}

router.get('/', async (req,res) => {
  try {
    const servicos = await jsonCRUD.JSONRead(dbc.path, dbc.encoding).then(res => {
      return res
    })
    
    const subservicos = await jsonCRUD.JSONRead(dbc.pathSbs, dbc.encoding).then(res => {
      return res
    })
    
    res.status(200).render('layout/home', {
      conteudo: '/home/index',
      subservicos, 
      servicos
    })
  } catch (error) {
    res.status(400).res.send({
      Error: 'Erro to access the home page'
    })
  }
})


router.get('/register', (req, res) => {
  res.render('layout/home',{
    conteudo: 'home/createService'
  })
})

router.post('/sendImage/:servicoId', multer(multerConfig).single('file'), async (req, res) => {
  const id = req.params.servicoId * 1 
  const image = req.file
  
  try {
    const servicos = await jsonCRUD.JSONRead(dbc.path, dbc.encoding).then(res => {
      return res
    })
    
  const novoServicos = servicos.map(s => {
    if(s.id == id){
      s.imagem = image.filename
    }
    return s
  })
  jsonCRUD.JSONWrite(dbc.path, novoServicos, dbc.encoding)
    
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

    const servicos = await jsonCRUD.JSONRead(dbc.path, dbc.encoding).then(res => {
      return res
    })
    
    if (!servicos) {
      res.status(404).send({Erro: 'Servi??o n??o encontrado!'})
    }

    servico.id = servicos.length + 1

    res.status(200).send(servico)

  }catch(error){
    res.status(400).res.send({error: 'Error to create service: ' + error})
  }
    
})

router.get('/service/:servicoId', async (req, res) => {
  try {
    const servicos = await jsonCRUD.JSONRead(dbc.path, dbc.encoding).then(res => {
      return res
    })
    
    if (!servicos) {
      res.status(404).send({Erro: 'Servi??o n??o encontrado!'})
    }

    const id = req.params.servicoId * 1
  
    const servico = servicos.find( s => s.id == id)

    var clientNovo = null
  
    res.status(200).render('layout/home', {conteudo: 'service/index', servico, clientNovo })
  } catch (error) {
    res.status(400).send({
      Error: 'Erro ao encontrar o servi??o'
    })
  }
})

router.get('/wise', async (req, res) => {
  // const servicos = await jsonCRUD.JSONRead(dbc.path, dbc.encoding).then(res => {
  //   return res
  // })

  // const novaArray = servicos.map(s => {
  //   if(s.id == 1){
  //     s.name = 'Alterado'
  //   }
  //   return s
  // })
  // jsonCRUD.JSONWrite(dbc.path, novaArray, dbc.encoding)
  // console.log(novaArray)
  
  res.render('pages/home/wise')
})
module.exports = app => app.use('/', router); 