const paypal = require('../../helpers/paypal'); // ✅ keeping your original variable name
const Order = require('../../models/Order');
const Cart = require('../../models/Cart');
const Product = require('../../models/Product');
const { orders } = require('@paypal/checkout-server-sdk');
const { OrdersCaptureRequest } = require('@paypal/checkout-server-sdk/lib/orders/lib');
const { OrdersCreateRequest } = paypal.sdk.orders;


const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentStatus,
      paymentMethod,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId
    } = req.body;

    // ✅ using the new SDK's OrdersCreateRequest
    const request = new OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: totalAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: totalAmount.toFixed(2),
              },
            },
          },
          items: cartItems.map(item => ({
            name: item.title,
            sku: item.productId,
            unit_amount: {
              currency_code: 'USD',
              value: item.price.toFixed(2),
            },
            quantity: item.quantity.toString(),
          })),
          description: 'Description',
        },
      ],
      application_context: {
        return_url: 'http://localhost:5173/shop/paypal-return',
        cancel_url: 'http://localhost:5173/shop/paypal-cancel',
      },
    });

    // Execute request
    const order = await paypal.client.execute(request);


    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentStatus,
      paymentMethod,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
    });

    await newlyCreatedOrder.save();

    const approvalURL = order.result.links.find(link => link.rel === 'approve')?.href;


    res.status(201).json({
      success: true,
      approvalURL,
      orderId: newlyCreatedOrder._id,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: 'Some Error Occurred!',
    });
  }
};

const capturePayment = async (req, res) => {
  try {


    const { paymentId, payerId, orderId } = req.body;

    const request = new OrdersCaptureRequest(paymentId);
    request.requestBody({}); // required even if empty

    const capture = await paypal.client.execute(request);

    // Step 2: Update your MongoDB order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order cannot be found'
      });
    }


    order.paymentStatus = 'Paid';
    order.orderStatus = ' Confirmed';
    order.paymentId = paymentId;
    order.payerId = payerId

    for(let item of order.cartItems){
      let product = await Product.findById(item.productId)

      if(!product){
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`
        })
      }
      product.totalStock -= item.quantity
      await product.save()
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId)


    await order.save()

    res.status(200).json({
      success: true,
      message: 'Order Confirmed',
      data: order
    })



  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: 'Some Error Occurred!',
    });
  }
};


const getAllOrdersByUser = async (req, res) => {
  try {

    const {userId} = req.params;

    const orders = await Order.find({userId})

    if(orders.length === 0){
      return res.status(404).json({
        success: false,
        message:'No Orders found!'
      })
    }

    res.status(200).json({
      success: true,
      data: orders
    })

  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: 'Some Error Occurred!',
    })
  }
}



const getOrderDetails = async (req, res) => {
  try {
    const {id} = req.params;

    const order = await Order.findById(id)

    if(!order){
      return res.status(404).json({
        success: false,
        message:'Order not foun d!'
      })
    }

    res.status(200).json({
      success: true,
      data: order
    })

  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: 'Some Error Occurred!',
    })
  }
}



module.exports = { createOrder, capturePayment, getAllOrdersByUser, getOrderDetails };
