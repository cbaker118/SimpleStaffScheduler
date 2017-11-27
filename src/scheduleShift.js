import React from 'react';
import Select from 'react-select';
import {
	convertTime,
	availableForShift,
	pickWorker,
	daysOfWeek
} from './functions';

export class ScheduleShift extends React.Component {
	renderAvailaleWorkers(scheduled){
		var options = [];
		if(scheduled.available.length === 0){
			options.push({value:scheduled.worker,label:scheduled.worker})
		}else{
			for(var i = 0;i<scheduled.available.length;i++){
				options.push({value:scheduled.available[i], label: scheduled.available[i]})
			}
		}
		this.select = (
			<Select 
				onChange={(val) => {
					this.props.onChange(val)
				}}
				searchable
				simpleValue
				value={scheduled.worker}
				options={options}
			/>
		);
		return this.select;
	}

	render(){
		return (
			<div className={"scheduleShift "+this.props.className}>
				<header>{this.props.shift.start + " - " + this.props.shift.end}</header>
				{this.renderAvailaleWorkers(this.props.scheduled)}
			</div>
		);
	}
}