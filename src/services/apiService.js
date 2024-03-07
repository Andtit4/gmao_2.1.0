import axios from "axios"


export default {
  getUrl() {
    // return 'https://gmao-typescript.onrender.com'
    return 'https://kind-ray-smock.cyclic.app'
  },
  getLocal() {
    return 'http://localhost:3000'
  },

  getZone() {
    return axios({
      url: this.getUrl() + '/zone',
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
  },

  getEntrepot() {
    return axios({
      url: this.getUrl() + '/entrepot',
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
  },

  postEntrepot(id_entrepot, zone) {
    return axios({
      url: this.getUrl() + '/entrepot',
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      data: {
        id_entrepot: id_entrepot,
        zone: zone
      }
    })
  },

  updateStock(stock, article) {
    return axios({
      url: this.getUrl() + '/stock/' + stock + '/' + article,
      method: 'PUT',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
  },

  getArticleByStock(stock) {
    return axios({
      url: this.getUrl() + '/stock/search?stock=' + stock,
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
  },

  getOneArticleByStock(stock, _id) {
    return axios({
      url: this.getUrl() + '/stock/search/one?stock=' + stock + '&_id=' + _id,
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
  },

  createShare(article, description, nombre_a_transferer, stock_depart, stock_arrive, motif) {
    return axios({
      url: this.getUrl() + '/share',
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      data: {
        article: article,
        description: description,
        nombre_a_transferer: nombre_a_transferer,
        stock_depart: stock_depart,
        stock_arrive: stock_arrive,
        motif: motif
      }
    })
  },

  updateArticleNombreDisponible(nombre_disponible, _id) {
    return axios({
      url: this.getUrl() + '/stock/modify/available/' + nombre_disponible + '/' + _id,
      method: 'PUT',
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
    })
  }
}
