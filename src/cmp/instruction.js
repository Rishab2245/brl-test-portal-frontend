import CircularProgress from "@material-ui/core/CircularProgress";
import NavBar from "./nav";
import React, { useState, useEffect } from "react";
import test from '../images/test.png'
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../helper/Auth";
import { getQuestions } from "../helper/Test";
// import Webcam from "react-webcam";

const Instruction = () => {
  const [values, setValues] = useState({
    hours: JSON.parse(localStorage.getItem("time")).hours,
    minutes: JSON.parse(localStorage.getItem("time")).minutes,
    seconds: JSON.parse(localStorage.getItem("time")).seconds,
    didRedirect: false,
    loading: false,
    // isCameraOne: false,
    error: "",
    // lang: "c",
  });

  const {
    hours,
    minutes,
    seconds,
    // isCameraOne,
    didRedirect,
    loading,
    error,
    // lang,
  } = values;
  const token = isAuthenticated();

  const handleRedirect = async (event) => {
    // if (isCameraOne === false) {
    //   setValues({ ...values, error: "Please Turn On Camera!" });
    //   document.getElementById("errorText").classList.add("d-block");
    // } else {
    setValues({ ...values, error: false, loading: true });
    // console.log("Selected Domains", selectedDomains[0], selectedDomains[1]);
    if (selectedDomains.length === 1) {
      localStorage.setItem("domain1", selectedDomains[0])
    }
    if (selectedDomains.length === 2) {
      localStorage.setItem("domain1", selectedDomains[0])
      localStorage.setItem("domain2", selectedDomains[1])
    }

    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }

    getQuestions() //lang
      .then((res) => {
        if (res.res_questions) {
          localStorage.setItem(
            "questions",
            JSON.stringify(res.res_questions)
          );
          var time = JSON.parse(localStorage.getItem("time"));
          time.minutes = res.time.minutes;
          if (res.time.seconds < 3) {
            time.seconds = res.time.seconds;
          } else {
            time.seconds = res.time.seconds - 3;
          }
          localStorage.setItem("time", JSON.stringify(time));
          localStorage.setItem("save", JSON.stringify([]));
          localStorage.setItem("mark", JSON.stringify([]));
          setValues((values) => ({
            ...values,
            loading: false,
            didRedirect: true,
          }));
        } else if (res.msg) {
          setValues((values) => ({
            ...values,
            loading: false,
            error: res.msg,
          }));
          document.getElementById("errorText").classList.add("d-block");
        } else {
          setValues({ ...values, error: res.message });
          document.getElementById("errorText").classList.add("d-block");
        }
      })
      .catch((err) => console.log(err));
    // }
  };

  const performRedirect = () => {
    if (didRedirect === true && loading === false) {
      if (token) {
        return <Redirect to="/student/questions" />;
      }
    }
    if (localStorage.getItem("questions")) {
      return <Redirect to="/student/questions" />;
    }
    if (!isAuthenticated() || error === "Token is not valid") {
      // console.log("Instruction Token" + isAuthenticated());
      localStorage.removeItem("token");
      return <Redirect to="/" />;
    }
  };

  // function DomainSelector() {
    const [selectedDomains, setSelectedDomains] = useState([]);
  
    const handleCheckboxChange = (event) => {
      const { value } = event.target;
  
      if (event.target.checked && selectedDomains.length < 2) {
        setSelectedDomains([...selectedDomains, value]);
      } else {
        const updatedSelectedDomains = selectedDomains.filter(
          (domain) => domain !== value
        );
        setSelectedDomains(updatedSelectedDomains);
      }
    };

  // const change = (event) => {
  //   var val = event.target.value;
  //   setValues((values) => ({
  //     ...values,
  //     lang: val,
  //   }));
  // };

  // useEffect(() => {
  //   navigator.mediaDevices
  //     .getUserMedia({
  //       video: {
  //         height: 200,
  //         width: 300,
  //       },
  //       audio: false,
  //     })
  //     .then((stream) => {
  //       setValues((values) => ({
  //         ...values,
  //         isCameraOne: true,
  //       }));
  //       document.getElementById("cam").srcObject = stream;
  //     })
  //     .catch((err) => console.log("Error But Y?" + err));
  // }, []);

  const information = () => {
    return (
      <div className="student">
        <div>
          <NavBar />
          <div
            className="container-fluid"
            style={{ height: "75vh", padding: " 0 2rem", marginTop: "2vh" }}
          >
            <div className="row h-100">
              <div
                className="col-md-8 mx-4 p-5"
                style={{
                  borderRadius: "30px",
                  // boxShadow: "0 4px 8px 0 #fff, 0 6px 20px 0 #000",
                  boxShadow: "rgb(100 100 111 / 37%) 0px 7px 29px 0px",
                }}
              >
                <h1 style={{ "text-align": "center", "marginBottom": "40px" }} >Instructions</h1>
                <ol type='1'>
                  <li>
                    The test will start at <b>4:30 PM.</b> You will lose your time if you login late.
                  </li>
                  <li><b>Do Not</b> try to switch to another tab or else you will be logged out from the test losing all your submitted answers or might result in cancellation of your candidature.</li>
                  <li>Be careful while submitting answer, option once marked can be updated during the test but it cannot be unmarked!</li>
                  {/* <li>
                    After the completion of this MCQ Round, you will be directed to the <b>Coding Round</b> which will be conducted on <b>HackerRank</b> platform.
                  </li> */}
                  {/* <li>
                    Colour of the question buttons denote: <br> <b>Green</b> Question has been attempted and submitted. </br> <b> Yellow </b> Question has been attempted but not submitted.
                  </li> */}
                  <li>Colour of the question buttons denote: <br /><b>Green</b> Question has been attempted and submitted. <b> Yellow </b> Question has been attempted but not submitted.
                  </li>

                </ol>
                <h5 className="text-center">Test Details</h5>
                <table>
                <tr>
                  <th>Category</th>
                  <th>No. of Questions</th>
                  <th>Marks Rewarded</th>
                  <th>Negative Marking</th>
                </tr>
                <tr>
                  <td>HTML / CSS</td>
                  <td>5</td>
                  <td>+4</td>
                  <td>-0.25</td>
                </tr>
                <tr>
                  <td>Aptitude</td>
                  <td>10</td>
                  <td>+4</td>
                  <td>-0.25</td>
                </tr>
                <tr>
                  <td>C Programming</td>
                  <td>7</td>
                  <td>+4</td>
                  <td>-0.25</td>
                </tr>
                <tr>
                  <td>AIML</td>
                  <td>2</td>
                  <td>+4</td>
                  <td>-0.25</td>
                </tr>
                <tr>
                  <td>Networking</td>
                  <td>3</td>
                  <td>+4</td>
                  <td>-0.25</td>
                </tr>
                <tr>
                  <td>Blockchain</td>
                  <td>3</td>
                  <td>+4</td>
                  <td>-0.25</td>
                </tr>
                <tr>
                  <td>Bonus Questions <br />Frontend |  Backend | Machine Learning | Application Development | Designing</td>
                  <td>5 questions per domain</td>
                  <td>+5</td>
                  <td>-1</td>
                </tr>
              </table>
              </div>
              <div
                className="col-md-3 justify-content-center align-items-center"
                style={{
                  borderRadius: "30px",
                  backgroundColor: "white",
                  // boxShadow: "0 4px 8px 0 #fff, 0 6px 20px 0 #000",
                  boxShadow: "rgb(100 100 111 / 37%) 0px 7px 29px 0px",
                  flexFlow: "row wrap",
                  margin: "auto",
                }}
              >
                <div className="row h-20">
                  <div className="col-md-12 my-3 text-center display-3">
                    <span id="clock" style={{ fontSize: '3.5rem' }}>
                      {/* {hours}:{minutes < 10 ? `0${minutes}` : minutes}:
                      {seconds < 10 ? `0${seconds}` : seconds} */}
                      1:00:00
                    </span>
                  </div>
                </div>
                <div className="row col-12 my-4 justify-content-center">
                  <img src={test} alt="" height='130' width='150' />
                </div>
                {/* <div className="row">
                  <div className="col-12">
                    <Webcam id="cam" style={{ width: "inherit" }} />
                  </div>
                </div>
                <div className="row">
                  <div
                    className="col-md-12 mt-2"
                    style={{ textAlign: "-webkit-center" }}
                  >
                    <div className="form-group w-50">
                      <label htmlFor="lang">Select Language:</label>
                      <select
                        className="form-control"
                        id="lang"
                        value={lang}
                        onChange={change}
                      >
                        <option value="c">C</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                      </select>
                    </div>
                  </div>
                </div> */}
                <div className="row">
                  <p className="col-md-12 mb-3 text-center">Select Maximum Two Domains <strong>(Optional)</strong></p>
                  <div style={{ display: 'flex', gap: '1rem', marginLeft: '1.6rem' }} className="col-md-12 mb-2">
                    <div>
                      <input
                        type="checkbox"
                        name="domain"
                        value="frontend"
                        checked={selectedDomains.includes('frontend')}
                        onChange={handleCheckboxChange}
                        disabled={selectedDomains.length === 2 && !selectedDomains.includes('frontend')}
                      />
                      <label htmlFor="frontend" style={{ marginLeft: '0.4rem' }}>Frontend Development</label>
                    </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginLeft: '1.6rem' }} className="col-md-12 mb-2 text-center">
                    <div>
                      <input
                        type="checkbox"
                        name="domain"
                        value="backend"
                        checked={selectedDomains.includes('backend')}
                        onChange={handleCheckboxChange}
                        disabled={selectedDomains.length === 2 && !selectedDomains.includes('backend')}
                      />
                      <label htmlFor="backend" style={{ marginLeft: '0.4rem' }}>Backend Development</label>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginLeft: '1.6rem' }} className="col-md-12 mb-2 text-center">
                    <div>
                      <input
                        type="checkbox"
                        name="domain"
                        value="ML"
                        checked={selectedDomains.includes('ML')}
                        onChange={handleCheckboxChange}
                        disabled={selectedDomains.length === 2 && !selectedDomains.includes('ML')}
                      />
                      <label htmlFor="ml" style={{ marginLeft: '0.4rem' }}>Machine Learning</label>
                    </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginLeft: '1.6rem' }} className="col-md-12 mb-2 text-center">
                    <div>
                      <input
                        type="checkbox"
                        name="domain"
                        value="App"
                        checked={selectedDomains.includes('App')}
                        onChange={handleCheckboxChange}
                        disabled={selectedDomains.length === 2 && !selectedDomains.includes('App')}
                      />
                      <label htmlFor="app" style={{ marginLeft: '0.4rem' }}>Application Development</label>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginLeft: '1.6rem' }} className="col-md-12 mb-2 text-center">
                    <div>
                      <input
                        type="checkbox"
                        name="domain"
                        value="Designing"
                        checked={selectedDomains.includes('Designing')}
                        onChange={handleCheckboxChange}
                        disabled={selectedDomains.length === 2 && !selectedDomains.includes('Designing')}
                      />
                      <label htmlFor="design" style={{ marginLeft: '0.4rem' }}>Designing</label>
                    </div>
                  </div>

                </div>

                <div className="row" style={{ marginTop: '0.4rem' }}>
                  <div className="col-md-12 mb-2  text-center">
                    <button
                      className="btn btn-primary"
                      onClick={handleRedirect}
                    >
                      {loading ? (
                        <>
                          <CircularProgress
                            color="light"
                            style={{
                              height: "1rem",
                              width: "1rem",
                              marginBottom: "-2px",
                            }}
                          />
                        </>
                      ) : (
                        "Start Test"
                      )}
                    </button>
                  </div>
                </div>
                <div className="row">
                  <div
                    className="col-md-12 mb-5"
                    style={{ textAlign: "-webkit-center" }}
                  >
                    <div
                      className="invalid-feedback text-center"
                      id="errorText"
                    >
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {information()}
      {performRedirect()}
    </>
  );
};

export default Instruction;
