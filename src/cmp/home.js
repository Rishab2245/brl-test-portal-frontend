import React, { Component } from "react";
import logo from "../images/brllogo.png";
import footer1 from "../images/Mask Group 4.png";
import footer2 from "../images/Mask Group 5.png";
import banner from "../images/Group 72.svg";
import { Link } from "react-router-dom";

export default class Home extends Component {
  render() {
    return (
      <div>
        <div>
          <img
            src={logo}
            alt="logo"
            className="img-fluid pl-4 logo float-left"
          />
          <img
            src={banner}
            alt="banner"
            className="img-fluid pl-4 banner float-right"
          />
          <div className="box">
            <p className="text mb-5">
              {" "}
              Blockchain
              <br /> Research Lab
              <br /> Test Portal{" "}
            </p>
            <div className="row">
              <Link to="/signin">
                <div className="col">
                  <button type="button" className="btn btn-primary">
                    Login
                  </button>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <footer>
          <img
            src={footer1}
            alt="footer-img1"
            className="img-fluid mg-4"
          />
          <img
            src={footer2}
            alt="footer-img2"
            className="img-fluid float-right mg-5"
          />
        </footer>
      </div>
    );
  }
}
