import React from 'react';
import {
	convertTime,
	availableForShift,
	pickWorker,
	daysOfWeek
} from './functions';

import {connect} from 'react-redux';
import {ScheduleShift} from './scheduleShift';
import {Hours} from './hours';


const mapStateToProps = state =>{
	return {
		workers: state.workers,
		shifts: state.shifts
	};
}

const mapDispatchToProps = dispatch =>{
	return {};
};

class Schedule extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			schedule: [],
			hours: []
		};
	}


	componentWillReceiveProps(nextProps){
		this.setSchedule(nextProps);
	}

	componentWillMount(nextProps){
		this.setSchedule(this.props);
	}


	setSchedule(props) {
		var schedule = [];
		var hours = [];
		//loop through days
		for(var dayIndex = 0;dayIndex<7;dayIndex++){
			schedule[dayIndex] = [];
			var shiftDay = props.shifts[dayIndex];

			//loop through shifts in day
			for(var shiftIndex = 0;shiftIndex<shiftDay.length;shiftIndex++){
				var shift = shiftDay[shiftIndex];
				shift.startTime = convertTime(shift.start);
				shift.endTime = convertTime(shift.end);

				var availableWorkers = [];
				//loop through workers, see who is avail
				for(var name in props.workers){
					if(availableForShift(shift,props.workers[name].availability[dayIndex])){
						availableWorkers.push(name);
					}
				}

				//pick an available worker
				var worker = pickWorker(availableWorkers);

				//update worker hours and schedule
				if(worker){
					if(hours[worker] === undefined){
						hours[worker] = 0;
					}
					hours[worker] += shift.endTime - shift.startTime;

					schedule[dayIndex][shiftIndex] = {worker:worker, available: availableWorkers.slice()};
				}else{
					//no one available
					if(hours["unscheduled"] === undefined){
						hours["unscheduled"] = 0;
					}
					hours['unscheduled'] += shift.endTime - shift.startTime;

					schedule[dayIndex][shiftIndex] = {worker:"unscheduled", available: []};
				}
			}
		}
		this.setState({
			hours: hours,
			schedule: schedule
		})
	}

	changeShiftWorker(shift, scheduleShift,newWorker) {
		console.log('changeShiftWorker', shift, scheduleShift, newWorker)
		if(!scheduleShift.available.includes(newWorker)){
			throw new Error(newWorker + " is not available to work this shift.");
		}
		var oldWorker = scheduleShift.worker;
		var shiftLength = shift.endTime - shift.startTime;
		scheduleShift.worker = newWorker;
		

		this.setState((prevState, props) => {

			var newState = {
				hours: {
					...prevState.hours
				}
			};
			if(oldWorker){
				newState.hours[oldWorker] = prevState.hours[oldWorker] - shiftLength;	
			}

			newState.hours[newWorker] = prevState.hours[newWorker] + shiftLength;

			return newState;
		});

	}

	buildDay(shiftDay, dayIndex) {
		var classes = ['scheduleShift', daysOfWeek()[dayIndex],'shift0']
		var nodes = [];
		nodes.push(
			<div className={classes.join(' ')}>{daysOfWeek()[dayIndex]}</div>
		);
		for(var shiftIndex = 0;shiftIndex<shiftDay.length;shiftIndex++){
			var shift = shiftDay[shiftIndex];
			shift.day = dayIndex;
			classes = [daysOfWeek()[dayIndex],'shift'+(shiftIndex+1)];
			var props = {
				shift: shift,
				onChange: this.changeShiftWorker.bind(this, shift, this.state.schedule[dayIndex][shiftIndex]),
				scheduled: this.state.schedule[dayIndex][shiftIndex]
			}
			nodes.push(
				<ScheduleShift {...props} className={classes.join(' ')} />
			)
		}
		return nodes;
	}

	buildDays() {
		var days = [];

		for(var dayIndex = 0;dayIndex<7;dayIndex++){
			var shiftDay = this.props.shifts[dayIndex];
			
			days.push(this.buildDay(shiftDay, dayIndex));
		}
		return days;
	}

	render() {
		return [
			<div className="scheduleWrapper">
				{this.buildDays()}
			</div>,
			<Hours hours={this.state.hours}/>
		];
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Schedule);