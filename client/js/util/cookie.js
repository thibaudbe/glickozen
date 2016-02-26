export function setCookie(label, value, exdays, callback) {
	const date = new Date();
	date.setTime(date.getTime() + (exdays*24*60*60*1000));
	const expires = `expires=${date.toUTCString()}`;
	document.cookie = `${label}=${value};${expires}`;
	if (typeof callback === 'function') {
		callback();
	}
}

export function getCookie(label) {
	const name = `${label}=`;
	let cookies = document.cookie.split(';');
	for(let i=0; i<cookies.length; i++) {
		let cookie = cookies[i];
		while (cookie.charAt(0) === ' ') cookie = cookie.substring(1);
		if (cookie.indexOf(name) === 0) return cookie.substring(name.length, cookie.length);
	}
	return '';
}

export function checkCookie(label) {
	return new Promise((resolve, reject) => {
		const name = getCookie(label);
		if (name !== '') {
			resolve(name);
		} else {
			reject();
		}		
	});
}