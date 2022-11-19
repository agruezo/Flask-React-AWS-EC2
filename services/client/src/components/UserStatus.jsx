import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";

class UserStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
    };
  }
  componentDidMount() {
    this.getUserStatus();
  }
  getUserStatus(event) {
    const options = {
      url: `${process.env.REACT_APP_API_SERVICE_URL}/auth/status`,
      method: "get",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${this.props.accessToken}`,
      },
    };
    return axios(options)
      .then((res) => {
        console.log(res.data);
        this.setState({
          email: res.data.email,
          username: res.data.username,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    if (!this.props.isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    return (
      <div>
        <ul>
          <li>
            <strong>Email: </strong>
            <span data-testid="user-email">{this.state.email}</span>
          </li>
          <li>
            <strong>Username: </strong>
            <span data-testid="user-username">{this.state.username}</span>
          </li>
        </ul>
      </div>
    );
  }
}

UserStatus.propTypes = {
  accessToken: PropTypes.string,
  isAuthenticated: PropTypes.func.isRequired,
};

export default UserStatus;
