import React, { useState, useEffect } from 'react';
import { getProductsByCount, fetchProductsByfilter } from '../functions/product';
import { getCategories } from '../functions/category';
import { getSubs } from '../functions/sub';
import { useSelector, useDispatch } from 'react-redux';
import ProductCard from '../components/cards/ProductCard';
import { Menu, Slider, Checkbox, Radio } from 'antd';
import { DollarOutlined, DownSquareOutlined, StarOutlined } from '@ant-design/icons';
import Star from '../components/forms/Star';


const { SubMenu } = Menu; 

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState([0, 0]);  // useState has starting value of $0 and ending value of $) as default
    const [ok, setOk] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoryIds, setCategoryIds] = useState([]);   // for use in side bar!
    const [star, setStar] = useState('');
    const [subs, setSubs] = useState([]);
    const [sub, setSub] = useState('');
    const [brands, setBrands] = useState([
        "McKenna", 
        "McKay", 
        "Stephanie", 
        "Karmen", 
        "Becky"
    ]);
    const [brand, setBrand] = useState('');
    const [colors, setColors] = useState([
        "Gold Flakes", 
        "Colored dots", 
        "Silver Flakes", 
        "White", 
        "Blue"
    ]);
    const [color, setColor] = useState('');
    const [shipping, setShipping] = useState('');

    let dispatch = useDispatch();
    let { search } = useSelector((state) => ({ ...state }));
    const { text } = search;

    useEffect(() => {
        loadAllProducts();
        // fetch categories
        getCategories().then(res => setCategories(res.data));
        // fetch subs
        getSubs().then((res) => setSubs(res.data));
    }, []);

    const fetchProducts = (arg) => {
        fetchProductsByfilter(arg).then((res) => {
            setProducts(res.data);
        });
    };

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
            if(!text) {
                loadAllProducts();
            }
            fetchProducts({ query: text});
        }, 300);  // here we delay the req to give the user time to finalize their decision, thereby limiting the number of requests we send to the back end
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

        // reset categories
        setCategoryIds([]);
        setPrice(value);
        setStar('');
        setBrand('');
        setColor('');
        setShipping('');
        setTimeout(() => {
            setOk(!ok)    // this toggles Timeout
        }, 300);
    };

    // 4. load products based on category!
    // show categories in a list of checkboxes
    const showCategories = () => 
        categories.map((c) => (
            <div key={c._id}>
                <Checkbox 
                onChange={handleCheck} 
                className="pt-2 pb-2 pl-4 pr-4" 
                value={c._id} 
                name="category"
                checked={categoryIds.includes(c._id)}
                >
                    {c.name}
                </Checkbox>
                <br />
            </div>
    ));

    // handleCheck for categories
    const handleCheck = (e) => {
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: ''},
        });

        // reset 
        setPrice([0, 0]);
        setStar('');
        setSub('');
        setBrand('');
        setColor('');
        setShipping('');
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

    // 5. show products by star rating!
    const handleStarClick = (num) => {
        //console.log(num);
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: ''},
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar(num);
        setSub('');
        setBrand('');
        setColor('');
        setShipping('');
        fetchProducts({ stars: num });
    };

    const showStars = () => 
        <div className='pr-4 pl-4 pb-6 pt-2'>
            <Star starClick={handleStarClick} numberOfStars = {5} /><br/>
            <Star starClick={handleStarClick} numberOfStars = {4} /><br/>
            <Star starClick={handleStarClick} numberOfStars = {3} /><br/>
            <Star starClick={handleStarClick} numberOfStars = {2} /><br/>
            <Star starClick={handleStarClick} numberOfStars = {1} /><br/>
        </div>;

    // 6. show products by sub category
    const showSubs = () => 
        subs.map((s) => (
        <div
            key={s._id}
            onClick={() => handleSubs(s)} 
             className='p-1 m-1 badge badge-secondary' 
             style={{ cursor: 'pointer' }}
        >
            {s.name}
        </div>
        ));

    const handleSubs = (sub) => {
        console.log('SUB', sub);
        setSub(sub)
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: ''},
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar([]);
        setBrand('');
        setColor('');
        setShipping('');
        fetchProducts({ sub: sub });
    };

    // 7.  show products based on brand
    
    const showBrands = () => 
        brands.map((b) => (
            <Radio 
            value={b} 
            name={b} 
            checked={b === brand} 
            onChange={handleBrand} 
            className="pb-1 pl-4 pr-5" 
        >
                {b}
            </Radio>
        ));
        
    const handleBrand = (e) => {
         setSub('')
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: ''},
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar([]);
        setColor('');
        setShipping('');
        setBrand(e.target.value);
        fetchProducts({ brand: e.target.value });
    };

    // 8 show products based on color
    const showColors = () => 
        colors.map((c) => (
            <Radio 
            value={c} 
            name={c} 
            checked={c === color} 
            onChange={handleColor} 
            className="pb-1 pl-4 pr-5" 
        >
            {c}
        </Radio>
    ));

    const handleColor = (e) => {
        setSub('')
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: ''},
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar([]);
        setBrand('');
        setColor(e.target.value);
        setShipping('');
        fetchProducts({ color: e.target.value });
    };

    // 9 show products by shipping - yes or no
    const showShipping = () => (
        <>
            <Checkbox 
                className="pb-2 pl-4 pr-4"
                onChange={handleShippingChange} 
                value="Yes" 
                checked={shipping === "Yes"}
            > 
            Yes
            </Checkbox>

            <Checkbox 
                className="pb-2 pl-4 pr-4"
                onChange={handleShippingChange} 
                value="No" 
                checked={shipping === "No"}
            >
            No
            </Checkbox>
        </>
    );

    const handleShippingChange = (e) => {
        setSub('')
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: ''},
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar([]);
        setBrand('');
        setColor('');
        setShipping(e.target.value);
        fetchProducts({ shipping: e.target.value });
    };
    
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3 pt-3">
                    <h4>Search/filter</h4>
                    <hr />

                    <Menu defaultOpenKeys={['1', '2', '3', '4', '5', '6', '7']} mode="inline">

                        {/* Price */}
                        <SubMenu 
                            key='1' 
                            title={
                                <span classname="h6">
                                    <DollarOutlined /> Price
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
                                    max='499'
                                />
                            </div>
                        </SubMenu>

                        {/* category */}
                        <SubMenu 
                            key='2' 
                            title={
                                <span className="h6">
                                    <DownSquareOutlined /> Categories
                                </span>
                            }
                        >
                            <div style={{ marginTop: '-10px' }}>
                                {showCategories()}
                            </div>
                        </SubMenu>


                        {/* Stars */}
                        <SubMenu 
                            key='3' 
                            title={
                                <span className="h6">
                                    <StarOutlined /> Rating
                                </span>
                            }
                        >
                            <div>
                                {showStars()}
                            </div>
                        </SubMenu>

                        {/* sub categories */}
                        <SubMenu 
                            key='4' 
                            title={
                                <span className="h6">
                                    <DownSquareOutlined /> Sub Categories
                                </span>
                            }
                        >
                            <div style={{ marginTop: '-10px' }} className='pl-4 pr-4'>
                                {showSubs()}
                            </div>
                        </SubMenu>

                        {/* brands */}
                        <SubMenu 
                            key='5' 
                            title={
                                <span className="h6">
                                    <DownSquareOutlined /> Brands
                                </span>
                            }
                        >
                            <div style={{ marginTop: '-10px' }} className='pt-3 pl-4 pr-4'>
                                {showBrands()}
                            </div>
                        </SubMenu>

                        {/* colors */}
                        <SubMenu 
                            key='6' 
                            title={
                                <span className="h6">
                                    <DownSquareOutlined /> Colors
                                </span>
                            }
                        >
                            <div style={{ marginTop: '-10px' }} className='pt-3 pl-4 pr-4'>
                                {showColors()}
                            </div>
                        </SubMenu>

                        {/* shipping */}
                        <SubMenu 
                            key='7' 
                            title={
                                <span className="h6">
                                    <DownSquareOutlined /> Shipping
                                </span>
                            }
                        >
                            <div style={{ marginTop: '-10px' }} className='pt-3 pl-4 pr-4'>
                                {showShipping()}
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




