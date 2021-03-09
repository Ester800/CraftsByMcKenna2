import React from 'react';
import { Card } from 'antd';
import craftsbymckennalogo from '../../images/craftsbymckennalogo.jpg';
import  { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Meta } = Card;

const AdminProductCard = ({ product, handleRemove }) => {
    // destructure
    const { title, description, images, slug } = product;

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
            <Link to={`/admin/product/${slug}`}>
                <EditOutlined />
            </Link>, 
            <DeleteOutlined onClick={() => handleRemove(slug)}  // arrow function otherwise it gets called immediately
                            className="text-danger" 
            />
        ]}
    >
        <Meta title={title} description={`${description && description.substring(0, 45)}...`} />
    </Card>
    );
};

export default AdminProductCard;