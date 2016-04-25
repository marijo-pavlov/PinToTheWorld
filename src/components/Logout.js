import React from 'react';
import auth from './auth';
import request from 'superagent';

var Members = React.createClass({
	componentDidMount(){
		auth.logout();
		request
			.get('/api/logout')
			.end(function(err){
				if(err) throw err;
			});
	},
	render(){
		return(
			<div className="container">
				<div className="row">
					<div className="col-xs-12">
						<h2>You are now logged out. Thank you for using PinToTheWorld.</h2>
					</div>
				</div>
			</div>
		);
	}
})

module.exports = Members;