export const signup = (user) => {
  return fetch(`https://reload-24-backend-new.onrender.com/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

// export const signin = (user, recaptchaToken) => {
//   const requestBody = {
//     ...user,
//     recaptcha: recaptchaToken,
//   };
//   return fetch(`https://reload-test-backend.brlakgec.com/login`, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(user),
//   })
//     .then((response) => {
//       return response.json();
//     })
//     .catch((err) => console.log(err));
// };
export const signin = (user) => {
  const recaptchaToken = localStorage.getItem("kaerbanoerrewewe");
  // (console.log(localStorage.getItem("kaerbanoerrewewe")));
  localStorage.removeItem("kaerbanoerrewewe")
  const requestBody = {
    ...user,
    recaptcha: recaptchaToken,
  };

  return fetch(`https://reload-24-backend-new.onrender.com/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      // if (response.status === 502) {
      //   alert("Server Unavailable! Please try again after few minutes");
      // }
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const authenticate = (data, next) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", data.token);
    next();
  }
};

export const signout = (next) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    next();

    return fetch(`https://reload-24-backend-new.onrender.com/logout`, {
      method: "GET",
    })
      .then((response) => console.log("logout success"))
      .catch((err) => console.log(err));
  }
};

export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("token")) {
    return localStorage.getItem("token");
  } else { 
    return false;
  } 
};