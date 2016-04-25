import React from 'react';
import ReactDOM from 'react-dom';
import request from 'superagent';
import auth from './auth';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';

var MyPins = React.createClass({
	getInitialState(){
		return {
			pins: []
		}
	},
	componentDidMount(){
		var self = this;
		request
			.post('/api/getmypins')
			.send({
				token: auth.getToken()
			})
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
	newPinCallback(title, url, isUrlValid){
		var form = {
			title: title,
			token: auth.getToken()
		};
		if(!isUrlValid)
			form.url = 'http://placehold.it/200x200'
		else
			form.url = url;

		var self = this;

		request
			.post('/api/newpin')
			.send(form)
			.end(function(err, res){
				if(err) throw err;

				if(res.body.success)
					self.setState({
						pins: res.body.pins
					});

				document.getElementById('newPinForm').reset();
			});

	},
	newPin(event){
		event.preventDefault();
		var title = ReactDOM.findDOMNode(this.refs.title).value,
			url = ReactDOM.findDOMNode(this.refs.url).value;

		var self = this;
		var img = new Image();
		img.onerror = function(){self.newPinCallback(title, url, false)};
		img.onload = function(){self.newPinCallback(title, url, true)};
		img.src = url;
	},
	removePin(pin){
		var self = this;
		request
			.post('/api/removepin')
			.send({
				token: auth.getToken(),
				pin: pin
			})
			.end(function(err, res){
				if(err) throw err;

				if(res.body.success){
					self.setState({
						pins: res.body.pins
					});
				}
			});
	},
	eachPin(pin, i){
		return (
			<div className="grid-item" key={i}>
				<div className="box">
					<img src={pin.url} alt={pin.title} />
					<h4 className="text-center">{pin.title}</h4>
					<div className="overlay">
						<span className="glyphicon glyphicon-remove pinIcon" aria-hidden="true" onClick={this.removePin.bind(null, pin)}></span>
					</div>
				</div>
			</div>
		);
	},
	render(){
		return(
			<div className="container">
				<div className="row">
					<div className="col-xs-12">
						<h4>Add new Pin</h4>
						<form onSubmit={this.newPin} id="newPinForm">
							<div className="form-group">
							  <label>Title</label>
							  <input ref="title" type="text" className="form-control" placeholder="Enter pin title"/>
							</div>
							<div className="form-group">
								<label>Pin URL</label>
								<input ref="url" type="text" className="form-control" placeholder="Enter pin url" />
							</div>
							<input type="submit" value="ADD" className="btn btn-primary" />
						</form>

					</div>
				</div>
				
				<h3>My Pins</h3>

				{(this.state.pins.length === 0 ?
					<p className="alert alert-info">You currently do not have any pin.</p> : null
				)}

				{(this.state.pins.length !== 0 ?
					<p>Click the <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> to remove a pin.</p> : null
				)}

				<div className="grid">
  					<div className="grid-sizer"></div>
  					{this.state.pins.map(this.eachPin)}
				</div>

			</div>
		);
	}
})

module.exports = MyPins;