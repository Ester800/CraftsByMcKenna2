import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import ProductCardInCheckout from '../components/cards/ProductCardInCheckout';
import { userCart } from '../functions/user';

const Cart = ({ history }) => {

    const {cart, user } = useSelector((state) => ({ ...state }));
    const dispatch = useDispatch();

    // function that interates through the cart and adds the price of each to give a grand total
    const getTotal = () => {
        return cart.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price
        }, 0);
    };

    const saveOrderToDb = () => {
        //alert('save order to db');
        //console.log('cart', JSON.stringify(cart, null, 4));
        userCart(cart, user.token)
            .then((res) => {
                console.log('CART POST RES', res)
                if(res.data.ok) history.push('/checkout');
            }).catch(err => console.log('cart save err', err));
    };

    const showCartItems = () => (
        <table className='table table-bordered text-center'>
            <thead className="thead-light">
                <tr>
                    <th scope='col'>Image</th>
                    <th scope='col'>Title</th>
                    <th scope='col'>Price</th>
                    <th scope='col'>Brand</th>
                    <th scope='col'>Color</th>
                    <th scope='col'>Count</th>
                    <th scope='col'>Shipping</th>
                    <th scope='col'>Remove</th>
                </tr>
            </thead>

            {cart.map((p) => (
                <ProductCardInCheckout key={p._id} p={p} />
            ))}


        </table>
    )

    return (
    <div className="container-fluid pt-2">
        <div className='row'>
            <div className="col-md-8">
                <h4>Cart / {cart.length} Product </h4>
                    {!cart.length ? (
                    <p>
                        No Products in cart.  <Link to="/shop">Continue shopping.</Link>
                    </p>
                    ) : (
                        showCartItems()
                    )}
            </div>
            <div className="col-md-4">
                <h4>Order Summary</h4>
                <hr />
                <p>Products</p>
                    {cart.map((c, i) => (
                        <div key={i}>
                            <p>{c.title} x {c.count} = ${c.price * c.count}</p>
                        </div>
                    ))}
                    <hr />
                        Sub Total: <b>${getTotal()}</b>


                    <hr />
                    { user ? (
                            <button 
                                onClick={saveOrderToDb}
                                className="btn btn-sm btn-primary mt-2"
                                disabled={!cart.length} // returns true if cart is empty, thereby disabling checkout process!
                            >
                                Proceed to checkout
                            </button>
                        ) : (
                            <button className="btn btn-sm btn-primary mt-2">
                                <Link to={{
                                    pathname: '/login',
                                    state: { from: 'cart' },  // this is the state of the react router

                                }}>
                                     Login to checkout
                                </Link>
                            </button>
                        )
                    }
            </div>
        </div>
    </div>
    );
};

export default Cart;