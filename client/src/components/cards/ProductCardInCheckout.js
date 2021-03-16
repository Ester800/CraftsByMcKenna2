import React from 'react';
import ModalImage from 'react-modal-image';
import craftsbymckennalogo from '../../images/craftsbymckennalogo.jpg';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { CheckCircleOutlined, CloseCircleOutlined, CloseOutlined} from '@ant-design/icons';

const ProductCardInCheckout = ({ p }) => {

    const colors = ["Gold Flakes", "Colored dots", "Silver Flakes", "White", "Blue"];
    let dispatch = useDispatch();

    const handleColorChange = (e) => {    // the following handles the change of color during checkout...
        console.log('color changed', e.target.value);

        let cart = []
        if(typeof window !== 'undefined') {
            if(localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
            }

            cart.map((product, index) => {
                if(product._id === p._id) {
                    cart[index].color = e.target.value;
                }
            });

            //console.log('cart update color', cart);
            localStorage.setItem('cart', JSON.stringify(cart));
            dispatch({
                type: "ADD_TO_CART",
                payload: cart,
            });
        }
    };

    const handleQuantityChange = (e) => {   // the following handles the change in quantity during checkout!
        let count = e.target.value < 1 ? 1 : e.target.value;  // stops our counter from dropping below 1!
        
        console.log('available quantity', p.quantity);
        if(count > p.quantity) {  // if the requested number of items is greater than what is in stock, show error
            toast.error(`Max avaiable quantity: ${p.quantity} Please call us to place a special order`);
            return;
        }
        
        let cart = [];

        if(typeof window !== 'undefined') {
            if(localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
            }

            cart.map((product, index) => {
                if(product._id === p._id) {
                    cart[index].count = count;
                }
            });

            console.log('quantity updated');
            localStorage.setItem('cart', JSON.stringify(cart));
            dispatch({
                type: 'ADD_TO_CART',
                payload: cart,
            });
        }
    };

    const handleRemove = () => {  // the following code removes an item from the cart
        //console.log(p._id, "to remove");
        let cart = [];

        if(typeof window !== 'undefined') {
            if(localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
            }
            
            cart.map((product, index) => {
                if(product._id === p._id) {
                    cart.splice(index, 1);
                }
            });

            console.log('quantity updated');
            localStorage.setItem('cart', JSON.stringify(cart));
            dispatch({
                type: 'ADD_TO_CART',
                payload: cart,
            });
        }

    };

    return (
        <tbody>
            <tr>
                <td>
                    <div style={{width: '100px', height: 'auto'}}>
                        {p.images.length ? (
                            <ModalImage small={p.images[0].url} large={p.images[0].url} />
                        ) : (
                            <ModalImage small={craftsbymckennalogo} large={craftsbymckennalogo} />
                        )}
                    </div>
                </td>
                <td>{p.title}</td>
                <td>${p.price}</td>
                <td>{p.brand}</td>
                <td>
                    <select onChange={handleColorChange} name='color' className='form-control' >
                        { p.color ? (
                            <option value={p.color}>
                                {p.color}
                            </option>
                            ) : (
                            <option>
                                Select
                            </option>)
                        }
                        { colors
                        .filter((c) => c !== p.color)   // filter through the array of colors and exclude the current color
                        .map((c) => (
                            <option 
                                key={c} 
                                value={c}
                            >
                                {c}
                            </option>))}
                        
                    </select>
                </td>

                <td className="text-center">
                    <input 
                        type='number' 
                        className="form-control" 
                        value={p.count} 
                        onChange={handleQuantityChange}
                    />
                </td>

                <td className="text-center">
                    {p.shipping === "Yes" ? (
                        <CheckCircleOutlined className="text-success" />
                    ) : (
                        <CloseCircleOutlined className="text-danger"/>
                    )}
                </td>
                <td className="text-center">
                    <CloseOutlined 
                        onClick={handleRemove} 
                        className="text-danger pointer"
                    />
                </td>
            </tr>
        </tbody>
    )
}

export default ProductCardInCheckout;