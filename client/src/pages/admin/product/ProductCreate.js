import React, { useState, useEffect } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { createProduct } from '../../../functions/product';

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

    //redux
    const{ user } = useSelector((state) => ({ ...state }));

    //destructure
    const { 
        title, 
        description, 
        price, 
        categories, 
        category, 
        subs, 
        shipping, 
        quantity, 
        images, 
        colors, 
        brands, 
        color, 
        brand
        } = values;

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
            if (err.response.status === 400) toast.error(err.response.data);
        });
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value});
        //console.log(e.target.name, '-----', e.target.value);
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>

                <div className="col-md-10">
                    <h4>Product Create</h4>
                    <hr/>
                    {/* {JSON.stringify(values)} */}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title</label>
                            <input 
                                type="text" 
                                name="title" 
                                className="form-control" 
                                value={title} 
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <input 
                                type="text" 
                                name="description" 
                                className="form-control" 
                                value={description} 
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Price</label>
                            <input 
                                type="number" 
                                name="price" 
                                className="form-control" 
                                value={price} 
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Shipping</label>
                            <select name="shipping" className="form-control" onChange={handleChange}>
                                <option>Shipping?</option>
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Quantity</label>
                            <input 
                                type="number" 
                                name="quantity" 
                                className="form-control" 
                                value={quantity} 
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Color</label>
                            <select name="color" className="form-control" onChange={handleChange}>
                                <option>Select one</option>
                                {colors.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Brand</label>
                            <select name="brand" className="form-control" onChange={handleChange}>
                                <option>Select one</option>
                                {brands.map((b) => (
                                <option key={b} value={b}>
                                    {b}
                                </option>
                                ))}
                            </select>
                        </div>

                        <button className="bt btn-outline-info">Save</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductCreate;