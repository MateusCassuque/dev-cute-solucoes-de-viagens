const path = require('path')
const jsonHelper = require('../../config/jsonCRUD')

const banco = {
  path: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'subprocessos.json' ),
  encoding: 'utf-8'
}

class Subprocesso {
  
  static count = 0
  static processos = []
  
  constructor(client, servico){
    
    jsonHelper.JSONRead(banco.path,banco.encoding).then(res => {
      
      Subprocesso.processos = res
      
      Subprocesso.count = Subprocesso.processos.length + 1
      this.id = Subprocesso.count
      
      this.client = client
      this.servico = servico
      
      this.estado = false
      
      this.createdAte = Date.now()
      
      Subprocesso.processos.push(this)
      
      // Escrevendo os novos dados no arquivo json mesclado com os dados antigos
      jsonHelper.JSONWrite(banco.path, Subprocesso.processos, banco.encoding)
      
    })
  }
}

module.exports = Subprocesso