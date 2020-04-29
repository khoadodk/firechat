import React, { Component } from "react";
import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";

import firebase from "../../firebase";

class UserPanel extends Component {
  dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Sign in as <strong>{this.props.currentUser.displayName}</strong>
        </span>
      ),
      disabled: true,
    },
    {
      key: "avatar",
      text: <span>Change avatar</span>,
    },
    {
      key: "signout",
      text: <span onClick={this.handleSignout}>Sign out</span>,
    },
  ];

  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log("Sign out!"));
  };

  render() {
    console.log(this.props.currentUser);
    const { displayName, photoURL } = this.props.currentUser;

    return (
      <Grid style={{ background: "#4c3c4c" }}>
        <Grid.Column>
          {/* App Header */}
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
            <Header inverted floated="left" as="h2">
              <Icon name="gripfire" />
            </Header>
          </Grid.Row>
          {/* User drop down */}
          <Header inverted style={{ padding: "0.25em" }} as="h4">
            <Dropdown
              trigger={
                <span>
                  <Image src={photoURL} spaced="right" avatar />
                  {displayName}
                </span>
              }
              options={this.dropdownOptions()}
            />
          </Header>
        </Grid.Column>
      </Grid>
    );
  }
}

export default UserPanel;
