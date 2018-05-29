import React, { Component } from 'react';
import LoginForm from './LoginForm';
import Orders from './Orders';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    id: '',
    category: '',
    page: '',
    // response: '',
  };

  handleRedirect(id, category, page) {
    this.setState({
      id: id,
      category: category,
      page: page,
    });
  }

  async componentWillUpdate() {
    try {
      await this.getUser();
      // const res = await this.getUser();
      // this.setState({ response: res.express });
    } catch(err) {
      console.log(err);
    }
  }

  async componentDidMount() {
    try {
      await this.getUser();
      // const res = await this.getUser();
      // this.setState({ response: res.express });
    } catch(err) {
      console.log(err);
    }
  }

  async getUser() {
    const response = await fetch('/user', {
        method: 'GET',
        // headers: new Headers({
        //   'credentials': 'include'
        // })
        credentials: 'include',
      });
    // const response = await fetch('/user');
    if (response.status === 200) {
      const body = await response.json();
      if (this.state.id !== body.id 
        || this.state.category !== body.category
        || this.state.page !== 'index'
      ) {
        this.setState({
          id: body.id,
          category: body.category,
          page: 'index',
        });
      }
      
      // this.state.id = body.id;
      // this.state.category = body.category;
    } else if (this.state.id !== '' 
        || this.state.category !== ''
        || this.state.page !== 'login'
    ) {
      this.setState({
        id: '',
        category: '',
        page: 'login',
        // response: body.message
      });
      // this.state.id = '';
      // this.state.category = '';
    }
    // if (response.status !== 200) throw Error(body.message);

    // return body;
  }

  async handleLogout() {
    await fetch('/logout', {
        method: 'GET',
        credentials: 'include',
      });
    this.setState({
      id: '',
      category: '',
      page: 'login',
    });
  }

  render() {
    if (this.state.page === '' || this.state.page === 'login') {
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro"></p>
          <LoginForm onLogin={(id, category, page) => this.handleRedirect(id, category, page)}/>         
        </div>
      );
    } else if (this.state.page === 'index' && this.state.category !== '') {
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">{this.state.id}</p>
          <Orders onRedirect={(id, category, page) => this.handleRedirect(id, category, page)}/>
          <button onClick={() => this.handleLogout()}> logout </button>
        </div>
      );
    } else if (this.state.page === 'RESTAURANT' && this.state.category === 'CLIENT') {
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">restaurant</p>
          <button onClick={() => this.handleLogout()}> logout </button>
        </div>
      );
    } else {
      return null;
    }
  }
}
export default App;
