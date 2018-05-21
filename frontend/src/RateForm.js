import React, { Component } from 'react';

class RateForm extends Component {
  constructor(props) {
    const categories = ['Client', 'Restaurant', 'Deliverer'];
    super(props);
    this.state = {
      rated: props.rate !== null,
      rate: props.rate,
      name: categories[props.ratee],
      rater: props.rater,
      ratee: props.ratee,
    }
    // alert(Number.parseInt(props.rater));
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSubmit = props.onSubmit;
  }
  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]: value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.onSubmit(this.state.rater, this.state.ratee, this.state.rate);
  }

  render() {
    if (this.state.rated) {
      return (<p>{this.state.name} Rate: {this.state.rate}</p>);
    } else {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Rate {this.state.name}:
            <input type="text" name="rate" value={this.state.rate || ''} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      );
    }
  }

}

export default RateForm;