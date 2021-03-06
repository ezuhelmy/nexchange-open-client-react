import React, { Component } from 'react';
import axios from 'axios';
import config from '../config';

class Notifications extends Component {
	constructor(props) {
		super();
		this.state = {
			value: '',
			message: {
				text: '',
				error: false
			},
			show: false
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		axios({
				method: 'get',
				contentType : 'application/json',
				url: `${config.API_BASE_URL}/users/me/orders/${this.props.order.unique_reference}`,
				headers: {'Authorization': 'Bearer ' + localStorage.token}
			})
			.then(data => {
				this.setState({ show: true });
			})
			.catch(error => {
				this.setState({ show: false });
			});
	}

	handleChange(event) {
		this.setState({
		  value: event.target.value
		});
	}

	handleSubmit(event) {
		event.preventDefault();

		axios({
				method: 'put',
				contentType : 'application/json',
				url: `${config.API_BASE_URL}/users/me/`,
				data: {email: this.state.value},
				headers: {'Authorization': 'Bearer ' + localStorage.token}
			})
			.then(data => {
				this.setState({
					message: {
						text: 'Success, you set your email.',
						error: false
					}
				});
			})
			.catch(error => {
				if (error.response.status === 401) {
					this.setState({
						message: {
							text: 'You do not have access to get notifications for this order.',
							error: true
						}
					});
				} else {
					this.setState({
						message: {
							text: 'Something went wrong. Try again later.',
							error: true
						}
					});
				}
			});
	}

	render() {
		if (this.state.show === false) {
			return null;
		}

		return (
		    <div id="notifications" className="col-xs-12">
		    	<div className="box">
		    		<div className="row">
		    			<div className="col-xs-12">
							<h2>Get notified about your order!</h2>
				
							<div className="row">
								<div className="col-xs-12 col-md-8 col-md-push-2">
									<form onSubmit={this.handleSubmit}>
										<h4 className={this.state.message.error ? 'text-danger' : 'text-green'}>
											{this.state.message.text}
										</h4>

										<div className="form-group">
											<input
												type="email"
												name="email" 
												placeholder="Email"
												className="form-control"
												onChange={this.handleChange}
												value={this.state.value}
												required
											/>
											<span className="material-input"></span>
										</div>

										<button type="submit" className="btn btn-themed btn-lg">Receive notifications</button>
									</form>
								</div>
							</div>
		    			</div>
		    		</div>
		    	</div>
		    </div> 
		);
	}
}

export default Notifications;
