import React from 'react';

var Home = React.createClass({
	render(){
		return(
			<div className="jumbotron homebg">
				<div className="container">
				  <h1>Hello to PinToTheWorld!</h1>
				  <p>PinToTheWorld is a service for exchanging pins.</p>
			  	</div>
			</div>
		);
	}
})

module.exports = Home;