
const mutations = {
	updateShortLinks: (state, shortLinks) => {
		state.shortLinks = shortLinks;
	},

	generateNewShortLink: (state, newShortLink) => {
		state.generatedShortLink = newShortLink;
	},

	clearGeneratedShortLink: (state) => {
		state.generatedShortLink = null;
	},

	receiveShortLink: (state, shortLink) => {
		state.receivedShortLink = shortLink;
	}
}

export default mutations;