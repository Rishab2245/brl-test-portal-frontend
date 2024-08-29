import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import StudentRoute from "./routes/StudentRoute";
import Login from "./cmp/login";
import Home from "./cmp/home";
import Instruction from "./cmp/instruction";
import Questions from "./cmp/questions";
import Feedback from "./cmp/feedback";

export default class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/mobile">
            <h1>Not For Mobile</h1>
          </Route>
          <Route path="/signin" component={Login} />
          <StudentRoute path="/student/questions" component={Questions} />
          <StudentRoute path="/student/feedback" component={Feedback} />
          <StudentRoute path="/student" component={Instruction} />
          <Route path="/" component={Home} />
          <Route path="*">
            <h1>Not Found</h1>
          </Route>
        </Switch>
      </Router>
    );
  }
}
