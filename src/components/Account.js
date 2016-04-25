import React from 'react';
import ReactDOM from 'react-dom';
import request from 'superagent';
import auth from './auth';

var Account = React.createClass({
	getInitialState(){
		return{
			errors: [],
			success: false,
			user: {}
		};
	},
	componentDidMount(){
		var self = this;
		request
			.post('/api/getinfo')
			.send({
				token: auth.getToken()
			}).end(function(err, res){
				if(err) throw err;

				self.setState({
					user: res.body.user
				})
			});
	},
	handleSubmit(event){
		event.preventDefault();

		var self = this;

		var form = {
			token: auth.getToken(),
			oldpassword: ReactDOM.findDOMNode(this.refs.oldpassword).value,
			newpassword: ReactDOM.findDOMNode(this.refs.newpassword).value,
			newpassword2: ReactDOM.findDOMNode(this.refs.newpassword2).value
		};

		request
			.post('/api/changepassword')
			.send(form)
			.end(function(err, res){
				if(err) throw err;
				if(res.body.success){
					self.setState({
						success: 'You have successfully changed password.',
						errors: []
					});
					
					document.getElementById('passwordForm').reset();
				}else{
					self.setState({
						success: false,
						errors: res.body.errors
					})
				}
			});
	},
	eachErrorDisplay(error, i){
		return (
				<div className="alert alert-danger" role="alert" key={i}>
				  <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
				   <span className="sr-only">Error:</span>
				   <span>{error.msg}</span>
				</div>
			);
	},
	changeInfo(event){
		event.preventDefault();

		var self = this;

		var form = {
			token: auth.getToken(),
			name: ReactDOM.findDOMNode(this.refs.newname).value,
			email: ReactDOM.findDOMNode(this.refs.newemail).value,
			username: ReactDOM.findDOMNode(this.refs.newusername).value
		};

		if(form.name || form.email || form.username){
			request
				.post('/api/changeinfo')
				.send(form)
				.end(function(err, res){
					if(err) throw err;
					if(res.body.success){
						self.setState({
							success: 'You have changed your info.',
							errors: [],
							user: res.body.user
						});

						document.getElementById('infoForm').reset();
					}else{
						self.setState({
							success: false,
							errors: res.body.errors
						})
					}
				});
		}else{
			var errors = [];
			errors.push({msg: 'You must fill at least one thing to change data.'});;
			this.setState({
				errors: errors,
				success: false
			})
		}
	},
	render(){
		return(
			<div className="container">
				<div className="row">
					<h2>Hello to your account settings.</h2>
					<h3>Here you can change them.</h3>
				</div>
				<ul className="errors">
			  		{this.state.errors.map(this.eachErrorDisplay)}
			  	</ul>
				{this.state.success && (
					<div className="alert alert-success" role="alert">
				   		<span>{this.state.success}</span>
					</div>
				)}

				<div className="row">
					<form onSubmit={this.changeInfo} id="infoForm">
						<h4>Change Info</h4>
				    	<div className="form-group">
					      <label>New Name</label>
					      <input ref="newname" type="text" placeholder={this.state.user.name} className="form-control"/>
					    </div>
				    	<div className="form-group">
					      <label>New Email</label>
					      <input ref="newemail" type="text" placeholder={this.state.user.email} className="form-control"/>
					    </div>
				    	<div className="form-group">
					      <label>New Username</label>
					      <input ref="newusername" type="text" placeholder={this.state.user.username} className="form-control"/>
					    </div>
					    <input name="submit" type="submit" value="Change Info" className="btn btn-default"/>
				  </form>
				</div>

				<div className="row">
					<form onSubmit={this.handleSubmit} id="passwordForm">
						<h4>Change Password</h4>
				    	<div className="form-group">
					      <label>Old Password</label>
					      <input ref="oldpassword" type="password" placeholder="Old Password" className="form-control" required/>
					    </div>
				    	<div className="form-group">
					      <label>New Password</label>
					      <input ref="newpassword" type="password" placeholder="New Password" className="form-control" required/>
					    </div>
				    	<div className="form-group">
					      <label>Repeat New Password</label>
					      <input ref="newpassword2" type="password" placeholder="Repeat New Password" className="form-control" required/>
					    </div>
					    <input name="submit" type="submit" value="Change Password" className="btn btn-default"/>
				  </form>
				</div>
			</div>
		);
	}
})

module.exports = Account;