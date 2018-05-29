import React, { Component } from 'react';
import RateForm from './RateForm';
const categories = ['Client', 'Restaurant', 'Deliverer'];

function sqlToJsDateTime(dateStr) {
  const a=dateStr.slice(0, -5).split("T");
  const d=a[0].split("-");
  const t=a[1].split(":");
  const formatedDate = new Date(d[0],(d[1]-1),d[2],t[0],t[1],t[2]);
  return formatedDate;
}

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: props.value.id,
      category: props.category,
      // clientId: props.value.clientId,
      time: sqlToJsDateTime(props.value.orderTime),
      price: props.value.totalPrice,
      rate: [props.value.rate0, props.value.rate1],
      // rateCD: props.value.rateCD,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]: value});
  }

  async handleSubmit(rater, ratee, rate) {
    try {
      const response = await fetch('/rate', {
        method: 'POST',
        body: JSON.stringify({
        orderId: this.state.orderId,
        rater: rater,
        ratee: ratee,
        rate: rate,
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
        <p>Order time: {this.state.time.toLocaleString()}</p>
        <p>Total price: £{this.state.price}</p>
        <RateForm name={categories[this.state.category]} rater={this.state.category} ratee={(this.state.category+1) % 3} rate={this.state.rate[0]} onSubmit={(rater, ratee, rate) => this.handleSubmit(rater, ratee, rate)} />
        <RateForm name={categories[this.state.category]} rater={this.state.category} ratee={(this.state.category+2) % 3} rate={this.state.rate[1]} onSubmit={(rater, ratee, rate) => this.handleSubmit(rater, ratee, rate)} />
      </div>
    );
  }
}

export default Order;
