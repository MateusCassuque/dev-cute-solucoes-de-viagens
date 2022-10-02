const path = require('path')
const jsonHelper = require('../../config/jsonCRUD')

const banco = {
  path: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'services.json' ),
  encoding: 'utf-8'
}

class Servico {
    static countId = 0
    static servicos = []

  constructor(servico){
    // Salvando a instância do objecto em um rquivo json
    // Lendo o arquivo json para pegar os dados nele existente
    
    jsonHelper.JSONRead(banco.path,banco.encoding).then(res => {
      
      Servico.servicos = res
      
      Servico.countId = Servico.servicos.length + 1
      this.id = Servico.countId
      
      this.name = servico.name
      this.preco = servico.preco
      this.microServicos = servico.microServicos
      
      this.requisitos = servico.requisitos
      // this.image = servico.image
      
      Servico.servicos.push(this)
      
      // Escrevendo os novos dados no arquivo json mesclado com os dados antigos
      jsonHelper.JSONWrite(banco.path, Servico.servicos, banco.encoding)
      
    })
  }
}

module.exports = Servico
  
