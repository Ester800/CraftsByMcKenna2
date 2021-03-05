import axios from 'axios';


export const getSubCategories = async () => {
    return await axios.get(`${process.env.REACT_APP_API}/subCategories`);
};

export const getSubCategory = async (slug) => {
    return await axios.get(`${process.env.REACT_APP_API}/subCategory/${slug}`);
};

export const removeSubCategory = async (slug, authtoken) => {
    return await axios.delete(`${process.env.REACT_APP_API}/subCategory/${slug}`, {
        headers: {
            authtoken,
        },
    });
};

export const updateSubCategory = async (slug, subCategory, authtoken ) => {
    return await axios.put(`${process.env.REACT_APP_API}/subCategory/${slug}`, subCategory, {
        headers: {
            authtoken,
        },
    });
};

export const createSubCategory = async (subCategory, authtoken ) => {
    return await axios.post(`${process.env.REACT_APP_API}/subCategory`, subCategory, {
        headers: {
            authtoken,
        },
    });
};
