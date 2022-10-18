const path = require('path')
const jsonHelper = require('../../config/jsonCRUD')

const banco = {
  path: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'post.json' ),
  encoding: 'utf-8'
}

class Post {
  
  static count = 0
  static postagens = []
  
  constructor(postagem){
    
    jsonHelper.JSONRead(banco.path,banco.encoding).then(res => {
      
      Post.postagens = res
      
      Post.count = Post.postagens.length + 1
      this.id = Post.count

      this.postagem = postagem
      
      this.createdAte = new Date()
      
      Post.postagens.push(this)
      
      // Escrevendo os novos dados no arquivo json mesclado com os dados antigos
      jsonHelper.JSONWrite(banco.path, Post.postagens, banco.encoding)
      
    })
  }
}

module.exports = Post