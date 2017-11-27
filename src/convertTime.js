export function convertTime(timeStr) {
	var timeParts = timeStr.split(' ');
	if(timeParts.length !== 2){
		throw {error: "Time ("+timeStr+") doesn't have 2 parts (missing am/pm?)"};
	}
	var pm = false;
	if(timeParts[1].toLowerCase() === 'pm'){
		pm = true;
	}

	var hrsMins = timeParts[0].split(':');
	if(hrsMins.length !== 2){
		throw {error: "Time ("+timeParts[0]+") doesn't have 2 parts (missing :00?)"};
	}
	var hr = parseInt(hrsMins[0],10);
	hr = hr % 12;
	var min = parseInt(hrsMins[1],10);

	if(pm){
		hr+=12;
	}
	return hr + min/60;
}
