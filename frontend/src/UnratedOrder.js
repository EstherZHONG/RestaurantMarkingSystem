import React, { Component } from 'react';

class UnratedOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: props.value.id,
      clientId: props.value.clientId,
      time: props.value.orderTime,
      price: props.value.totalPrice,
      rateCR: props.value.rateCR,
      ratedCR: props.value.rateCR !== null,
      rateCD: props.value.rateCD,
      ratedCD: props.value.rateCD !== null,
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
          rateCR: this.state.rateCR,
          rateCD: this.state.rateCD,
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
    let RateFormCR;
    if (this.state.ratedCR) {
      RateFormCR = <p>Restaurant Rate: {this.state.rateCR}</p>;
    } else {
      RateFormCR = 
      <form onSubmit={this.handleSubmit}>
        <label>
          Rate Restaurant:
          <input type="text" name="rateCR" value={this.state.rateCR || ''} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>;
    }
    let RateFormCD;
    if (this.state.ratedCD) {
      RateFormCD = <p>Deliverer Rate: {this.state.ratedCD}</p>;
    } else {
      RateFormCD = 
      <form onSubmit={this.handleSubmit}>
        <label>
          Rate Deliverer:
          <input type="text" name="rateCD" value={this.state.rateCD || ''} onChange={this.handleChange} />
        </label>

        <input type="submit" value="Submit" />
      </form>;
    }
    return (
      <div>
        <p>Order time: {this.state.time}</p>
        <p>Total price: £{this.state.price}</p>
        {RateFormCR}
        {RateFormCD}
      </div>
    );
  }
}

export default UnratedOrder;
