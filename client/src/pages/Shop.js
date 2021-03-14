import React, { useState, useEffect } from 'react';
import { getProductsByCount, fetchProductsByfilter } from '../functions/product';
import { getCategories } from '../functions/category';
import { useSelector, useDispatch } from 'react-redux';
import ProductCard from '../components/cards/ProductCard';
import { Menu, Slider, Checkbox } from 'antd';
import { DollarOutlined, DownSquareOutlined } from '@ant-design/icons';


const { SubMenu, ItemGroup } = Menu; 

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState([0, 0]);  // useState has starting value of $0 and ending value of $) as default
    const [ok, setOk] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoryIds, setCategoryIds] = useState([]);   // for use in side bar!

    let dispatch = useDispatch();
    let { search } = useSelector((state) => ({ ...state }));
    const { text } = search;

    useEffect(() => {
        loadAllProducts();
        // fetch categories
        getCategories().then(res => setCategories(res.data));
    }, []);

    const fetchProducts = (arg) => {
        fetchProductsByfilter(arg).then((res) => {
            setProducts(res.data);
        });
    }

    // 1.  load products by default on page load
    const loadAllProducts = () => {
        getProductsByCount(12).then((p) => {
            setProducts(p.data);
            setLoading(false);
        });
    };

    // 2.  load products based on user search input 
    useEffect(() => {
        //console.log('load products based on user search input', text)
        const delayed = setTimeout(() => {
            fetchProducts({ query: text});
        }, 300)  // here we delay the req to give the user time to finalize their decision, thereby limiting the number of requests we send to the back end
        return () => clearTimeout(delayed);
    }, [text]);

    // 3. load products based on price range
    useEffect(() => {
        //console.log('ok to request');
        fetchProducts({ price });
    }, [ok]);

    const handleSlider = (value) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: ''},
        });
        setCategoryIds([]);
        setPrice(value);
        setTimeout(() => {
            setOk(!ok)    // this toggles Timeout
        }, 300);
    };

    // 4. load products based on category
    // show categories in a list of checkboxes
    const showCategories = () => categories.map((c) => (
        <div key={c._id}>
            <Checkbox 
            onChange={handleCheck} 
            className="pt-2 pb-2 pl-4 pr-4" 
            value={c._id} 
            name="category"
            //checked={categoryIds.includes(c._id)}
            >
                {c.name}
            </Checkbox>
            <br />
        </div>
    ));

    // handleCheck for categories
    const handleCheck = e => {
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: ''},
        });
        setPrice([0, 0]);
        //console.log(e.target.value);
        let inTheState = [ ...categoryIds ];
        let justChecked = e.target.value;
        let foundInTheState = inTheState.indexOf(justChecked);  // gives us either: index or -1

        // indexOf method ?? if not found returns -1 else return index [1, 2, 3]
        if(foundInTheState === -1) {    // this means it was not found in the current state!
            inTheState.push(justChecked);
        } else {
            // if found, pull out the item from index
            inTheState.splice(foundInTheState, 1);
        };
        // with the above, we have eliminated any duplicates
        setCategoryIds(inTheState);
        //console.log(inTheState);
        fetchProducts({ category: inTheState });
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3 pt-3">
                    <h4>Search/filter</h4>
                    <hr />

                    <Menu defaultOpenKeys={['1', '2']} mode="inline">

                        {/* Price */}
                        <SubMenu 
                            key='1' 
                            title={
                                <span classname="h6">
                                    <DollarOutlined /> price
                                </span>
                            }
                        >
                            <div>
                                <Slider 
                                    className="ml-4 mr-4" 
                                    tipFormatter={(v) => `$${v}`} 
                                    range 
                                    value={price} 
                                    onChange={handleSlider} 
                                    max='500'
                                />
                            </div>
                        </SubMenu>

                        {/* category */}
                        <SubMenu 
                            key='2' 
                            title={
                                <span classname="h6">
                                    <DownSquareOutlined /> Categories
                                </span>
                            }
                        >
                            <div>
                                {showCategories()}
                            </div>
                        </SubMenu>
                    </Menu>
                </div>

                <div className="col-md-9 pt-3">
                    {loading ? (
                        <h4 className="text-danger">Loading...</h4>
                    ) : (
                        <h4 className="text-danger">Products</h4>
                    )}

                    {products.length < 1 && <p>No products found</p>}

                    <div className="row pb-5">
                        {products.map((p) => (
                            <div key={p._id} className="col-md-4 mt-3">
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    )
};

export default Shop;




