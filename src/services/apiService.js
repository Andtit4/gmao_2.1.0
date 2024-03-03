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
  }
}
