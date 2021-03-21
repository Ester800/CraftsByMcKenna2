import React, {useState} from 'react';
import { Card, Tooltip } from 'antd';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
//import craftsbymckennalogo from '../../images/craftsbymckennalogo.jpg';
import { Link } from 'react-router-dom';
import { showAverage } from '../../functions/rating';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';

const { Meta } = Card;

const ProductCard = ({product}) => {
    const [tooltip, setTooltip] = useState('Click to add');

    // redux
    //const { user, cart } = useSelector((state) => ({ ...state }));
    const dispatch = useDispatch();

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
            // show cart items inside drawer
            dispatch({
                type: "SET_VISIBLE",
                payload: true,
            });
        }
    };

    // descructure
    const { images, title, description, slug, price } = product;

return (
    <>
        {product && product.ratings && product.ratings.length > 0 ? (
            showAverage(product)
        ) : (
        <div className="text-center pt-1 pb-3">No rating yet</div>
        )}


    <Card
    cover={
        <img 
            alt='' 
            src={images && images.length ? images[0].url : 'no photo available' } 
            style={{ height: '150px', objectFit: 'cover' }}
            className='p-1' 
        />
    }

    actions={[
        <Link to={`/product/${slug}`}>
            <EyeOutlined className="text-warning" /> <br /> View Product
        </Link>, 
        <Tooltip title={tooltip}>
            <div onClick={handleAddToCart} disabled={product.quantity < 1 }>
            <ShoppingCartOutlined className="text-danger" /> <br />
                {product.quantity < 1 ? "Out of Stock": "Add to Cart"}
            </div>
        </Tooltip>,
    ]}
    >
      <Meta title={`${title}` + ' - ' + ` $${price.toFixed(2)}`} 
            description={`${description && description.substring(0, 45)}...`} />  
    </Card>
    </>
    );
};


export default ProductCard;