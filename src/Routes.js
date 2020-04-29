import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import firebase from "./firebase";
import { setUser } from "./actions";

import App from "./components/App";
import Spinner from "./components/Spinner";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import NotFound from "./components/NotFound";

class Routes extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // console.log("USER from FIREBASE", user);
        // console.log("ISLOADING", this.props.isLoading);
        this.props.setUser(user);
        this.props.history.push("/");
      }
    });
  }

  render() {
    return this.props.isLoading ? (
      <Spinner />
    ) : (
      <Switch>
        <Route exact path="/" component={App} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}

// Pass the loading from global state to props of this component
const mapStateToProps = (state) => {
  return { isLoading: state.user.isLoading };
};
export default withRouter(connect(mapStateToProps, { setUser })(Routes));
