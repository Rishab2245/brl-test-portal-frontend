import { isAuthenticated } from "./Auth";

// export const getQuestions = (lang) => {
//   const token = isAuthenticated();
//   return fetch(
//     `https://branch-gracy.onrender.com/student/get-questions?choice1=designing&choice2=ml`,
//     {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         authorization: "Bearer " + token,
//       },
//     }
//   )
//     .then((response) => {
//       return response.json();
//     })
//     .catch((err) => err);
// };

export const getQuestions = (lang) => {
  const token = isAuthenticated();
  let apiURL = `https://reload24.mohitbharti.live/student/get-questions`;

  // Check if "domain1" is available in localStorage
  const domain1 = localStorage.getItem('domain1');
  if (domain1) {
    apiURL += `?choice1=${domain1}`;
    
    // Check if "domain2" is available in localStorage
    const domain2 = localStorage.getItem('domain2');
    if (domain2) {
      apiURL += `&choice2=${domain2}`;
    }
  }

  return fetch(apiURL, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: "Bearer " + token,
    },
  })
    .then((response) => {
      // if (response.status === 502) {
      //   alert("Server Unavailable! Please try again after few minutes");
      // }
      return response.json();
    })
    .catch((err) => err);
};

export const submitAnswer = (res) => {
  const token = isAuthenticated();
  return fetch(`https://reload24.mohitbharti.live/student/submit-responses`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: "Bearer " + token,
    },  
    body: JSON.stringify({ responses: [res] }),
  })
    .then((response) => {
      // if (response.status === 502) {
      //   alert("Server Unavailable! Please try again after few minutes");
      // }
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const submitFeedback = (res) => {
  const token = isAuthenticated(); 
  return fetch(`https://reload24.mohitbharti.live/student/submit-feedback`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: "Bearer " + token,
    },
    body: JSON.stringify(res),
  })
    .then((response) => {
      // if (response.status === 502) {
      //   alert("Server Unavailable! Please try again after few minutes");
      // }
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const endTest = (res) => {
  const token = isAuthenticated();
  return fetch(`https://reload24.mohitbharti.live/student/end-test`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: "Bearer " + token,
    },
    body: JSON.stringify(res),
  })
    .then((response) => {
      // if (response.status === 502) {
      //   alert("Server Unavailable! Please try again after few minutes");
      // }
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const cheatingCounter = () => {
  const token = isAuthenticated();
  return fetch(`https://reload24.mohitbharti.live/student/unfairAttempt`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: "Bearer " + token,
    },
  })
    .then((response) => {
      // if (response.status === 502) {
      //   alert("Server Unavailable! Please try again after few minutes");
      // }
      return response.json();
    })
    .catch((err) => console.log(err));
};
