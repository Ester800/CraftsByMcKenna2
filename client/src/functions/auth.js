import axios from 'axios';

export const createOrUpdateUser = async (authtoken) => {
    return await axios.post(
      `${process.env.REACT_APP_API}/create-or-update-user`,
      {},
      {
        headers: {
          authtoken: authtoken,
      },
    });
};

export const currentUser = async (authtoken) => {  // only the current user will have access to this route
    return await axios.post(
      `${process.env.REACT_APP_API}/current-user`,
      {},
      {
        headers: {
          authtoken: authtoken,
      },
    });
};

export const currentAdmin = async (authtoken) => {  // only the authorized admin will have access to this route
  return await axios.post(
    `${process.env.REACT_APP_API}/current-admin`,
    {},
    {
      headers: {
        authtoken: authtoken,
    },
  });
};