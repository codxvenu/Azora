import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ShoppingBag, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import useApi from '../lib/useFetch';
import OrderCard from './Order/OrderCard';
import OrderMultiCard from './Order/OrderMultiCard';


 const OrdersView = () => {
  const [orders, setOrders] = useState([]);
  const api = useApi();
  const[show,setShow] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
        const ordersData = await api.order.list();
        if(Array.isArray(ordersData?.Order)){
          setOrders(ordersData?.Order ?? []);
        }else{
          setOrders([ordersData?.Order] ?? []);
        }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-14 my-12">
      <div className="space-y-2 text-left">
        <h2 className="text-4xl font-display font-black tracking-tighter uppercase">YOUR ORDERS</h2>
        <p className={'dark:text-zinc-400 text-zinc-500'}>Access your purchased gift card activation codes instantly.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders?.map(order => (
          order.products.length >= 2 ? <OrderMultiCard order={order} setShow={setShow} show={show}/> : <OrderCard order={order}/>
        ))}
        {orders.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <ShoppingBag className="w-12 h-12 text-zinc-400 mx-auto" />
            <p className="text-zinc-500 font-medium">You haven't purchased any items yet.</p>
            <Link to="/">
              <button 
                className={`font-mono text-xs font-bold uppercase tracking-widest underline underline-offset-4 dark:text-white text-black
                `}
              >
                Start Shopping
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
export default OrdersView;