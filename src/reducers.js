import {exampleShifts, exampleWorkers} from './exampleData';
import {convertTime} from './functions';


const comparator = (a,b)=>{
	if(convertTime(a.start) < convertTime(b.start)) return -1;
	if(convertTime(a.start) > convertTime(b.start)) return 1;
	return 0;
}

export function workersReducer(state,action){
	if(typeof state === 'undefined'){
		var workers = exampleWorkers();
	
		//make sure its all sorted
		for(var worker in workers){
			for(var dayIndex = 0;dayIndex<7;dayIndex++){
				workers[worker].availability[dayIndex].sort(comparator);
			}
		}
		return workers;
	}

	switch(action.type){
		case 'CREATE_AVAILABILITY': 
			//needs worker, day, start, end
			return {
				...state,
				[action.worker]: {availability: state[action.worker].availability.map((item,index) => {

					if(index !== action.day) {
						// This isn't the item we care about - keep it as-is
						return item;
					}

					var ret = item.slice(0,item.length);
					ret.push({
						start: action.start,
						end: action.end
					});
					ret.sort((a,b)=>{
						if(a.start < b.start) return -1;
						if(a.start > b.start) return 1;
						return 0;
					})
					return ret;
				})}
			}
		break;
		case 'DELETE_AVAILABILITY':
			//needs worker, day, index
			return {
				...state,
				[action.worker]:{availability: state[action.worker].availability.map((item,index) => {

					if(index !== action.day) {
						// This isn't the item we care about - keep it as-is
						return item;
					}

					return item.filter((item,index) => (index !== action.index))
				})}
			}
		break;
		case 'CHANGE_AVAILABILITY':
			//needs worker, day, index, key, value
			return {
				...state,
				[action.worker]:{availability: state[action.worker].availability.map((item,index) => {

					if(index !== action.day) {
						// This isn't the item we care about - keep it as-is
						return item;
					}

					var ret = [
						...item.slice(0,action.index),
						{
							...item[action.index],
							[action.key]: action.value
						},
						...item.slice(action.index+1)
					];
					ret.sort((a,b)=>{
						if(a.start < b.start) return -1;
						if(a.start > b.start) return 1;
						return 0;
					})
					return ret;
				})}
			}
		break;
		case 'CREATE_WORKER':
			//needs name
			return {
					...state,
					[action.name]:{availability: [[],[],[],[],[],[],[]]}
				}
		break;
		case 'DELETE_WORKER':
			//needs name
			var workers = {};
			for(var worker in state){
				if(worker == action.name){
					continue;
				}
				workers[worker] = state[worker];
			}
			return workers;
		break;
		default: 
			return state;
		break;
	}
}

export function shiftsReducer(state,action){
	if(typeof state === 'undefined'){
		var shifts = exampleShifts();

		//make sure its all sorted
		for(var dayIndex = 0;dayIndex<7;dayIndex++){
			shifts[dayIndex].sort(comparator);
		}

		return shifts;
	}
	switch(action.type){
		case 'CREATE_SHIFT':
			//needs day, start, end
			return state.map((item,index)=>{
				if(action.day !== index){
					return item;
				}
				var ret = item.slice(0,item.length);
				ret.push({start: action.start,end: action.end});
				ret.sort((a,b)=>{
					if(a.start < b.start) return -1;
					if(a.start > b.start) return 1;
					return 0;
				})
				return ret;
			});
		break;
		case 'CHANGE_SHIFT':
			//needs dayIndex, shiftIndex, key, value
			return state.map((item,index) =>{
				if(action.day !== index){
					return item;
				}
				var ret = [
					...item.slice(0,action.shift),
					{
						...item[action.shift],
						[action.key]: action.value
					},
					...item.slice(0,action.shift+1)
				];

				ret.sort((a,b)=>{
					if(a.start < b.start) return -1;
					if(a.start > b.start) return 1;
					return 0;
				})

				return ret;
			});
		break;
		case 'DELETE_SHIFT':
			//needs dayIndex, shiftIndex

			return state.map((item,index) =>{
				if(action.day !== index){
					return item;
				}
				return [
					...item.slice(0,action.shift),
					...item.slice(0,action.shift+1)
				]
			});
		break;
		default: 
			return state;
		break;
	}
}