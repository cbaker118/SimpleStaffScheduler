import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { combineReducers } from 'redux';

import {
	BrowserRouter as Router,
	Route,
	Link,
	Redirect
} from 'react-router-dom';

import {shiftsReducer,workersReducer} from './reducers';
import ConnectedWorkers from './workers';
import ConnectedSchedule from './schedule';
import ConnectedShifts from './shifts';
//import {ConnectedShifts} from './shifts';

import {styles} from './App.css'
import 'react-select/dist/react-select.css';

const rootReducer = combineReducers({
  shifts: shiftsReducer,
  workers: workersReducer
});

var store = createStore(rootReducer);

const SchedulingApp = () => (
	<html>
	<head>
		<title>Dana's Scheduler</title>
		<link rel="stylesheet" type="text/css" href="App.css"/>
	</head>
	<body>
		<Provider store={store}>
			<Router>
			<div><Link to="/shifts">Shifts</Link> | <Link to="/workers">Workers</Link> | <Link to="/schedule">Schedule</Link>
				
				<hr/>

				<Route exact path="/" render={()=>(<Redirect to="/schedule"/>)}/>
				<Route path="/schedule" render={()=>(<ConnectedSchedule />)}/>
				<Route path="/workers" render={()=>(<ConnectedWorkers />)}/>
				<Route path="/shifts" render={()=>(<ConnectedShifts />)}/>
			</div>
		</Router>
	</Provider>
	</body>
	</html>
)

export default SchedulingApp