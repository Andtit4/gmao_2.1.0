import axios from "axios"


export default {
  getUrl() {
    // return 'https://gmao-typescript.onrender.com'
    // return 'https://kind-ray-smock.cyclic.app'
    return 'https://gmao-express-api.vercel.app'
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

  getAllSites() {
    return axios({
      url: this.getUrl() + '/site',
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
  },

  historyTransaction() {
    return axios({
      url: this.getUrl() + '/share',
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
    })
  },
   getWeekNumber(uneDate) {
		var d = new Date(uneDate);
		var DoW = d.getDay();
		d.setDate(d.getDate() - (DoW + 6) % 7 + 3);
		var ms = d.valueOf(); // GMT
		d.setMonth(0);
		d.setDate(4); 
		return Math.round((ms - d.valueOf()) / (7 * 864e5)) + 1;
	}

}
