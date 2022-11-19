import React, { Component } from "react";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import Modal from "react-modal";

import UsersList from "./components/UsersList";
import About from "./components/About";
import NavBar from "./components/NavBar";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import UserStatus from "./components/UserStatus";
import Message from "./components/Message";
import AddUser from "./components/AddUser";

const modalStyles = {
  content: {
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    border: 0,
    background: "transparent",
  },
};

Modal.setAppElement(document.getElementById("root"));

class App extends Component {
  constructor() {
    super();

    this.state = {
      users: [],
      title: "Gruezo.com",
      accessToken: null,
      messageType: null,
      messageText: null,
      showModal: false,
    };
  }

  componentDidMount() {
    this.getUsers();
  }

  addUser = (data) => {
    axios
      .post(`${process.env.REACT_APP_API_SERVICE_URL}/users`, data)
      .then((res) => {
        console.log(res);
        this.getUsers();
        this.setState({
          username: "",
          email: "",
        });
        this.handleCloseModal();
        this.createMessage("success", "User added");
      })
      .catch((err) => {
        console.log(err);
        this.handleCloseModal();
        this.createMessage("danger", "That user already exists.");
      });
  };

  getUsers = () => {
    axios
      .get(`${process.env.REACT_APP_API_SERVICE_URL}/users`)
      .then((res) => {
        this.setState({
          users: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleRegisterFormSubmit = (data) => {
    const url = `${process.env.REACT_APP_API_SERVICE_URL}/auth/register`;
    axios
      .post(url, data)
      .then((res) => {
        console.log(res.data);
        this.createMessage("success", "You have registered successfully.");
      })
      .catch((err) => {
        console.log(err);
        this.createMessage("danger", "That user already exists.");
      });
  };

  handleLoginFormSubmit = (data) => {
    const url = `${process.env.REACT_APP_API_SERVICE_URL}/auth/login`;
    axios
      .post(url, data)
      .then((res) => {
        console.log(res.data);
        this.setState({
          accessToken: res.data.access_token,
        });
        this.getUsers();
        window.localStorage.setItem("refreshToken", res.data.refresh_token);
        this.createMessage("success", "You have logged in successfully.");
      })
      .catch((err) => {
        console.log(err);
        this.createMessage("danger", "Incorrect email and/or password.");
      });
  };

  isAuthenticated = () => {
    if (this.state.accessToken || this.validRefresh()) {
      return true;
    }
    return false;
  };

  validRefresh = () => {
    const token = window.localStorage.getItem("refreshToken");
    if (token) {
      axios
        .post(`${process.env.REACT_APP_API_SERVICE_URL}/auth/refresh`, {
          refresh_token: token,
        })
        .then((res) => {
          this.setState({
            access_token: res.data.access_token,
          });
          this.getUsers();
          window.localStorage.setItem("refresh token", res.data.refresh_token);
          return true;
        })
        .catch((err) => {
          return false;
        });
    }
    return false;
  };

  logoutUser = () => {
    window.localStorage.removeItem("refreshToken");
    this.setState({
      accessToken: null,
    });
    this.createMessage("success", "You have logged out.");
  };

  createMessage = (type, text) => {
    this.setState({
      messageType: type,
      messageText: text,
    });
    setTimeout(() => {
      this.removeMessage();
    }, 3000);
  };

  removeMessage = () => {
    this.setState({
      messageType: null,
      messageText: null,
    });
  };

  handleOpenModal = () => {
    this.setState({
      showModal: true,
    });
  };

  handleCloseModal = () => {
    this.setState({
      showModal: false,
    });
  };

  removeUser = (user_id) => {
    axios
      .delete(`${process.env.REACT_APP_API_SERVICE_URL}/users/${user_id}`)
      .then((res) => {
        this.getUsers();
        this.createMessage("success", "User removed.");
      })
      .catch((err) => {
        console.log(err);
        this.createMessage("danger", "Something went wrong.");
      });
  };

  render() {
    return (
      <div>
        <NavBar
          title={this.state.title}
          logoutUser={this.logoutUser}
          isAuthenticated={this.isAuthenticated}
        />
        <section className="section">
          <div className="container">
            {this.state.messageType && this.state.messageText && (
              <Message
                messageType={this.state.messageType}
                messageText={this.state.messageText}
                removeMessage={this.removeMessage}
              />
            )}
            <div className="columns">
              <div className="column is-one-half">
                <br />
                <Routes>
                  <Route
                    exact
                    path="/"
                    element={
                      <div>
                        <h1 className="title is-1 is-1">Users</h1>
                        <hr />
                        <br />
                        {this.isAuthenticated() && (
                          <button
                            onClick={this.handleOpenModal}
                            className="button is-primary"
                          >
                            Add User
                          </button>
                        )}
                        <br />
                        <br />
                        <Modal
                          isOpen={this.state.showModal}
                          style={modalStyles}
                        >
                          <div className="modal is-active">
                            <div className="modal-background" />
                            <div className="modal-card">
                              <header className="modal-card-head">
                                <p className="modal-card-title">Add User</p>
                                <button
                                  className="delete"
                                  aria-label="close"
                                  onClick={this.handleCloseModal}
                                />
                              </header>
                              <section className="modal-card-body">
                                <AddUser addUser={this.addUser} />
                              </section>
                            </div>
                          </div>
                        </Modal>
                        <UsersList
                          users={this.state.users}
                          removeUser={this.removeUser}
                          isAuthenticated={this.isAuthenticated}
                        />
                      </div>
                    }
                  />
                  <Route exact path="/about" element={<About />} />
                  <Route
                    exact
                    path="/register"
                    element={
                      <RegisterForm
                        handleRegisterFormSubmit={this.handleRegisterFormSubmit}
                        isAuthenticated={this.isAuthenticated}
                      />
                    }
                  />
                  <Route
                    exact
                    path="/login"
                    element={
                      <LoginForm
                        handleLoginFormSubmit={this.handleLoginFormSubmit}
                        isAuthenticated={this.isAuthenticated}
                      />
                    }
                  />
                  <Route
                    exact
                    path="/status"
                    element={
                      <UserStatus
                        accessToken={this.state.accessToken}
                        isAuthenticated={this.isAuthenticated}
                      />
                    }
                  />
                </Routes>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
