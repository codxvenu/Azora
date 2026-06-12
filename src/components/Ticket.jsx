import React, { useState, useEffect, useContext } from 'react';
import { useNotification } from '../lib/useNotification';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  LifeBuoy, 
  MessageSquare, 
  Plus, 
  Send, 
  Clock, 
  User, 
  ShieldAlert, 
  CheckCircle, 
  AlertCircle,
  Hash,
  Activity,
  UserCheck
} from 'lucide-react';
import { Auth } from '@/Utility/AuthContext';
import useApi from '../lib/useFetch';
import { useNavigate } from 'react-router-dom';
export const Ticket = ({ profile, onBack }) => {
  const { showNotification } = useNotification();
  const {user} = useContext(Auth);
  const navigation = useNavigate()
  const api = useApi()
  const [tickets, setTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  
  // Create ticket states
  const [viewState, setViewState] = useState('list');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Other');
  const [orderId, setOrderId] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Message reply state
  const [replyText, setReplyText] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  
  // User orders available to link
  const [userOrders, setUserOrders] = useState([]);

  // Check if admin
  const isAdminUser = user?.role === 'admin';
const handleTickets = async() => {
    if(isAdminUser){
         const data = await api.admin.getTickets();
        setTickets(data?.tickets || []);
    return
    }
    const data = await api.ticket.list();
    setTickets(data?.tickets || []);
}
useEffect(()=>{
    handleTickets()
},[])
useEffect(()=>{
    setMessages(activeTicket?.chats ?? [])
},[activeTicket])
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!subject.trim() || !description.trim()) {
      showNotification('Please fill in both the subject and detailed description fields.', 'error');
      return;
    }

    setIsSubmitting(true);
      const ticketData = {
        subject: subject.trim(),
        category,
        orderId: orderId || null,
        description: description.trim(),
        status: 'open',
        priority
      };
      const ticket = await api.ticket.add(JSON.stringify({ticketData}));
      setTickets(prev=>[...prev,ticket])
      if(!ticket?.status){
    setIsSubmitting(false);
}
// Reset creation state
setIsSubmitting(false);
      setSubject('');
      setCategory('Other');
      setOrderId('');
      setDescription('');
      setPriority('medium');
      setViewState('list');
      
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!user || !activeTicket || !replyText.trim()) return;

    setIsSendingMessage(true);
      
      const messageBody = {
        sender: user?.role?.toLowerCase(),
        message: replyText.trim(),
        ticketId : activeTicket._id
      };
      const data = await api.ticket.addMessage(JSON.stringify({...messageBody}));
      if(data.status){
        setMessages((prev)=>[...prev,data?.messageObj])
      }
      setReplyText('');
      setIsSendingMessage(false);
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!activeTicket) return;
      await api.ticket.updateStatus(newStatus,activeTicket._id)
      setActiveTicket(prev => prev ? { ...prev, status: newStatus } : null);
  }
  const getPriorityBadgeClass = (prio) => {
    switch (prio) {
      case 'high': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'open': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'in-progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'resolved': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'closed': return 'bg-red-500/10 text-red-500 border-purple-500/20';
      default: return 'bg-zinc-500/10 text-zinc-550 border-zinc-550/20';
    }
  };
  if(!user){
    navigation("/")
  }
  return (
    <div className="max-w-5xl mx-auto space-y-10 my-12" id="tickets-portal">
      {/* Structural Minimal Breadcrumb */}
 

      {/* Hero Title */}
   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-6 border-zinc-200/55 dark:border-zinc-900">
  <div className="space-y-2 text-left">
    <h1 className="text-4xl font-display font-black tracking-tighter uppercase text-zinc-900 dark:text-white flex items-center gap-2">
      <LifeBuoy className="w-9 h-9 text-emerald-500 shrink-0" />
      SUPPORT CORNER
    </h1>

    <p className="text-sm leading-relaxed max-w-xl text-zinc-650 dark:text-zinc-400">
      {isAdminUser
        ? 'Resolve platform-wide buyer disputes, verify escrow claims, and communicate in real time.'
        : 'Open security help requests, dispute problematic code deliveries, and track solution status.'
      }
    </p>
  </div>

  {viewState === 'list' && (
    <button
      onClick={() => setViewState('create')}
      className="px-5 py-3 rounded-xl text-xs font-bold font-mono uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
    >
      <Plus className="w-4 h-4" /> OPEN NEW TICKET
    </button>
  )}
</div>
  

      {/* MAIN VIEWPORT PANELS */}
      {viewState === 'list' ? (
        <div className="space-y-6">
          {tickets.length === 0 ? (
            <div className={`p-12 text-center rounded-3xl border border-dashed space-y-4 dark:bg-zinc-950/20 dark:border-zinc-900' bg-zinc-50/50 border-zinc-200
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-zinc-900/50 border border-zinc-850 mx-auto flex items-center justify-center text-zinc-500">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-sm tracking-tight">No support cases registered</p>
                <p className={`text-xs dark:text-zinc-500 text-zinc-500 `}>
                  {isAdminUser 
                    ? 'Excellent job! The support ticket system queue is currently fully cleared.' 
                    : 'If you require support or want to dispute a transaction, click Open New Ticket above.'
                  }
                </p>
              </div>
              <button
                onClick={() => setViewState('create')}
                className={`text-xs font-mono font-bold uppercase tracking-wider text-emerald-500 hover:underline`}
              >
                Create case now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {tickets.map(ticket => (
                <button
                  key={ticket.id}
                  onClick={() => {
                    setActiveTicket(ticket);
                    setViewState('detail');
                  }}
                  className={`w-full p-5 sm:p-6 rounded-2xl border text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-300 relative group overflow-hidden
    dark:bg-zinc-950 dark:border-zinc-900 dark:hover:border-zinc-800 dark:text-white' 
                      bg-white border-zinc-250 border-zinc-200 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-500/5 text-zinc-950
                  }`}
                  id={`ticket-card-${ticket.id}`}
                >
                  {/* Priority indicator bar */}
                  <div className={`absolute top-0 bottom-0 left-0 w-1 ${
                    ticket.priority === 'high' ? 'bg-rose-500' : ticket.priority === 'medium' ? 'bg-amber-500' : 'bg-zinc-500'
                  }`} />

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md border text-[9px] font-mono font-bold uppercase tracking-wider ${getPriorityBadgeClass(ticket.priority)}`}>
                        {ticket.priority} PRIORITY
                      </span>
                      <span className={`px-2 py-0.5 rounded-md border text-[9px] font-mono font-bold uppercase tracking-wider ${getStatusBadgeClass(ticket.status)}`}>
                        {ticket.status}
                      </span>
                      <span className={`text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold`}>
                        {ticket.category}
                      </span>
                    </div>

                    <h3 className="font-bold dark:text-white text-base group-hover:text-emerald-500 transition-colors">
                      {ticket.subject}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-500 font-mono">
                      {isAdminUser && (
                        <span className="flex items-center gap-1 border-r border-zinc-800 pr-3 text-emerald-500 font-bold">
                          <User className="w-3.5 h-3.5" /> {ticket.userId}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Updated {format(new Date(ticket.updatedAt), 'MMM dd, HH:mm')}
                      </span>
                      {ticket.orderId && (
                        <span className="flex items-center gap-1 text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-[10px]">
                          <Hash className="w-3 h-3 text-zinc-500" /> ORDER LINKED
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border shrink-0 transition-all  dark:bg-zinc-900 dark:border-zinc-850 dark:group-hover:bg-zinc-800 bg-zinc-50 border-zinc-150 group-hover:bg-zinc-100
                  }`}>
                    <MessageSquare className="w-5 h-5 text-emerald-500" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : viewState === 'create' ? (
  /* CREATE NEW TICKET FORM */
  <div className="rounded-3xl border p-6 sm:p-10 shadow-2xl transition-all duration-300 bg-white border-zinc-150 text-zinc-950 dark:bg-zinc-950 dark:border-zinc-900 dark:text-white">
    <div className="flex items-center justify-between border-b pb-4 border-zinc-200/55 dark:border-zinc-900 mb-6">
      <h3 className="font-display font-black text-lg uppercase flex items-center gap-2">
        <Plus className="w-5 h-5 text-emerald-500" />
        File Open Case Help Request
      </h3>

      <button
        onClick={() => setViewState('list')}
        className="text-[10px] font-mono hover:underline font-bold uppercase tracking-widest text-zinc-500"
      >
        CANCEL
      </button>
    </div>

    <form  className="space-y-6 text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Category */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Case Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-4 rounded-xl text-sm font-bold outline-none border transition-all bg-zinc-55 border-zinc-200 text-zinc-900 focus:border-black dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:border-zinc-700"
          >
            <option value="Payment">Payment & Deposit Disputes</option>
            <option value="Security">Account Security (2FA etc.)</option>
            <option value="Code Issue">Gift Card Activation Failures</option>
            <option value="Other">Other General Inquiry</option>
          </select>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Urgency Level
          </label>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-4 rounded-xl text-sm font-bold outline-none border transition-all bg-zinc-55 border-zinc-200 text-zinc-900 focus:border-black dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:border-zinc-700"
          >
            <option value="low">Low (Standard Feedback)</option>
            <option value="medium">Medium (Help Needed)</option>
            <option value="high">High (Immediate Escrow Dispute)</option>
          </select>
        </div>

        {/* Linked Order ID */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Link Associated Order (Optional)
          </label>

          {userOrders.length > 0 ? (
            <select
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full p-4 rounded-xl text-sm font-bold outline-none border transition-all bg-zinc-55 border-zinc-200 text-zinc-900 focus:border-black dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:border-zinc-700"
            >
              <option value="">-- No Order Linked --</option>
              {userOrders.map(order => (
                <option key={order.id} value={order.id}>
                  {order.productName} (ID: {order.id.slice(0, 8)}...)
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              placeholder="Input exact Order ID e.g. ord_77x..."
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full p-4 rounded-xl text-sm outline-none border transition-all bg-zinc-55 border-zinc-200 text-zinc-900 focus:border-black dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:border-zinc-700"
            />
          )}
        </div>

        {/* Subject */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Case Subject Summary
          </label>

          <input
            type="text"
            required
            placeholder="e.g. My Elden Ring Code has already been activated"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-4 rounded-xl text-sm outline-none border transition-all bg-zinc-55 border-zinc-200 text-zinc-900 focus:border-black dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:border-zinc-700"
          />
        </div>

        {/* Detailed Description */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Explanation details
          </label>

          <textarea
            rows={6}
            required
            placeholder="Share a precise step-by-step description of your concern. Include the exact error outputs if some code fail activations."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 rounded-xl text-sm outline-none border resize-none transition-all bg-zinc-55 border-zinc-200 text-zinc-900 focus:border-black dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:border-zinc-700"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-zinc-200/55 dark:border-zinc-900">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleCreateTicket}
          className={`px-6 py-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-xl ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          } bg-emerald-500 hover:bg-emerald-600 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500`}
        >
          {isSubmitting ? 'Submitting Vault Record...' : 'FILE INQUIRY'}
        </button>
      </div>
    </form>
  </div>
) : (
        /* TICKET DETAIL VIEW AND MESSAGE THREAD */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Sidebar Column: Ticket Identity details */}
          <aside className="lg:col-span-4 space-y-4">
            <div className="p-6 rounded-2xl border text-left space-y-6 bg-white border-zinc-200 text-zinc-900 dark:bg-zinc-950 dark:border-zinc-900 dark:text-white">
              
              <div className="space-y-2 pb-4 border-b border-zinc-200/55 dark:border-zinc-900">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getPriorityBadgeClass(activeTicket?.priority || 'medium')}`}>
                    {activeTicket?.priority} PRIORITY
                  </span>
                  <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getStatusBadgeClass(activeTicket?.status || 'open')}`}>
                    {activeTicket?.status}
                  </span>
                </div>
                <h3 className="font-bold text-base leading-snug mt-2">{activeTicket?.subject}</h3>
              </div>

              <div className="space-y-4 text-xs">
                
                {/* User information */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Requester Identifier</span>
                  <div className="flex items-center gap-2 p-2 rounded bg-zinc-900/10 dark:bg-zinc-900 font-mono">
                    <UserCheck className="w-4 h-4 text-emerald-500" />
                    <div className="truncate">
                      <p className="font-bold truncate">{activeTicket?.displayName}</p>
                      <p className="text-[10px] text-zinc-500 truncate">{activeTicket?.userEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Inquiry category</span>
                  <p className="font-medium px-2 py-1 rounded bg-zinc-900/10 dark:bg-zinc-900 border border-zinc-200/10 inline-block font-mono">
                    {activeTicket?.category}
                  </p>
                </div>

                {/* Linked Order */}
                {activeTicket?.orderId && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Referenced Swapped Order</span>
                    <p className="font-bold p-2 rounded bg-zinc-900/10 dark:bg-zinc-900 border border-zinc-200/10 font-mono flex items-center justify-between truncate gap-2" title={activeTicket.orderId}>
                      <span className="truncate">ID: {activeTicket.orderId}</span>
                    </p>
                  </div>
                )}

                {/* Time created */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Created Epoch</span>
                  <p className="text-zinc-500 font-mono">
                    {activeTicket?.createdAt ? format(new Date(activeTicket.createdAt), 'MMMM dd yyyy, HH:mm') : ''}
                  </p>
                </div>
              </div>

              {/* USER/ADMIN WORKFLOW ACTION DROPDOWNS */}
              <div className="pt-6 border-t border-zinc-200/55 dark:border-zinc-900 space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Modify case progress</span>
                
                {isAdminUser ? (
                  /* Admin can shift everything */
                  <div className="grid grid-cols-2 gap-2">
                   
                    <button 
                      onClick={() => handleUpdateStatus('closed')}
                      className={`px-3 py-2 rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider text-center border col-span-2 ${
                        activeTicket?.status === 'closed' 
                          ? 'border-zinc-550 text-zinc-550 bg-zinc-500/5' 
                          : 'border-zinc-800 text-rose-500 hover:bg-rose-500/[0.02]'
                      }`}
                    >
                      Close Dispute
                    </button>
                  </div>
                ) : (
                  /* User can close their own ticket */
                  <button
                    disabled={activeTicket?.status === 'closed' || activeTicket?.status === 'resolved'}
                    onClick={() => handleUpdateStatus('closed')}
                    className={`w-full py-2.5 rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider text-center border transition-all ${
                      activeTicket?.status === 'closed' || activeTicket?.status === 'resolved'
                        ? 'border-zinc-900 text-zinc-300 bg-zinc-950 cursor-not-allowed'
                        : 'border-rose-500/20 text-rose-500 bg-rose-500/[0.02] hover:bg-rose-500/10'
                    }`}
                  >
                    {activeTicket?.status === 'closed' ? 'TICKET TERMINATED' : 'CLOSE CASE REQUEST'}
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                setActiveTicket(null);
                setViewState('list');
              }}
            className="w-full py-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-center border transition-all bg-zinc-50 border-zinc-150 hover:bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:border-zinc-850 dark:hover:bg-zinc-800 dark:text-zinc-450"
            >
              CLOSE CASE VIEWER
            </button>
          </aside>

          {/* Right Column: Message thread and reply field */}
          <main className="lg:col-span-8 space-y-6">
            
            {/* Conversations container */}
            <div className="rounded-2xl border flex flex-col min-h-[400px] max-h-[500px] overflow-hidden bg-white border-zinc-200 text-zinc-900 dark:bg-zinc-950 dark:border-zinc-900 dark:text-white">
              
              {/* Message Feed list */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 font-normal scrollbar-thin scrollbar-thumb-zinc-800 scroll-thin">
                <div className="p-4 rounded-xl text-xs text-center border bg-zinc-50 border-zinc-100 text-zinc-500 dark:bg-zinc-900/40 dark:border-zinc-900 dark:text-zinc-500">
                  🔒 Security-Escrow Chat Session Started. Conversation logs are securely encrypted.
                </div>

                {messages.map((msg) => {
                  const isSenderSelf = msg.userId === user?._id;
                  return (
                    <div 
                      key={msg._id} 
                      className={`flex flex-col max-w-[85%] space-y-1 ${
                        isSenderSelf ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 font-bold">
                        {/* <span>Done Joy</span> */}
                        {msg.role === 'admin' && (
                          <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1 py-0.2 rounded text-[8px] uppercase font-mono tracking-widest font-black">
                            STAFF
                          </span>
                        )}
                        <span>{format(new Date(msg?.createdAt), 'HH:mm')}</span>
                      </div>
                      
                      <div className={`p-3.5 rounded-2xl text-xs leading-relaxed text-left font-sans select-text pointer-events-auto ${
  isSenderSelf
    ? 'bg-emerald-500 text-white dark:bg-emerald-600'
    : 'bg-zinc-100 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-100 dark:border dark:border-zinc-800'
}`}>
                        {msg?.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Reply text field */}
              <div className="p-4 border-t bg-zinc-50 border-zinc-100 dark:bg-zinc-950/70 dark:border-zinc-900">
                {activeTicket?.status === 'closed' ? (
                  <div className="p-3 text-center text-xs font-bold font-mono uppercase bg-zinc-100 dark:bg-zinc-900/20 text-zinc-500 rounded-xl border border-zinc-900/30">
                    This support case is closed. You can no longer send messages.
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                    <input 
                      type="text"
                      required
                      placeholder="Input message reply payload..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl text-xs outline-none border transition-all bg-white border-zinc-200 text-zinc-950 focus:border-black dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:border-zinc-700"
                    />
                    <button
                      type="submit"
                      disabled={isSendingMessage || !replyText.trim()}
                      className={`p-3 rounded-xl shrink-0 transition-all ${
  isSendingMessage || !replyText.trim()
    ? 'opacity-40 cursor-not-allowed'
    : ''
} bg-emerald-500 hover:bg-emerald-600 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500`}
                      title="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>

            </div>
          </main>
        </div>
      )}
    </div>
  );
};
