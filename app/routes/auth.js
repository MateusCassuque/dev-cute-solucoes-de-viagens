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

router.get('/login', (req, res) => {
    res.render('pages/auth')
})

router.post('/', async (req, res) => {
    const {email, senha} = req.body

    const users = await jsonCRUD.JSONRead(sf.pathU,sf.encoding).then(res => {
        return res
    })

    const user = users.find(userAdmin => email === userAdmin.email && senha === userAdmin.senha )

    if(!user){
        const message = 'Não autorizado!'
  
        res.status(400).render('auth', {message})
    }
    // req.session.userAdmin = userAdmin
    res.status(200).redirect('/auth/dashboard')  
})

router.get('/logout', (req, res) => {
    // req.session.destroy();
    // res.redirect('/');
})

router.get('/dashboard', async (req, res) => {
    try {
        const processos = await jsonCRUD.JSONRead(sf.pathP,sf.encoding).then(res => {
            return res
        })

        const subprocessos = await jsonCRUD.JSONRead(sf.pathSP,sf.encoding).then(res => {
            return res
        })
        
        const servicos = await jsonCRUD.JSONRead(sf.pathS,sf.encoding).then(res => {
            return res
        })
        const subservicos = await jsonCRUD.JSONRead(sf.pathSb,sf.encoding).then(res => {
            return res
        })

        res.status(200).render('layout/admin', {
            conteudo: 'auth/dashboard',
            servicos, 
            processos,
            subservicos,
            subprocessos,
            result: null
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({Error: 'Algo deu errado!: ' + error})
    }
})
    
router.get('/buscar', async (req, res) => {

    var result = {
        tipo: req.query.tipo,
        name: req.query.search
    }
    
    try {
        const processos = await jsonCRUD.JSONRead(sf.pathP,sf.encoding).then(res => {
            return res
        })

        const subprocessos = await jsonCRUD.JSONRead(sf.pathSP,sf.encoding).then(res => {
            return res
        })
        
        const servicos = await jsonCRUD.JSONRead(sf.pathS,sf.encoding).then(res => {
            return res
        })
        const subservicos = await jsonCRUD.JSONRead(sf.pathSb,sf.encoding).then(res => {
            return res
        })

        if(result.tipo == 'Serviço'){
            result.list = servicos.filter(s => s.name == result.name)
        }else if(result.tipo == 'Sub-Serviço'){
            result.list = subservicos.filter(sbs => sbs.name == result.name)
        }else if(result.tipo == 'Sub-Processo'){
            result.list = subprocessos.filter(sbp => sbp.client.name == result.name)
        }else if(result.tipo == 'Processo'){
            result.list = processos.filter(p => p.client.name == result.name)
        }

        res.status(200).render('layout/admin', {
            conteudo: 'auth/dashboard',
            servicos, 
            processos,
            subservicos,
            subprocessos,
            result
        })
        
    }catch(error){
        res.status(400).send({Erro: 'Erro ao Procurar por ' + result.name + error})
    }
})

router.get('/posts', async (req, res) => {
    try{
        res.status(200).render('layout/admin', {
            conteudo: 'auth/postagens'
        })
    }catch(error){
        res.status(400).send(error)
    }
})

module.exports = app => app.use('/auth', router)