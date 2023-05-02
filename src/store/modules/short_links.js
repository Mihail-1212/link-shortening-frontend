import {
  GET_ALL_SHORT_LINKS,
	GET_SHORT_LINK_BY_HASH,
	GENERATE_SHORT_LINK_FROM_URL,
	CHANGE_SHORT_LINK_INFO,
	DELETE_SHORT_LINK
} from "@/store/actions/short_links"

import axios from "axios"

const state = {}

const getters = {}

const actions = {
  [GET_ALL_SHORT_LINKS]: ({getters}) => {
    return new Promise((resolve, reject) => {
      axios.get(
        getters.getShortLinksUrl + '/getAllShortLinks'
      ).then(response => {
        resolve(response.data)
      }).catch(error => reject(error))
    })
  },
	[GET_SHORT_LINK_BY_HASH]: ({getters}, hash) => {
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
	
	[GENERATE_SHORT_LINK_FROM_URL]: ({getters}, {title, url}) => {

    const request = {title, url};

    return new Promise((resolve, reject) => {
      axios.post(
        getters.getShortLinksUrl + '/generateShortLinkFromUrl', request
      ).then(response => {
        resolve(response.data)
      }).catch(error => reject(error))
    })
  },

	[CHANGE_SHORT_LINK_INFO]: ({getters}, updateRecord) => {
    const {title, hash_str} = updateRecord;
    const request = {
      title: title,
      hash: hash_str,
    };
    return new Promise((resolve, reject) => {
      axios.put(
        getters.getShortLinksUrl + '/changeShortLinkInfo', request
      ).then(response => {
        resolve(response.data)
      }).catch(error => reject(error))
    })
  },

	[DELETE_SHORT_LINK]: ({getters}, shortLink) => {
    return new Promise((resolve, reject) => {
      const request = {
        hash: shortLink.hash_str,
      }
      axios.delete(
        getters.getShortLinksUrl + '/deleteShortLink', {data: request}
      ).then(response => {
        resolve(response.data)
      }).catch(error => reject(error))
    })
  }

}

const mutations = {

}


export default {
  state,
  getters,
  actions,
  mutations,
}