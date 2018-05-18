import React, { Component } from 'react';

function Message(props) {
  const message = props.message;
  if (message !== '') {
    return(<p> {message} </p>);
  }
  return null;
}

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      message: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]: value});
  }

  async handleSubmit(event) {
    // alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
    try {
      const response = await fetch('/login', {
        method: 'POST',
        body: JSON.stringify({
          name: this.state.username,
          password: this.state.password,
        }),
        credentials: 'include',
        headers: new Headers({
          'Content-Type': 'application/json',
          // 'credentials': 'include'
        })
      });
      if (response.status === 200) {
        const body = await response.json();
        this.props.onLogin(body.id, body.category, 'index');
      } else if (response.status === 400) {
        const body = await response.json();
        this.setState({
          username: '',
          password: '',
          message: body.message,
        });
      }
    } catch(err) {
      // const body = await err.json();
      // this.setState({
      //   username: '',
      //   password: '',
      //   message: err.message,
      // });
      console.log(err);
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          User Name:
          <input type="text" name="username" value={this.state.username} onChange={this.handleChange} />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
        </label>
        <Message message={this.state.message} />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default LoginForm;
