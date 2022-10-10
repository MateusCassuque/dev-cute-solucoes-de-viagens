const path = require('path')
const jsonHelper = require('../../config/jsonCRUD')

const banco = {
  path: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'subservicos.json' ),
  encoding: 'utf-8'
}

class Subservico {
  
  static count = 0
  static subservicos = []
  
  constructor(subservico){
    
    jsonHelper.JSONRead(banco.path,banco.encoding).then(res => {
      
      Subservico.subservicos = res
      
      Subservico.count = Subservico.subservicos.length + 1
      this.id = Subservico.count
      
      this.name = subservico.name
      this.preco = subservico.preco
      
      this.estado = false
      
      this.createdAte = Date.now()
      
      Subservico.subservicos.push(this)
      
      // Escrevendo os novos dados no arquivo json mesclado com os dados antigos
      jsonHelper.JSONWrite(banco.path, Subservico.subservicos, banco.encoding)
      
    })
  }
}

module.exports = Subservico