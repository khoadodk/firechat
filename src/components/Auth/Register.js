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
import md5 from "md5";

import firebase from "../../firebase";

class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    errors: [],
    loading: false,
    // ref to the 'users' collection in firestore db
    usersRef: firebase.database().ref("users"),
  };

  isFormValid = () => {
    let errors = [];
    let error;
    if (this.isFormEmpty(this.state)) {
      error = { message: "Fill in all fields" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: "Password is invalid" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      return true;
    }
  };

  isFormEmpty = ({ username, email, password, confirmPassword }) => {
    return (
      !username.length || !email.length || !password.length || !confirmPassword
    );
  };

  isPasswordValid = ({ password, confirmPassword }) => {
    if (password.length < 6 || confirmPassword.length < 6) {
      return false;
    } else if (password !== confirmPassword) {
      return false;
    } else {
      return true;
    }
  };

  displayErrors = (errors) =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((createdUser) => {
          console.log(createdUser);
          //Update the user authentication info
          createdUser.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`,
            })
            // Store user info into db
            .then(() =>
              this.saveUser(createdUser).then(() => {
                console.log("user saved");
              })
            )
            .catch((err) => {
              console.error(err);
              this.setState({
                errors: this.state.errors.concat(err),
                loading: false,
              });
            });
        })
        .then(() => this.setState({ loading: false }))
        .catch((err) => {
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err),
          });
        });
    }
  };

  // save the user in the realtime db
  saveUser = (createdUser) => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
    });
  };

  handleInputErrors = (errors, inputName) => {
    return errors.some((error) =>
      error.message.toLowerCase().includes(inputName)
    )
      ? "error"
      : "";
  };

  render() {
    const {
      username,
      password,
      email,
      confirmPassword,
      errors,
      loading,
    } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="orange" textAlign="center">
            <Icon name="rocketchat" color="green" />
            Register for Fire Chat
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                name="username"
                placeholder="Username"
                value={username}
                onChange={this.handleChange}
              />
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
              <Form.Input
                fluid
                icon="repeat"
                iconPosition="left"
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={this.handleChange}
                className={this.handleInputErrors(errors, "password")}
              />
              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                fluid
                color="orange"
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
            Already register? <Link to="/login">Log in</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
