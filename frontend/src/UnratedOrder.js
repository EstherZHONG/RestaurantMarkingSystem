import React, { Component } from 'react';

// function Message(props) {
//   const message = props.message;
//   if (message !== '') {
//     return(<p> {message} </p>);
//   }
//   return null;
// }

class UnratedOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: props.value.id,
      clientId: props.value.clientId,
      time: props.value.orderTime,
      price: props.value.totalPrice,
      rate: null,
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
    event.preventDefault();
    try {
      const response = await fetch('/rate', {
        method: 'POST',
        body: JSON.stringify({
          orderId: this.state.orderId,
          rateCR: this.state.rate,
        }),
        credentials: 'include',
        headers: new Headers({
          'Content-Type': 'application/json',
        })
      });
      if (response.status === 204) {
        // const body = await response.json();
        this.props.onRedirect('', '', 'index');
      } else if (response.status === 400) {
        const body = await response.json();
        alert(body.message);
      }
    } catch(err) {
      console.log(err);
    }
  }

  render() {
    return (
      <div>
        <p>Order time: {this.state.time}</p>
        <p>Total price: £{this.state.price}</p>
        <form onSubmit={this.handleSubmit}>
          <label>
            Rate:
            <input type="text" name="rate" value={this.state.rate || ''} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default UnratedOrder;
