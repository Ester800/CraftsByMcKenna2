import React, { useState, useEffect } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { createCategory, getCategories, removeCategory } from '../../../functions/category';
import { Link } from 'react-router-dom';
//import EditOutLined from '@ant-design/icons';  // not sure why this isn't working!
//import DeleteOutLined from '@ant-design/icons';  // not sure why this isn't working!
import CategoryForm from '../../../components/forms/CategoryForm';
import LocalSearch from '../../../components/forms/LocalSearch';
// import { Menu } from 'antd'; // not sure why this isn't working!


//const { SubMenu, Item } = Menu;  // possibly need to make anticons work!?

const CategoryCreate = ({ history }) => {
    const { user } = useSelector((state) => ({ ...state }));
    
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    // searching/filtering
    // step 1 - add in the state
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () => 
        getCategories().then(c => setCategories(c.data));

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(name);
        setLoading(true);
        createCategory({ name }, user.token)
        .then(res => {
            console.log(res);
            setLoading(false);
            setName('');
            toast.success(`'${res.data.name}' is created`);
            loadCategories();
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
            removeCategory(slug, user.token)
            .then(res => {
                setLoading(false);
                toast.error(`${res.data.name} deleted`);
                loadCategories();
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
                        <h4>Create Category</h4>
                    )}
                    
                        <CategoryForm handleSubmit={handleSubmit} name={name} setName={setName} />

                        <LocalSearch keyword={keyword} setKeyword={setKeyword}/>
                        {/* - Step 2 */}
                        {/* create input field where users can type their search query */}
                        

                    <hr />
                    {/* step 5 - insert the search function into the mapping of the categories */}
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
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryCreate;