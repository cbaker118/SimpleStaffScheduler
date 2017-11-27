import React from 'react';
import {
	//convertTime,
	//availableForShift,
	//pickWorker,
	daysOfWeek
} from './functions';


export class Hours extends React.Component {
	renderHours() {
		var hours = [];
		for(var worker in this.props.hours){
			hours.push(
				<li>{worker}: {this.props.hours[worker]}</li>
			);
		}
		return hours;
	}

	render() {
		return (
			<div>
				{this.renderHours()}
			</div>
		)
	}
}