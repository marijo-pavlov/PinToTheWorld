import React from 'react';
import {render} from 'react-dom';
import {Router, Route, Link, browserHistory} from 'react-router';
import MainLayout from './components/MainLayout';
import Home from './components/Home';
import Recent from './components/Recent';
import Logout from './components/Logout';
import Account from './components/Account';
import MyPins from './components/MyPins';
import auth from './components/auth';

function requireAuth(nextState, replace){
	if(!auth.loggedIn()){
		replace({
			pathname: '/login',
			state: {
				nextPathName: nextState.location.pathname
			}
		})
	}
}

render(
	<Router history={browserHistory}>
		<Route component={MainLayout}>
			<Route path="/" component={Home} />
			<Route path="/recent" component={Recent} />
			<Route path="/logout" component={Logout} />
			<Route path="/account" component={Account} onEnter={requireAuth}/>
			<Route path="/mypins" component={MyPins} onEnter={requireAuth}/>
		</Route>
	</Router>, 
	document.getElementById('react-container')
);