export function convertTime(timeStr) {
	var timeParts = timeStr.split(' ');
	if(timeParts.length !== 2){
		throw new Error("Time ("+timeStr+") doesn't have 2 parts (missing am/pm?)");
	}
	var pm = false;
	if(timeParts[1].toLowerCase() === 'pm'){
		pm = true;
	}

	var hrsMins = timeParts[0].split(':');
	if(hrsMins.length !== 2){
		throw new Error("Time ("+timeParts[0]+") doesn't have 2 parts (missing :00?)");
	}
	var hr = parseInt(hrsMins[0],10);
	hr = hr % 12;
	var min = parseInt(hrsMins[1],10);

	if(pm){
		hr+=12;
	}
	return hr + min/60;
}
export function availableForShift(shift, availabilities) {
	var start = shift.startTime;
	var end = shift.endTime;

	for(var i = 0;i<availabilities.length;i++){
		if(availabilities[i].startTime === undefined){
			availabilities[i].startTime = convertTime(availabilities[i].start);
		}

		if(availabilities[i].endTime === undefined){
			availabilities[i].endTime = convertTime(availabilities[i].end);
		}

		if(start >= availabilities[i].startTime && end <= availabilities[i].endTime){
			return true;
		}
	}

	return false;
}

export function pickWorker (availableWorkers) {
	if(availableWorkers.length === 0){
		return false;
	}else if(availableWorkers.length === 1){
		return availableWorkers[0];
	}
	//pick random for now
	//TODO: update to pick lowest hrs or something
	return availableWorkers[Math.floor(Math.random() * availableWorkers.length)];
};

export function daysOfWeek (){
	return  ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
}

export function times(){
	var times = [];

	var makeOption = (val) => ({value: val, label: val});
	for(var am = 0;am<2;am++){
		times.push(makeOption("12:00 "+((am===0)?"am":"pm")));
		
		times.push(makeOption("12:30 "+((am===0)?"am":"pm")));
		
		for(var hr = 1;hr<12;hr++){
			for(var min = 0;min<60;min+=30){
				var str = hr+":"+min+((min === 0)?"0":"")+" "+((am===0)?"am":"pm");
				
				times.push(makeOption(str));
			}
		}
	}
	return times;
}