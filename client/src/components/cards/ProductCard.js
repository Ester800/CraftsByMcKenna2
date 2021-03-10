import React from 'react';
import { Card } from 'antd';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import craftsbymckennalogo from '../../images/craftsbymckennalogo.jpg';
import { Link } from 'react-router-dom';

const { Meta } = Card;

const ProductCard = ({product}) => {
    // descructure
    const { images, title, description, slug } = product;

return (
    
    <Card
    cover={
        <img 
            alt='' 
            src={images && images.length ? images[0].url : craftsbymckennalogo } 
            style={{ height: '150px', objectFit: 'cover' }}
            className='p-1' 
        />
    }

    actions={[
        <Link to={`/product/${slug}`}>
            <EyeOutlined className="text-warning" /> <br /> View Product
        </Link>, 
        <>
        <ShoppingCartOutlined className="text-danger" />Add to Cart
        </>,
    ]}
    >
      <Meta title={title} description={`${description && description.substring(0, 45)}...`} />  
    </Card>
    );
};


export default ProductCard;