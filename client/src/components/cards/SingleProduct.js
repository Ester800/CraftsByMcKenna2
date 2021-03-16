import React, { useState} from 'react';
import { Card, Tabs, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import stockPhoto from '../../images/craftsbymckennalogo.jpg';
import ProductListItems from './ProductListItems';
import StarRating from 'react-star-ratings';
import RatingModal from '../modal/RatingModal';
import { showAverage } from '../../functions/rating';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';

const { TabPane } = Tabs;

// this is the child component of Product page
const SingleProduct = ({ product, onStarClick, star }) => {
    const [tooltip, setTooltip] = useState('Click to add');

    // redux
    const { user, cart } = useSelector((state) => ({ ...state }));
    const dispatch = useDispatch();

    const { title, images, description, _id } = product;

    const handleAddToCart = () => {
        
        // create cart array
        let cart = [];
        if (typeof window !== 'undefined')  {   // this checks to see if we have the window object available 
            // if cart is in local storage, GET it!
            if (localStorage.getItem('cart')) {  // if we have items in the cart, get them...
                cart = JSON.parse(localStorage.getItem('cart'))
            }
            // push new item into the cart array
            cart.push({
                ...product,   // spread out the properties, then add the count as a property
                count: 1, 
            });
            // avoid duplicates in the cart!
            let unique = _.uniqWith(cart, _.isEqual);  // lodash method that compares items in an array, if its unique then move forward
            //console.log('unique', unique);
            // save to local storage
            localStorage.setItem('cart', JSON.stringify(unique));
            // show tooltip
            setTooltip('Added');

            // add to redux state
            dispatch({
                type: 'ADD_TO_CART',
                payload: unique,
            });
            dispatch({
                type: "SET_VISIBLE",
                payload: true,
            });
        }
    };

    return (
        <>
            <div className="col-md-7">
                { images && images.length ? (
                <Carousel showArrows={true} autoPlay infiniteLoop>
                    {images && images.map((i) => <img alt='' src={i.url} key={i.public_id} />)}
                </Carousel>
                ) : (
                    <Card cover={<img alt='' src={stockPhoto} className="mb-3 card-image " />}></Card>
                )}   

                <Tabs type='card'>
                    <TabPane tab='Description' key='1'>
                        {description && description}
                    </TabPane>
                    <TabPane tab='More info' key='2'>
                        Call us at (269) 217-0531 to learn more!
                    </TabPane>
                </Tabs>
            </div>

            <div className="col-md-5">
            <h1 className="bg-info p-3 text-center">{title}</h1>

            {product && product.ratings && product.ratings.length > 0 ? (
                showAverage(product)
                ) : (
                <div className="text-center pt-1 pb-3">No rating yet</div>
                )}

                <Card
                actions={[
                    <>
                        <Tooltip title={tooltip}>
                            <a onClick={handleAddToCart}>
                            <ShoppingCartOutlined className="text-danger" /> <br /> Add to Cart
                            </a>
                        </Tooltip>
                        <Link to='/'>
                            <HeartOutlined className="text-info" /> <br /> Add to Wishlist
                        </Link>
                        <RatingModal>
                            <StarRating 
                                name={_id}
                                numberOfStars={5}
                                rating={star}
                                changeRating={onStarClick}
                                isSelectable={true}
                                starRatedColor='red'
                            />
                        </RatingModal>
                    </>
                    ]}
                >
                    
                        <ProductListItems product={product} />

                </Card>
            </div>
        </>
    );
};

export default SingleProduct;