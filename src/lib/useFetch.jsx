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
      login: (body) => getter("/api/auth/login", {method : "POST",body}),
      Glogin: (body) => getter("/api/auth/Glogin", {method : "POST",body}),
      register: (body) => getter("/api/auth/register", {method : "POST",body}),
      me: () => getter("/api/auth/me"),
      logout: () => getter("/api/auth/logout"),
      twofalogin : (body) => getter("/api/auth/2fa/login",{method : "POST",body}),
      authenticator : () => getter("/api/auth/2fa/generate"),
      authenticatorVerify : (body) => getter("/api/auth/2fa/verify",{method : "POST",body}),
      authenticatorDeactivate : (body) => getter("/api/auth/2fa/deactivate",{method : "POST",body}),
    },
    product : {
        list : ()=> getter("/api/product/list"),
        item : (id)=> getter(`/api/product/${id}`),
    },
    cart : {
        add : (body) => getter("/api/cart/add", {method : "POST",body}),
        delete : (id) => getter(`/api/cart/delete/${id}`, {method : "delete"}),
        list : () => getter("/api/cart/list"),
        quantityInc : (id) => getter(`/api/cart/quantityInc/${id}`,{method : "PATCH"}),
        quantityDec : (id) => getter(`/api/cart/quantityDec/${id}`,{method : "PATCH"}),
      },
    wallet : {
      add : (body) => getter("/api/wallet/add", {method : "POST",body}), 
      list : () => getter("/api/wallet/list"),
      configList : () => getter("/api/wallet/list/config"),
    },
    order : {
        list : () => getter("/api/order/list"),
        add : (body) => getter("/api/order/add", {method : "POST",body}),
      },
    file : {
        upload : (body) => getter("/api/file/upload", {method : "POST",body,headers : {}}),
      },
    ticket : {
        list : () => getter("/api/ticket/list"),
        add : (body) => getter("/api/ticket/add", {method : "POST",body}),
        addMessage : (body) => getter("/api/ticket/addMessage", {method : "POST",body}),
        updateStatus : (status,id) => getter(`/api/ticket/updateStatus/${status}/${id}`),
      },
    admin : {
      getUsers : () => getter("/api/admin/list/users"),
      getPaymentDetails : () => getter("/api/admin/list/payments"),
      getTickets : () => getter("/api/admin/list/tickets"),
      getPendingDeposits : () => getter("/api/admin/list/deposits"),
      updateBalance : (body)=> getter("/api/admin/updateBalance", {method : "POST",body}), 
      updateRole : (body)=> getter("/api/admin/updateRole", {method : "POST",body}), 
      updatePaymentMethod : (body)=> getter("/api/admin/updatePaymentMethod", {method : "POST",body}), 
      updateDeposit : (body)=> getter("/api/admin/updateDeposit", {method : "POST",body}), 
      addProduct : (body)=> getter("/api/admin/addProduct", {method : "POST",body}), 
      deleteProduct : (id) => getter(`/api/admin/delete/product/${id}`,{method : "DELETE"}),
    }
  };
};
export default useApi;
