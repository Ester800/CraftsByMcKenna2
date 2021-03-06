import React, { useState, useEffect } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { createProduct } from '../../../functions/product';
import ProductCreateForm from '../../../components/forms/ProductCreateForm';
import { getCategories, getCategorySubs } from '../../../functions/category';

const initialState = {
    title: 'The Letter A',
    description: '2 x 2',
    price: '7',
    categories: [],
    category: '',
    subs: [],
    shipping: 'Yes',
    quantity: '100',
    images: [],
    colors: ["Gold Flakes", "Colored dots", "Silver Flakes", "White", "Blue"],
    brands: ["Keychain", "Lips", "Star"],
    color: 'Gold Flakes',
    brand: 'Keychain',
}


const ProductCreate = () => {
const [values, setValues] = useState(initialState);
const [subOptions, setSubOptions] = useState([]);
const [showSub, setShowSub] = useState(false);

    //redux
    const{ user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () => 
        getCategories().then(c => setValues({ ...values, categories: c.data }));

    const handleSubmit = (e) => {
        e.preventDefault();
        createProduct(values, user.token)
        .then(res => {
            //console.log(res);
            window.alert(`"${res.data.title}" has been created`);
            window.location.reload();  // reloads the page with empty fields!
        })
        .catch(err => {
            console.log(err);
            //if (err.response.status === 400) toast.error(err.response.data);
            toast.error(err.response.data.err);
        });
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value});
        //console.log(e.target.name, '-----', e.target.value);
    }

    const handleCategoryChange = (e) => {
        e.preventDefault();
        console.log('CLICKED CATEGORY', e.target.value);
        setValues({ ...values, subs: [], category: e.target.value});
        getCategorySubs(e.target.value)
        .then(res => {
            console.log('SUB OPTIONS ON CATEGORY CLICK', res);
            setSubOptions(res.data);
        });
        setShowSub(true);

    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>

                <div className="col-md-10">
                    <h4>Product Create</h4>
                    <br/>

                    <ProductCreateForm 
                    handleSubmit={handleSubmit} 
                    handleChange={handleChange} 
                    setValues={setValues}
                    values={values}
                    handleCategoryChange={handleCategoryChange}
                    subOptions={subOptions}
                    showSub={showSub}
                    />
                    
                </div>
            </div>
        </div>
    );
};

export default ProductCreate;