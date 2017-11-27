import React from 'react';
import {connect} from 'react-redux';

import {
	convertTime,
	availableForShift,
	pickWorker,
	daysOfWeek
} from './functions';

import {Shift} from './shift'


const mapStateToProps = state =>{
	return {
		shifts: state.shifts
	};
}

const mapDispatchToProps = dispatch =>{
	return {
		createShift: (dayIndex, start, end) => {
			dispatch({
				type:'CREATE_SHIFT',
				day: dayIndex,
				start: start,
				end: end
			});
		},
		changeShift: (dayIndex, shiftIndex, key, value) =>{
			dispatch({
				type: 'CHANGE_SHIFT',
				day: dayIndex,
				shift: shiftIndex,
				key: key,
				value: value
			});
		},
		deleteShift: (dayIndex, shiftIndex) =>{
			dispatch({
				type: 'DELETE_SHIFT',
				day: dayIndex,
				shift: shiftIndex
			})
		}
	}
}

class Shifts extends React.Component {
	buildDay(shiftDay, dayIndex) {
		var classes = ['scheduleShift', daysOfWeek()[dayIndex],'shift0']
		var nodes = [];
		nodes.push(
			<div className={classes.join(' ')}>{daysOfWeek()[dayIndex]}<br/><button onClick={this.props.createShift.bind(this,dayIndex, "12:00 am", "12:00 pm")}>Add Shift</button></div>
		);
		for(var shiftIndex = 0;shiftIndex<shiftDay.length;shiftIndex++){
			var shift = shiftDay[shiftIndex];
			
			classes = [daysOfWeek()[dayIndex],'shift'+(shiftIndex+1)];
			var props = {
				shift: shift,
				day: dayIndex,
				onChange: this.props.changeShift.bind(this, dayIndex, shiftIndex),
				deleteShift: this.props.deleteShift.bind(this,dayIndex,shiftIndex)
			}
			nodes.push(
				<Shift {...props} className={classes.join(' ')} />
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
		return (
			<div className="scheduleWrapper">
				{this.buildDays()}
			</div>
		);
	}
};

var ConnectedShifts = connect(mapStateToProps,mapDispatchToProps)(Shifts);

export default ConnectedShifts;