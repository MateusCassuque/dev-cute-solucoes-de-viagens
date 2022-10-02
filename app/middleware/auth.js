const jwt = require('jsonwebtoken')

const authConfig = require('../../config/auth.json')

module.exports = (req, res, next) => {
    //constante que recebe o token enviado pelo usuario
    const authHeader = req.headers.authorization

    //verificando se o token nao foi enviado
    if(!authHeader){
        return res.status(401).send({ error: ' token not provider' })
    }

    //sepearando token enviado por espaco com a funcao split
    const parts = authHeader.split(' ')

    if(!parts === 2)
    return res.status(402).send({ error: 'token error' })

    //passando em variaves os valores separados do arrey parts
    const [schema, token] = parts

    //verificando se token nao comeca com a palavra 'Bearer'
    if(!/^Bearer$/i.test(schema))
    return res.status(403).send({ error: 'token malformatted', schema, token })

    jwt.verify(token, authConfig.secret, (err, decode) => {
      
        if(err) return res.status(401).send({ error: 'invalid token' })

        req.userId = decode.id
        req.token = token
        return next()
    })

}