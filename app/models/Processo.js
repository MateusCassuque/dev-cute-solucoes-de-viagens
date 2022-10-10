const path = require('path')
const jsonHelper = require('../../config/jsonCRUD')

const banco = {
  path: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'processes.json' ),
  encoding: 'utf-8'
}

class Processo {
  
  static count = 0
  static processos = []
  
  constructor(client, servico){
    
    jsonHelper.JSONRead(banco.path,banco.encoding).then(res => {
      
      Processo.processos = res
      
      Processo.count = Processo.processos.length + 1
      this.id = Processo.count
      
      this.client = client
      this.servico = servico
      
      this.estado = false
      
      this.createdAte = Date.now()
      
      Processo.processos.push(this)
      
      // Escrevendo os novos dados no arquivo json mesclado com os dados antigos
      jsonHelper.JSONWrite(banco.path, Processo.processos, banco.encoding)
      
    })
  }
}

module.exports = Processo