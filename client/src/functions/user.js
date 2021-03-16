import axios from 'axios';
import axois from 'axios';

export const userCart = async (cart, authtoken) => 
    await axios.post(
        `${process.env.REACT_APP_API}/user/cart`, 
        { cart }, 
        {
        headers: {
            authtoken,
            },
        }
    );


