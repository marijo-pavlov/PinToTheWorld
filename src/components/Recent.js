import React from 'react';
import request from 'superagent';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';

var Recent = React.createClass({
	getInitialState(){
		return {
			pins: []
		}
	},
	componentDidMount(){
		var self = this;
		request
			.get('/api/getpins')
			.end(function(err, res){
				if(err) throw err;

				if(res.body.success){
					self.setState({
						pins: res.body.pins
					});
				}
			});

		var grid = document.querySelector('.grid');
		var msnry;

		imagesLoaded( grid, function() {
		  msnry = new Masonry( grid, {
		    itemSelector: '.grid-item',
		    columnWidth: '.grid-sizer',
		    percentPosition: true
		  });
		});

	},
	eachPin(pin, i){
		return (
			<div className="grid-item" key={i}>
				<div className="box">
					<img src={pin.url} alt={pin.title} />
					<h4 className="text-center">{pin.title}</h4>
				</div>
			</div>
		);
	},
	render(){
		return(
			<div className="container">
				<h3>Recent Pins</h3>

				{(this.state.pins.length === 0 ?
					<p className="alert alert-info">There are currently no pins.</p> : null
				)}

				<div className="grid">
  					<div className="grid-sizer"></div>
  					{this.state.pins.map(this.eachPin)}
				</div>
			</div>
		);
	}
})

module.exports = Recent;