
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
}

export default mutations;