import Logo from "../images/brllogo.png";
import banner from "../images/Group 82.png";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";

import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useRef, useState } from "react";
import { Redirect } from "react-router-dom";

import { signin, authenticate, isAuthenticated } from "../helper/Auth";

const Signin = () => {
  const [values, setValues] = useState({
    rollNumber: "",
    password: "",
    error: "",
    loading: false,
    didRedirect: false,
  });

  const captchaRef = useRef(null)

  const { rollNumber, password, error, loading, didRedirect } = values;
  const token = isAuthenticated();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleChange = (name) => (event) => {
    document.getElementById("LoginUser").classList.remove("is-invalid");
    document.getElementById("LoginPass").classList.remove("is-invalid");
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const token = captchaRef.current.getValue();

    if(token) {
    // console.log("REcaptcha TOken: ", token);
    localStorage.setItem('kaerbanoerrewewe', token)
    captchaRef.current.reset();

    if (password === "" || rollNumber === "") {
      setValues({ ...values, error: false, loading: false });
      if (password === "")
        document.getElementById("LoginPass").classList.add("is-invalid");
      if (rollNumber === "")
        document.getElementById("LoginUser").classList.add("is-invalid");
    } else {
      setValues({ ...values, error: false, loading: true });
      signin({ rollNumber, password })
        .then((data) => {
          if (data.err) {
            setValues({ ...values, error: data.err, loading: false });
            handleShow();
          } else if (data.error) {
            setValues({ ...values, error: data.error, loading: false });
            handleShow();
          } else {
            authenticate(data, () => {
              localStorage.setItem("time", JSON.stringify(data.time));
              setValues({
                ...values,
                didRedirect: true,
              });
            });
          }
        })
        .catch((error) => {
          return error;
        });
      } 
    } else {
      alert("Please fill Recaptcha")
    }
  };

  const performRedirect = () => {
    if (didRedirect) {
      if (token) {
        return <Redirect to="/student" />;
      }
    }
    if (isAuthenticated()) {
      return <Redirect to="/student" />;
    }
  };

  const errorMessage = () => {
    return (
      <>
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Enter Details Carefully</Modal.Title>
          </Modal.Header>
          <Modal.Body>{error}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  const signInForm = () => {
    return (
      <div className="container-fluid main">
        <img src={Logo} alt="logo" className="logo" />
        <div className="card center">
          <div className="row p-5">
            <div className="col-md-6">
              <img
                src={banner}
                alt="banner"
                style={{ maxWidth: "-webkit-fill-available" }}
              />
            </div>
            <div className="col-md-6 d-flex align-items-center justify-content-center">
              <div>
                <form>
                  <h1 style={{ marginBottom: "2rem" }}>Login</h1>
                  <div className="form-group">
                    <input
                      type="number"
                      id="LoginUser"
                      className="form-control"
                      onChange={handleChange("rollNumber")}
                      value={rollNumber}
                      placeholder="Enter Roll Number"
                    />
                    <div className="invalid-feedback text-left" id="UserError">
                      Please Enter the Roll Number!
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      id="LoginPass"
                      className="form-control"
                      onChange={handleChange("password")}
                      value={password}
                      placeholder="Password"
                    />
                    <div className="invalid-feedback text-left" id="PassError">
                      Please Enter the Password!
                    </div>
                  </div>
                  <ReCAPTCHA 
                    sitekey="6LeiIzIqAAAAANU8ELR1lMwSHhQlUr2m2XUhGxPP"
                    ref={captchaRef} 
                  />
                  <div className="d-flex" style={{ marginTop: '0.6rem' }}>
                    <Link to="">
                      <i
                        className="fas fa-arrow-circle-left next fa-3x"
                        aria-hidden="true"
                        style={{ float: "left" }}
                      ></i>
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-primary ml-2"
                      style={{ float: "right", fontSize: "20px" }}
                      onClick={onSubmit}
                    >
                      {loading ? (
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
                        "Login"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {errorMessage()}
      {signInForm()}
      {performRedirect()}
    </>
  );
};

export default Signin;