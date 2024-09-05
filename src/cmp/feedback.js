import React, { Component } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { submitFeedback } from "../helper/Test";
import { Redirect } from "react-router-dom";

export default class feedback extends Component {
  constructor(props) {
    super(props);

    localStorage.removeItem("data");
    localStorage.removeItem("index");
    localStorage.removeItem("questions");
    localStorage.removeItem("time");
    localStorage.removeItem("save");
    localStorage.removeItem("mark");
    this.state = {
      name: "",
      email: "",
      feedback: "",
      quality: "",
      loading: false,
      didRedirect: false,
    };
  }

  componentWillUnmount() {
    localStorage.removeItem("token");
  }
  onSubmit = (event) => {
    event.preventDefault();
    if (
      this.state.quality === "" ||
      this.state.feedback === "" ||
      this.state.name === "" ||
      this.state.email === ""
    ) {
      if (this.state.feedback === "") {
        this.setState((values) => {
          return {
            ...values,
            error: "Please Specify FeedBack!",
          };
        });
        document.getElementById("errorText").classList.add("d-block");
      }
      if (this.state.email === "") {
        this.setState((values) => {
          return {
            ...values,
            error: "Please Specify Email!",
          };
        });
        document.getElementById("errorText").classList.add("d-block");
      }
      if (this.state.name === "") {
        this.setState((values) => {
          return {
            ...values,
            error: "Please Specify Name!",
          };
        });
        document.getElementById("errorText").classList.add("d-block");
      }
      if (this.state.quality === "") {
        this.setState((values) => {
          return {
            ...values,
            error: "Please Specify Rating!",
          };
        });
        document.getElementById("errorText").classList.add("d-block");
      }
    } else {
      this.setState((values) => {
        return {
          ...values,
          loading: true,
        };
      });
      let states = this;
      submitFeedback({
        name: this.state.name,
        quality: this.state.quality,
        email: this.state.email,
        feedback: this.state.feedback,
      })
        .then((data) => {
          console.log("Success");
          states.setState((values) => {
            return {
              ...values,
              didRedirect: true,
            };
          });
          window.open("https://www.hackerrank.com/relaod-3-0");
        })
        .catch((error) => {
          return error;
        });
    }
  };

  performRedirect = () => {
    if (this.state.didRedirect) {
      return <Redirect to="/" />
    }
  };

  handleChange = (name) => (event) => {
    let data = event.target.value;
    document.getElementById("errorText").classList.remove("d-block");
    this.setState((values) => {
      return {
        ...values,
        [name]: data,
      };
    });
  };

  render() {
    return (
      <div className="container-fluid feedback">
        <div className="card center">
          <div className="row">
            <div className="col-12 mt-5 mb-2">
              <h1>FEEDBACK</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-12 mb-3">
              <p>
                We would love to hear your thoughts, concerns or problems with
                anything so we can improve !
              </p>
              <p>Take a moment to fill out this form.</p>
            </div>
          </div>
          <div className="row">
            <div className="col-12 mb-3">
              <h3>How Do You Rate Your Overall Experience ?</h3>
            </div>
          </div>
          <div className="row w-50 align-self-center mb-2">
            <div className="col-4">
              <input
                onChange={this.handleChange("quality")}
                type="radio"
                name="exp"
                value="Good"
              />{" "}
              Good
            </div>
            <div className="col-4">
              <input
                onChange={this.handleChange("quality")}
                type="radio"
                name="exp"
                value="Average"
              />{" "}
              Average
            </div>
            <div className="col-4">
              <input
                onChange={this.handleChange("quality")}
                type="radio"
                name="exp"
                value="Bad"
              />{" "}
              Bad
            </div>
          </div>
          <div className="row justify-content-center mb-5 mt-2">
            <form style={{ width: "50%" }}>
              <div className="form-group">
                <input
                  type="text"
                  id="Name"
                  className="form-control"
                  onChange={this.handleChange("name")}
                  value={this.state.name}
                  placeholder="Enter Your Name"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  id="Email"
                  className="form-control"
                  onChange={this.handleChange("email")}
                  value={this.state.email}
                  placeholder="Enter Your Email"
                />
              </div>
              <div className="form-group">
                <textarea
                  className="form-control"
                  rows="5"
                  id="Suggestion"
                  onChange={this.handleChange("feedback")}
                  value={this.state.feedback}
                  placeholder="Enter Your Suggestion"
                ></textarea>
                <div
                  className="invalid-feedback text-center pt-2"
                  id="errorText"
                >
                  {this.state.error}
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ fontSize: "20px" }}
                onClick={this.onSubmit}
              >
                {this.state.loading ? (
                  <>
                    <CircularProgress
                      color="light"
                      style={{
                        height: "1.75rem",
                        width: "1.75rem",
                        marginBottom: "-2px",
                      }}
                    />
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          </div>
        </div>
        {this.performRedirect()}
      </div>
    );
  }
}
