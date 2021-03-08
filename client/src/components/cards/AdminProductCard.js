import React from 'react';
import { Card } from 'antd';
import keychain1 from '../../images/CraftsByMcKennaLogo.jpg'

const { Meta } = Card;

const AdminProductCard = ({ product }) => {
    // destructure
    const { title, description, images } = product;

    return (
        <Card 
            cover={<img 
            alt='' 
            src={images && images.length ? images[0].url : keychain1} 
            style={{ height: '150px', objectFit: 'cover' }}
            className='p-1' 
            />
        }
    >
        <Meta title={title} description={description} />
    </Card>
    );
};

export default AdminProductCard;