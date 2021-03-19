import React from 'react';




const ShowPaymentInfo = ({ order, showStatus = true }) => (
    <div className='pb-2'>
            <div>
                Order Id: <b>{order.paymentIntent.paymentIntent.id}</b>
            </div>

            <div>
                Final Amount: <b>{(order.paymentIntent.paymentIntent.amount/100).toLocaleString('USD', {
                    style: 'currency', 
                    currency: 'USD',
                    })}{' '}{'('}{order.paymentIntent.paymentIntent.currency.toUpperCase()}{')'}</b>
            </div>

            
            <div>
                Pymt Method: <b>{order.paymentIntent.paymentIntent.payment_method_types[0]}</b>
            </div>

            <div>
                Ordered On: <b>{new Date(order.paymentIntent.paymentIntent.created * 1000).toLocaleString()}</b>
            </div>

            {showStatus && (
            <span className='badge bg-primary text-white'>
                Order Status: {order.orderStatus}
            </span>
            )}
    </div>

)

export default ShowPaymentInfo;