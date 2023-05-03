import router from '@/router'

export function generateFullUrlByHash(hash) {
	const route = router.resolve({
		name: "RedirectToUrl",
		params: { hash: hash }
	});
	const absoluteURL = new URL(route.href, window.location.origin).href;
	return absoluteURL;
}


export function isValidUrl(urlStr) {
	let url;
	try {
		url = new URL(urlStr);
	} catch (_) {
		return false;
	}
	return url.protocol === "http:" || url.protocol === "https:";
}