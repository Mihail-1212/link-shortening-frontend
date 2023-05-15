const getters = {
	sortedShortLinkList: state => {
		return state.shortLinks.sort((a, b) => {
			return a.hash_str.toLowerCase().localeCompare(b.hash_str.toLowerCase())
		})
	},

	getNewShortLink: state => {
		return state.generatedShortLink
	},

	getReceivedShortLink: state => {
		return state.receivedShortLink;
	}
}

export default getters;