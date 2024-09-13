import React, { useState, useEffect } from "react";
import NavBar from "./nav";
import { submitAnswer, cheatingCounter, endTest } from "../helper/Test";
import { Button, Modal } from "react-bootstrap";
// import Webcam from "react-webcam";


import CircularProgress from "@material-ui/core/CircularProgress";
const Questions = () => {
  const [time, setTime] = useState({
    hours: JSON.parse(localStorage.getItem("time")).hours,
    minutes: JSON.parse(localStorage.getItem("time")).minutes,
    seconds: JSON.parse(localStorage.getItem("time")).seconds,
  });

  const [values, setValues] = useState({
    data: JSON.parse(localStorage.getItem("questions")),
    id: JSON.parse(localStorage.getItem("questions"))[0]._id,
    option: NaN,
    save: JSON.parse(localStorage.getItem("save")),
    mark: JSON.parse(localStorage.getItem("mark")),
    index: 0,
    loading: false,
    // isCameraOne: false,
    error: "",
  });

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { hours, minutes, seconds } = time;
  const {
    data,
    index,
    error,
    loading,
    // isCameraOne,
    id,
    option,
    save,
    mark,
  } = values;

  const handleChange = (name) => (event) => {
    document.getElementById("errorText").classList.remove("d-block");
    localStorage.setItem("index", event.target.value);
    var question = JSON.parse(localStorage.getItem("questions"));
    var option = JSON.parse(localStorage.getItem("mark")).find(
      (item) => item.question === question[event.target.value]._id
    );
    if (option === undefined) {
      option = NaN;
    } else {
      option = option.response;
    }
    setValues({
      ...values,
      [name]: parseInt(event.target.value),
      id: question[event.target.value]._id,
      option: option,
    });
  };

  const onBlur = () => {
    if (hours !== 0 || minutes !== 0 || seconds !== 0) {
      cheatingCounter().then((result) => {
        setValues({
          ...values,
          error: "This is Not Allowed And Will Be Reported to Admin!",
        });
      });
      handleShow();
    }
  };


  useEffect(() => {
    if (hours === 0 && minutes === 0 && seconds === 0) {
      var filteredResponse = JSON.parse(localStorage.getItem("mark")).map(
        (item) => {
          return { question: item.question, response: item.response };
        }
      );
      endTest({ responses: filteredResponse })
        .then((data) => {
          console.log(data);
          if (data.err) {
            setValues({ ...values, error: data.err });
            handleShow();
          } else if (data.message) { // change data.message -> data.msg
            setValues({ ...values, error: data.msg});
            window.location.href = "./student/feedback";
          } else if (data.error) {
            setValues({ ...values, error: data.error });
            handleShow();
          } else {
            localStorage.removeItem("time");
            setValues({ ...values, end: true });
          }
        })
        .catch((error) => {
          return error;
        });
    }

    let timmer = setInterval(() => {
      if (seconds > 0) {
        setTime((time) => ({ ...time, seconds: time.seconds - 1 }));
        localStorage.setItem(
          "time",
          JSON.stringify({
            hours: hours,
            seconds: seconds,
            minutes: minutes,
          })
        );
      }
      if (seconds === 0) {
        if (minutes === 0) {
          if (hours === 0) {
            console.log("times up",values);
            setValues({ ...values, error: "Test Has Ended" });
            window.location.href = "./student/feedback";
          } else {
            setTime((time) => ({
              hours: time.hours - 1,
              minutes: 59,
              seconds: 59,
            }));
            localStorage.setItem(
              "time",
              JSON.stringify({
                hours: hours,
                seconds: seconds,
                minutes: minutes,
              })
            );
          }
        } else {
          setTime((time) => ({
            ...time,
            minutes: minutes - 1,
            seconds: 59,
          }));
          localStorage.setItem(
            "time",
            JSON.stringify({
              hours: hours,
              seconds: seconds,
              minutes: minutes,
            })
          );
        }
      }
    }, 1000);
    window.addEventListener("blur", onBlur);
    return function cleanup() {
      window.removeEventListener("blur", onBlur);
      clearInterval(timmer);
    };
  }, [hours, minutes, seconds]);

  const submit = () => {
    if (isNaN(option)) {
      setValues({ ...values, error: "Please Select Any Option!" });
      document.getElementById("errorText").classList.add("d-block");
    } else {
      setValues({ ...values, error: false, loading: true });
      let res = { question: id, response: parseInt(option) };
      submitAnswer(res)
        .then((data) => {
          if (data.err) {
            setValues({ ...values, error: data.err, loading: false });
            handleShow();
          } else if (data.error) {
            setValues({ ...values, error: data.error, loading: false });
            handleShow();
          } else if (data.message) {
            setValues({ ...values, error: data.message });
            window.location.href = "./student/feedback";
          } else {
            var arr = save.slice();
            var foundIndex = save.findIndex((x) => x.question === id);
            if (foundIndex === -1) {
              res.index = index;
              arr.push(res);
            } else {
              arr[foundIndex].response = parseInt(option);
            }
            localStorage.setItem("save", JSON.stringify(arr));
            setValues({
              ...values,
              loading: false,
              save: arr,
            });
            var button = document.getElementById("next");
            console.log(button.value);
            console.log(index);
            button.click();
          }
        })
        .catch((err) => console.log(err));
    }
  };
  const selectOption = (event) => {
    // if (isCameraOne === false) {
    //   console.log("some");
    //   setValues({ ...values, error: "Please Turn On Camera!" });
    //   document.getElementById("errorText").classList.add("d-block");
    // } else {
    let setOption = event.target.value;
    var arr = mark.slice();
    var foundIndex = mark.findIndex((x) => x.question === id);
    if (foundIndex === -1) {
      arr.push({ question: id, response: parseInt(setOption), index: index });
    } else {
      arr[foundIndex].response = parseInt(setOption);
    }
    localStorage.setItem("mark", JSON.stringify(arr));
    setValues((values) => ({
      ...values,
      mark: arr,
      option: setOption,
    }));
    // }
  };

  const questionClass = (num) => {
    let names = ["col-2", "btn", "rounded-circle", "text-center", "m-2"];
    var markIndex = mark.findIndex((x) => x.index === num);
    var saveIndex = save.findIndex((x) => x.index === num);
    if (index === num) names.push("btn-info");
    else if (saveIndex !== -1) names.push("btn-success");
    else if (markIndex !== -1) names.push("btn-warning");
    else names.push("btn-light");
    return names.join(" ");
  };

  const displayQuestion = (j) => {
    const options = [];
    for (const [i, value] of data[j].options.entries()) {
      options.push(
        <li className="py-md-1" key={i}>
          {" "}
          <input
            className="mx-3"
            type="radio"
            name={`option${id}`}
            value={i + 1}
            onChange={selectOption}
            key={i}
            checked={parseInt(option) === i + 1}
          />
          {value}
        </li>
      );
    }

    
    const matchPattern = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
    var isImage = matchPattern.test(data[j].question);

    // if isImage is true then display image
    if (isImage) {
      return (
        <div className="col-md-12">
          <h5 className="py-md-3">
            {index + 1}. &nbsp;
          </h5>
          <img style={{ display: "inline-block", min_width:"65%", marginLeft:"48px" }} className="py-md-3" src={data[j].question} alt="question" />
          <input type="text" className="d-none" value={id} readonly />
          <ul style={{ listStyle: "none" }}>{options}</ul>
        </div>
      );
    } else {
      return (
        <div className="col-md-12">
          <h5 style={{ display: "inline-block" }} className="py-md-3">
            {index + 1}. &nbsp;
            {data[j].question}
          </h5>
          <input type="text" className="d-none" value={id} readonly />
          <ul style={{ listStyle: "none" }}>{options}</ul>
        </div>
      );
    }
  };

  const errorMessage = () => {
    return (
      <>
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Test Portal</Modal.Title>
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

  const unmark = () => {
    // var saveIndex = save.findIndex((x) => x.index === index);
    // if (saveIndex !== -1) {
    //   setValues({ ...values, error: "Can Not Unmark Saved Response!" });
    //   document.getElementById("errorText").classList.add("d-block");
    // } else {
    var arr = mark.slice();
    var temp = arr.filter((item) => item.index !== index);
    localStorage.setItem("mark", JSON.stringify(temp));
    setValues((values) => ({
      ...values,
      mark: temp,
      option: NaN,
    }));
    // }
  };

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
  //     .catch((err) => console.log("Error But Y? " + err));
  // }, []);

  const questionPaper = () => {
    return (
      <>
        <div className="col-md-8 mx-4 p-5 component">
          <div className="row" style={{ height: "100vh" }}>
            {displayQuestion(index)}
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="invalid-feedback text-center" id="errorText">
                {error}
              </div>
            </div>
            <div className="col-md-8" style={{ textAlign: "-webkit-right" }}>
              {/* {index === 0 ? null : (
                <button
                  className="btn btn-primary m-1"
                  value={index - 1}
                  onClick={handleChange("index")}
                >
                  {" "}
                  Previous{" "}
                </button>
              )} */}
              <button className="btn btn-primary m-1" onClick={unmark}>
                Unmark
              </button>
              <button className="btn btn-primary m-1" onClick={submit}>
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
                  "Submit Answer"
                )}
              </button>
              {index === data.length - 1 ? null : (
                <button
                  className="btn btn-primary m-1 d-none"
                  id="next"
                  value={index + 1}
                  onClick={handleChange("index")}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-3 m-auto">
          <div className="row component mb-4">
            <div className="col-md-12 text-center display-3 my-2">
              <span id="clock">
                {hours}:{minutes < 10 ? `0${minutes}` : minutes}:
                {seconds < 10 ? `0${seconds}` : seconds}
              </span>
            </div>
          </div>
          <div
            className="row justify-content-center py-2"
            style={{
              borderRadius: "30px",
              // boxShadow: "0 4px 8px 0 #fff, 0 6px 20px 0 #000",
              boxShadow: "rgb(100 100 111 / 37%) 0px 7px 29px 0px",
              backgroundColor: "white",
              flexFlow: "row wrap",
            }}
          >
            {data.map((value, i) => {
              return (
                <button
                  className={"" + questionClass(i)}
                  value={i}
                  style={{ lineHeight: "2rem" }}
                  onClick={handleChange("index")}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {errorMessage()}
      <section className="student" style={{ height: "100vh", margin: "0" }}>
        <div>
          <NavBar />
          <div
            className="container-fluid"
            style={{ height: "70vh", padding: " 0 2rem", marginTop: "3vh" }}
          >
            <div className="row h-100">{questionPaper()}</div>
            {/* <Webcam id="cam" style={{ display: "none" }} /> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Questions;     
