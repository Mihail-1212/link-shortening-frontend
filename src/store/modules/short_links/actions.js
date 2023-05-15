import axios from "axios"


const actions = {
  getAllShortLinks: (ctx) => {
    return new Promise((resolve, reject) => {
      axios.get(
        // {getters}
        ctx.getters.getShortLinksUrl + '/getAllShortLinks'
      ).then(response => {
        let shortLinks = response.data;
        resolve(shortLinks)

        ctx.commit("updateShortLinks", shortLinks);
      }).catch(error => {
        console.error(error);
        reject(error);
      })
    })
  },

	getShortLinkByHash: ({getters}, hash) => {
    const request = {
      hash: hash
    };
    return new Promise((resolve, reject) => {
      axios.post(
        getters.getShortLinksUrl + '/getShortLinkByHash', request
      ).then(response => {
        resolve(response.data)
      }).catch(error => reject(error))
    })
  },
	
	generateShortLinkFromUrl: (ctx, {title, url}) => {
    const request = {title, url};
    return new Promise((resolve, reject) => {
      axios.post(
        ctx.getters.getShortLinksUrl + '/generateShortLinkFromUrl', request
      ).then(response => {
        let newShortLink = response.data;
        // Dispatch "getAllShortLinks" to update short link list
        ctx.dispatch('getAllShortLinks');
        // Commit mutation to get new generated short link
        ctx.commit("generateNewShortLink", newShortLink);
        resolve(newShortLink)
      }).catch(error => {
        console.error(error)
        reject(error);
      })
    })
  },

	changeShortLinkInfo: (ctx, updateRecord) => {
    const {title, hash_str} = updateRecord;
    const request = {
      title: title,
      hash: hash_str,
    };
    return new Promise((resolve, reject) => {
      axios.put(
        ctx.getters.getShortLinksUrl + '/changeShortLinkInfo', request
      ).then(response => {
        // Dispatch "getAllShortLinks" to update short link list
        ctx.dispatch('getAllShortLinks');
        resolve(response.data)
      }).catch(error => {
        console.error(error)
        reject(error)
      })
    })
  },

	deleteShortLink: (ctx, shortLink) => {
    return new Promise((resolve, reject) => {
      const request = {
        hash: shortLink.hash_str,
      }
      axios.delete(
        ctx.getters.getShortLinksUrl + '/deleteShortLink', {data: request}
      ).then(response => {
        // Dispatch "getAllShortLinks" to update short link list
        ctx.dispatch('getAllShortLinks');
        resolve(response.data);
      }).catch(error => {
        console.error(error);
        reject(error);
      })
    })
  },

  clearGeneratedShortLInk: (ctx) => {
    ctx.commit("clearGeneratedShortLink");
  }
}

export default actions;