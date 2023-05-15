import shortLinkModules from "@/store/modules/short_links"
import { createStore } from 'vuex'


let storeOptions = {
  state: {
      url: {
          urlProtocol: process.env.VUE_APP_BACKEND_URL_PROTOCOL,
          domain: process.env.VUE_APP_BACKEND_DOMAIN,
          port: process.env.VUE_APP_BACKEND_PORT,
          version: process.env.VUE_APP_BACKEND_VERSION
      },
  },
  getters: {
      /* Returns the full url to the api */
      getFullURL: state => {
          return `${state.url.urlProtocol}://${state.url.domain}:${state.url.port}/${state.url.version}`
      },
      /* Returns the full url to short links api */
      getShortLinksUrl: (state, getters) => {
          return `${getters.getFullURL}/short-links`
      }
  },
  modules: {
		shortLinkModules
	}
}


export default createStore(storeOptions)
