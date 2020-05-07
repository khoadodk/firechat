import React, { Component } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import firebase from "../../firebase";
import { setCurrentChannel, setPrivateChannel } from "../../actions";

class DirectMessages extends Component {
  state = {
    activeChannel: "",
    users: [],
    user: this.props.currentUser,
    usersRef: firebase.database().ref("users"),
    presenceRef: firebase.database().ref("presense"),
    // online presence checked by firebase
    connectedRef: firebase.database().ref(".info/connected"),
  };

  componentDidMount() {
    if (this.state.user) {
      this.addlisteners(this.state.user.uid);
    }
  }

  componentWillMount() {
    this.removeListeners();
  }

  removeListeners = () => {
    this.state.usersRef.off();
    this.state.presenceRef.off();
    this.state.connectedRef.off();
  };

  addlisteners = (currentUserUid) => {
    let loadedUsers = [];
    // 1. Find all users and set the properties uid and stastus to user obj
    this.state.usersRef.on("child_added", (snap) => {
      if (currentUserUid !== snap.key) {
        let user = snap.val();
        user["uid"] = snap.key;
        user["status"] = "offline";
        loadedUsers.push(user);
        this.setState({ users: loadedUsers });
      }
      // https://firebase.google.com/docs/database/web/offline-capabilities
      //2. Set the id of all "online" users to true in "presense" ref
      this.state.connectedRef.on("value", (snap) => {
        if (snap.val() === true) {
          const ref = this.state.presenceRef.child(currentUserUid);
          ref.set(true);
          ref.onDisconnect().remove((err) => {
            if (err !== null) {
              console.error(err);
            }
          });
        }
      });
    });
    // Listen to new users as they added to the presense ref
    this.state.presenceRef.on("child_added", (snap) => {
      if (currentUserUid !== snap.key) {
        this.addStatusToUser(snap.key);
      }
    });
    this.state.presenceRef.on("child_removed", (snap) => {
      if (currentUserUid !== snap.key) {
        this.addStatusToUser(snap.key, false);
      }
    });
  };

  addStatusToUser = (userId, connected = true) => {
    const updatedUsers = this.state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }
      return acc.concat(user);
    }, []);
    this.setState({ users: updatedUsers });
  };

  isUserOnline = (user) => user.status === "online";

  changeChannel = (user) => {
    console.log(user);
    const channelId = this.getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name,
    };
    this.props.setCurrentChannel(channelData);
    this.props.setPrivateChannel(true);
    this.setActiveChannel(user.uid);
  };
  // Create a private channel that is unique and opposite to the messaging user
  getChannelId = (userId) => {
    const currentUserId = this.state.user.uid;
    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  setActiveChannel = (userId) => {
    this.setState({ activeChannel: userId });
  };

  render() {
    const { users, activeChannel } = this.state;
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail" />
            DIRECT MESSAGE
          </span>{" "}
          ({users.length})
        </Menu.Item>
        {/* Users to send direct message to */}
        {users.map((user) => (
          <Menu.Item
            key={user.uid}
            onClick={() => this.changeChannel(user)}
            style={{ opacity: 0.7, fontStyle: "italic" }}
            active={user.uid === activeChannel}
          >
            <Icon
              name="circle"
              color={this.isUserOnline(user) ? "green" : "red"}
            />
            @ {user.name}
          </Menu.Item>
        ))}
      </Menu.Menu>
    );
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(
  DirectMessages
);
