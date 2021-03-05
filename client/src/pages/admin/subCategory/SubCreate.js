import React, { useState, useEffect } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getCategories } from '../../../functions/category';
import { createSubCategory, getSubCategories, removeSubCategory } from '../../../functions/subCategory';
import { Link } from 'react-router-dom';
import EditOutLined from '@ant-design/icons';
import DeleteOutLined from '@ant-design/icons';
import CategoryForm from '../../../components/forms/CategoryForm';
import LocalSearch from '../../../components/forms/LocalSearch';
import { Menu } from 'antd';


const { SubMenu, Item } = Menu;

const SubCategoryCreate = ({ history }) => {
    const { user } = useSelector((state) => ({ ...state }));
    
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);  // list of categories that are displayed in the select option
    const [category, setCategory] = useState('');  // this is the category the user has clicked

    // searching/filtering
    // step 1 - add in the state
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () => getCategories().then(c => setCategories(c.data));

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(name);
        setLoading(true);
        createSubCategory({ name, parent: category }, user.token)
        .then(res => {
            console.log(res);
            setLoading(false);
            setName('');
            toast.success(`'${res.data.name}' is created`);
        })
        .catch(err => {
            console.log(err)
            setLoading(false);
            if(err.response.status === 400) toast.error(err.response.data);
        });
        //history.push('/admin/products');
    };

    const handleRemove = async (slug) => {
        // let answer = window.confirm('Delete Category?')
        // console.log(answer, slug);
        if(window.confirm('Delete Category?')) {
            setLoading(true);
            removeSubCategory(slug, user.token)
            .then(res => {
                setLoading(false);
                toast.error(`${res.data.name} deleted`);
            })
            .catch(err => {
                if(err.response.status === 400) {
                    setLoading(false);
                    toast.error(err.response.data);
                };
            });
        }
    };

    

    // step 4 - 
    const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col">
                    { loading ? (
                        <h4 className="text-danger">Loading...</h4>
                    ) : (
                        <h4>Create Sub Category</h4>
                    )}

                    <div className="form-group">
                        <label>Parent Category</label>
                        <select 
                        name="category" 
                        className="form-control" 
                        onChange={e => setCategory(e.target.value)}
                        >
                            <option>select a Categoy</option>
                            {categories.length > 0 && 
                            categories.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                                ))} 
                        </select>

                    </div>

                    {/* {JSON.stringify(category)} */}
                    
                        <CategoryForm handleSubmit={handleSubmit} name={name} setName={setName} />

                        <LocalSearch keyword={keyword} setKeyword={setKeyword}/>
                        {/* - Step 2 */}
                        {/* create input field where users can type their search query */}
                        

                    <hr />
                    {/* step 5 - insert the search function into the mapping of the categories
                    {categories.filter(searched(keyword)).map((c) => (
                    <div className="alert alert-secondary" key={c._id}>
                        {c.name}
                        
                        <span onClick={() => handleRemove(c.slug) } className="btn btn-sm float-right">
                            delete
                        </span>
                        
                        <Link to={`/admin/category/${c.slug}`}> 
                        <span className="btn btn-sm float-right">
                            edit
                        </span>
                        </Link>
                    </div>
                    ))} */}
                </div>
            </div>
        </div>
    );
};

export default SubCategoryCreate;