import React from 'react';
import Select from 'react-select';
import {
	times,
	daysOfWeek
} from './functions';

export class Shift extends React.Component {

	render(){
		return (
			<span className={"shift "+this.props.className}>
				<label>Weekday: {daysOfWeek()[this.props.day]}</label><br/>
				<label>Start:
				<Select
					simpleValue
					onChange={(val)=>{
						this.props.onChange('start',val);
					}}
					value={this.props.shift.start}
					options={times()}/>
				</label>
				<label>End:
				<Select
					simpleValue
					onChange={(val)=>{
						this.props.onChange('end',val);
					}}
					value={this.props.shift.end}
					options={times()}/>
				</label>
				<button onClick={this.props.deleteShift}>Delete</button>
			</span>
		);
	}
}