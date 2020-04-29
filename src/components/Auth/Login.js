import React, { Component } from "react";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";

class Login extends Component {
  state = {
    email: "",
    password: "",
    errors: [],
    loading: false,
  };

  displayErrors = (errors) =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((signInUser) => {
          console.log(signInUser);
        })
        .catch((err) => {
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err),
          });
        });
    }
  };

  isFormValid = ({ email, password }) => email && password;
  handleInputErrors = (errors, inputName) => {
    return errors.some((error) =>
      error.message.toLowerCase().includes(inputName)
    )
      ? "error"
      : "";
  };

  render() {
    const { password, email, errors, loading } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="violet" textAlign="center">
            <Icon name="rocketchat" color="green" />
            Log in with Fire Chat
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                icon="mail"
                iconPosition="left"
                name="email"
                placeholder="Email"
                value={email}
                onChange={this.handleChange}
                className={this.handleInputErrors(errors, "email")}
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={this.handleChange}
                className={this.handleInputErrors(errors, "password")}
              />
              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                fluid
                color="violet"
                size="large"
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>
            Don't have an account with us?{" "}
            <Link to="/register">Register here</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
