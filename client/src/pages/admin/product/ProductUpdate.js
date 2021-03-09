import React, { useState, useEffect } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getProduct, updateProduct } from '../../../functions/product';
import { getCategories, getCategorySubs } from '../../../functions/category';
import FileUpload from '../../../components/forms/FileUpload';
import { LoadingOutlined } from '@ant-design/icons';
import ProductUpdateForm from '../../../components/forms/ProductUpdateForm';


const initialState = {
    title: '',
    description: '',
    price: '',
    category: '',
    subs: [],
    shipping: '',
    quantity: '',
    images: [],
    colors: ["Gold Flakes", "Colored dots", "Silver Flakes", "White", "Blue"],
    brands: ["Keychain", "Lips", "Star"],
    color: '',
    brand: '',
}
const ProductUpdate = ({ match, history }) => {
    // state
    const [values, setValues] = useState(initialState);
    const [categories, setCategories] = useState([]);
    const [subOptions, setSubOptions] = useState([]);
    const [arrayOfSubs, setArrayOfSubs] = useState([]);
    const [ selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(false);
    
    //redux
    const{ user } = useSelector((state) => ({ ...state }));

    // router
    const { slug } = match.params;

    useEffect(() => {
        loadProduct();
        loadCategories();
    }, []);

    const loadProduct = () => {
        getProduct(slug)
        .then((p) => {
            //console.log('single product', p);

            // 1 load single product
            setValues({ ...values, ...p.data });
            // 2 load single product sub categories
            getCategorySubs(p.data.category._id)
            .then((res) => {
                setSubOptions(res.data);  // on first load, show default subs
            });
            // 3 prepare of array of sub ids to showas default sub values in antd Select
            let arr = [];
            p.data.subs.map((s) => {
                arr.push(s._id);
            });
            console.log("ARR", arr);
            setArrayOfSubs((prev) => arr);  // this is required for antd Select to work
        });
    };

    const loadCategories = () => 
        getCategories().then((c) => {
            setCategories(c.data);
        });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        values.subs = arrayOfSubs;
        values.category = selectedCategory ? selectedCategory : values.category;

        updateProduct(slug, values, user.token)
        .then((res) => {
            setLoading(false);
            toast.success(`"${res.data.title}" is updated`);
            history.push('/admin/products');
        })
        .catch((err) => {
            console.log(err);
            setLoading(false);
            toast.error(err.response.data.err);
        });
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    };

    const handleCategoryChange = (e) => {
        e.preventDefault();
        console.log('CLICKED CATEGORY', e.target.value);
        setValues({ ...values, subs: [] });

        setSelectedCategory(e.target.value);

        getCategorySubs(e.target.value)
        .then(res => {
            console.log('SUB OPTIONS ON CATEGORY CLICK', res);
            setSubOptions(res.data);
        });
        
        console.log('EXISTING CATEGORY', values.category);

        // if user clicks back to the original category, show its original categories in default
        if(values.category._id === e.target.value) {
            loadProduct();
        }

        // clear subcategories before offering new subcategories
        setArrayOfSubs([]);
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>

                <div className="col-md-10">
                    {loading ? (
                        <LoadingOutlined className="text-danger h1" />
                    ) : (
                        <h4>Product Update</h4>
                    )}
                

                {/* {JSON.stringify(values)} */}
                {/* above give us a look at the data, allows us to confirm we've captured what we need */}

                <div className="p-3">
                        <FileUpload 
                        values={values} 
                        setValues={setValues} 
                        setLoading={setLoading}
                        />
                    </div>

                <ProductUpdateForm 
                    handleSubmit = {handleSubmit}
                    handleChange = {handleChange}
                    setValues = {setValues}
                    values = {values}
                    handleCategoryChange = {handleCategoryChange}
                    categories={categories}
                    subOptions={subOptions}
                    arrayOfSubs={arrayOfSubs}
                    setArrayOfSubs={setArrayOfSubs}
                    selectedCategory={selectedCategory}
                />
                
                <hr />
                </div>
            </div>
        </div>
    );
};

export default ProductUpdate;