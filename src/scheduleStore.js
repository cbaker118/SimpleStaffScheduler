import { Schedule } from './schedule';
import { Workers } from './workers';
import { combineReducers } from 'redux';

import {exampleShifts, exampleWorkers} from './exampleData';

var shifts = exampleShifts();
var workers = exampleWorkers();

function workersReducer(state,action){
	if(typeof state === 'undefined'){
		return workers;
	}

	switch(action.type){
		case 'CREATE_AVAILABILITY': 
			//needs worker, day, start, end
			return {
				...state,
				[action.worker]: state[action.worker].map((item,index) => {

					if(index !== action.day) {
						// This isn't the item we care about - keep it as-is
						return item;
					}

					return item.slice(0,item.length).push({
						start: action.start,
						end: action.end
					});
				})					
			}
		break;
		case 'DELETE_AVAILABILITY':
			//needs worker, day, index
			return {
				...state,
				[action.worker]: state[action.worker].map((item,index) => {

					if(index !== action.day) {
						// This isn't the item we care about - keep it as-is
						return item;
					}

					return item.filter((item,index) => (index !== action.index))
				})
			}
		break;
		case 'CHANGE_AVAILABILITY':
			//needs worker, day, index, key, value
			return {
				...state,
				[action.worker]: state.map((item,index) => {

					if(index !== action.day) {
						// This isn't the item we care about - keep it as-is
						return item;
					}

					return [
						item.slice(0,action.index),
						{
							...item[action.index],
							[action.key]: action.value
						},
						item.slice(action.index+1)
					]
				})					
			}
		break;
		case 'CREATE_WORKER':
			//needs name
			return {
					...state,
					[action.worker]:{availability: []}
				}
		break;
		case 'DELETE_WORKER':
			//needs name
			var workers = {};
			for(var worker in state){
				if(worker == action.worker){
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

function shiftsReducer(state,action){
	if(typeof state === 'undefined'){
		return shifts;
	}
	switch(action.type){
		case 'CREATE_SHIFT':
			//needs day, start, end
			return state.map((item,index)=>{
				if(action.day !== index){
					return item;
				}
				return item.push({start: action.start,end: action.end});
			});
		break;
		case 'CHANGE_SHIFT':
			//needs dayIndex, shiftIndex, key, value
			return state.map((item,index) =>{
				if(action.day !== index){
					return item;
				}
				return [
					...item.slice(0,action.shift),
					{
						...item[action.shift],
						[action.key]: action.value
					},
					...item.slice(0,action.shift+1)
				]
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

const rootReducer = combineReducers({
  shiftsReducer,
  workersReducer
});

export default rootReducer;