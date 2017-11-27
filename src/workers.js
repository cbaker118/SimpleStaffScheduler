import React from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import {
	convertTime,
	daysOfWeek,
	times
} from './functions';

const mapStateToProps = state =>{
	return {
		workers: state.workers
	};
}

const mapDispatchToProps = dispatch =>{
	return {
		createWorker: (name) =>{
			dispatch({
				type: 'CREATE_WORKER',
				name: name
			});
		},
		deleteWorker: (name) =>{
			dispatch({
				type: 'DELETE_WORKER',
				name: name
			});
		},
		createAvailability: (worker, dayIndex, start, end) =>{
			dispatch({
				type: "CREATE_AVAILABILITY",
				start: start,
				end: end,
				worker: worker,
				day: dayIndex
			});
		},
		deleteAvailability: (worker, dayIndex,shiftIndex) =>{
			dispatch({
				type: 'DELETE_AVAILABILITY',
				worker: worker,
				day: dayIndex,
				index: shiftIndex
			});
		},
		changeAvailability: (worker, dayIndex, shiftIndex, key, value) =>{
			dispatch({
				type: 'CHANGE_AVAILABILITY',
				worker: worker,
				day: dayIndex,
				index: shiftIndex,
				key: key,
				value: value
			});
		}
	}
}

class Workers extends React.Component {

	renderShifts(worker){
		var days = [];

		for(var day = 0;day<this.props.workers[worker].availability.length;day++){
			var shifts = [];
			for(var j = 0;j<this.props.workers[worker].availability[day].length;j++){
				var available = this.props.workers[worker].availability[day][j];

				shifts.push(
					<span className="shift">
						Availability {j}<br/>
						<label>Weekday: {daysOfWeek()[day]}</label><br/>
						<label>Start:
						<Select
							simpleValue
							onChange={this.props.changeAvailability.bind(null,worker,day,j,"start")}
							value={available.start}
							options={times()}/>
						</label>
						<label>End:
						<Select
							simpleValue
							onChange={this.props.changeAvailability.bind(null,worker,day,j,"end")}
							value={available.end}
							options={times()}/>
						</label>
						<button onClick={this.props.deleteAvailability.bind(null,worker,day,j)}>Delete</button>
					</span>
				);
				//var available = this.props.workers[worker].availability[day][j];
				//workerContainer.appendChild(renderAvailable(available,name,day,j));	
			}

			shifts.push(
				<span className="shift">
					Add Availability<br/>
					<label>Weekday: {daysOfWeek()[day]}</label><br/>
					
					<button onClick={this.props.createAvailability.bind(null,worker,day, "12:00 am","12:00 pm")}>Add Availability</button>
				</span>
			);

			days.push(
				<li><label>{daysOfWeek()[day]}</label><div className="shiftWrapper">{shifts}</div></li>
			)
		}
		return days;
	}

	updateInputValue(evt){
		this.createWorkerName = evt.target.value;
	}



	render(){
		var workers = [];
		for(var worker in this.props.workers){
			workers.push(
				<li><label><strong>{worker}</strong></label>
					<ul>
						{this.renderShifts(worker)}
					</ul>
				</li>
			);
		}

		var onClick = function() {
			var name = this.createWorkerName;
			this.props.createWorker(name);
		}.bind(this);
		workers.push(
			<li><label><strong>Add Worker</strong></label>
				<div className="shiftWrapper">
					<span className="shift">
						<label>Worker Name:
							<input type="text" onChange={evt => this.updateInputValue(evt)}/>
						</label>
						<button onClick={onClick}>Add Worker</button>
					</span>
				</div>
			</li>
		)

		return (
			<ul>
				{workers}
			</ul>
		);
	}
}

var ConnectedWorkers = connect(mapStateToProps,
  mapDispatchToProps
)(Workers);

export default ConnectedWorkers;