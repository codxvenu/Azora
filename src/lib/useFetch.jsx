import { useNotification } from "./useNotification";

 const useApi = () => {
  const { showNotification } = useNotification();

  const getter = async (route,options={}) => {
    try {
      const res = await fetch(route, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        ...options
      });
      const data = await res.json();
      if(!res?.ok) {
        throw Error(data?.error || "Request Failed");
    }

      {data?.message ? showNotification(data.message, "success") : ""}
      return data;
    } catch (error) {
      if(error?.error !== "User Not authenticated") return
      showNotification(!(error instanceof Error)  || error?.message.includes("json") ?  "Unexpected Error" : error?.message, "error");
    }
  };
  return {
    auth: {
      login: (body) => getter("http://localhost:3001/api/auth/login", {method : "POST",body}),
      register: (body) => getter("http://localhost:3001/api/auth/register", {method : "POST",body}),
      me: () => getter("http://localhost:3001/api/auth/me"),
      logout: () => getter("http://localhost:3001/api/auth/logout"),
      twofalogin : (body) => getter("http://localhost:3001/api/auth/2fa/login",{method : "POST",body}),
      authenticator : () => getter("http://localhost:3001/api/auth/2fa/generate"),
      authenticatorVerify : (body) => getter("http://localhost:3001/api/auth/2fa/verify",{method : "POST",body}),
      authenticatorDeactivate : (body) => getter("http://localhost:3001/api/auth/2fa/deactivate",{method : "POST",body}),
    },
    product : {
        list : ()=> getter("http://localhost:3001/api/product/list"),
        item : (id)=> getter(`http://localhost:3001/api/product/${id}`),
    },
    cart : {
        add : (body) => getter("http://localhost:3001/api/cart/add", {method : "POST",body}),
        delete : (id) => getter(`http://localhost:3001/api/cart/delete/${id}`, {method : "delete"}),
        list : () => getter("http://localhost:3001/api/cart/list"),
        quantityInc : (id) => getter(`http://localhost:3001/api/cart/quantityInc/${id}`,{method : "PATCH"}),
        quantityDec : (id) => getter(`http://localhost:3001/api/cart/quantityDec/${id}`,{method : "PATCH"}),
      },
    wallet : {
      add : (body) => getter("http://localhost:3001/api/wallet/add", {method : "POST",body}), 
      list : () => getter("http://localhost:3001/api/wallet/list"),
      configList : () => getter("http://localhost:3001/api/wallet/list/config"),
    },
    order : {
        list : () => getter("http://localhost:3001/api/order/list"),
        add : (body) => getter("http://localhost:3001/api/order/add", {method : "POST",body}),
      },
    admin : {
      getUsers : () => getter("http://localhost:3001/api/admin/list/users"),
      getPaymentDetails : () => getter("http://localhost:3001/api/admin/list/payments"),
      getPendingDeposits : () => getter("http://localhost:3001/api/admin/list/deposits"),
      updateBalance : (body)=> getter("http://localhost:3001/api/admin/updateBalance", {method : "POST",body}), 
      updateRole : (body)=> getter("http://localhost:3001/api/admin/updateRole", {method : "POST",body}), 
      updatePaymentMethod : (body)=> getter("http://localhost:3001/api/admin/updatePaymentMethod", {method : "POST",body}), 
      updateDeposit : (body)=> getter("http://localhost:3001/api/admin/updateDeposit", {method : "POST",body}), 
      addProduct : (body)=> getter("http://localhost:3001/api/admin/addProduct", {method : "POST",body}), 
      deleteProduct : (id) => getter(`http://localhost:3001/api/admin/delete/product/${id}`,{method : "DELETE"}),
    }
  };
};
export default useApi;
