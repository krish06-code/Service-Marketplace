import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Search, CalendarCheck, MessageSquare, Heart, Star, User, Settings, Send, MessageCircle } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { messageAPI } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const customerSidebar = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: Search, label: 'Find Services', href: '/services' },
  { icon: CalendarCheck, label: 'My Bookings', href: '/dashboard/bookings' },
  { icon: MessageSquare, label: 'Messages', href: '/messages' },
  { icon: Heart, label: 'Favourites', href: '/dashboard/favourites' },
  { icon: Star, label: 'My Reviews', href: '/dashboard/reviews' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

const MessagesPage = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const { showToast } = useToast();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    messageAPI.getConversations()
      .then(res => setConversations(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoadingConvs(false));
  }, []);

  useEffect(() => {
    if (!activeConv) return;
    setLoadingMsgs(true);
    messageAPI.getMessages(activeConv._id)
      .then(res => setMessages(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoadingMsgs(false));
    if (socket) socket.emit('join_conversation', activeConv._id);
    messageAPI.markRead(activeConv._id).catch(() => {});
  }, [activeConv, socket]);

  useEffect(() => {
    if (!socket) return;
    const handler = (msg) => {
      if (msg.conversation === activeConv?._id) setMessages(prev => [...prev, msg]);
    };
    socket.on('new_message', handler);
    return () => socket.off('new_message', handler);
  }, [socket, activeConv]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMsg.trim() || !activeConv) return;
    setSending(true);
    try {
      const res = await messageAPI.sendMessage(activeConv._id, { content: newMsg.trim() });
      setMessages(prev => [...prev, res.data.data]);
      setNewMsg('');
      setConversations(prev =>
        prev.map(c => c._id === activeConv._id ? { ...c, lastMessage: newMsg.trim() } : c)
      );
    } catch (e) {
      showToast('error', 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getOtherUser = (conv) => {
    if (!conv?.participants) return null;
    return conv.participants.find(p => p._id !== user?._id);
  };

  const sidebarItems = user?.role === 'provider'
    ? [
        { icon: LayoutDashboard, label: 'Overview', href: '/provider/dashboard' },
        { icon: MessageSquare, label: 'Messages', href: '/messages' },
        { icon: User, label: 'Profile', href: '/provider/profile' },
        { icon: Settings, label: 'Settings', href: '/provider/settings' },
      ]
    : customerSidebar;

  const chatContent = (
    <div className="flex h-[calc(100vh-200px)] gap-0 border border-border-color rounded-xl overflow-hidden">
      {/* Conversations list */}
      <div className={`w-full sm:w-72 shrink-0 border-r border-border-color flex flex-col bg-bg-surface ${activeConv ? 'hidden sm:flex' : 'flex'}`}>
        <div className="p-4 border-b border-border-color">
          <h2 className="font-semibold text-text-primary">Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="flex justify-center p-8"><LoadingSpinner /></div>
          ) : conversations.length === 0 ? (
            <p className="text-text-muted text-sm text-center p-6">No conversations yet</p>
          ) : (
            conversations.map(conv => {
              const other = getOtherUser(conv);
              return (
                <button
                  key={conv._id}
                  onClick={() => setActiveConv(conv)}
                  className={`w-full flex items-center gap-3 p-4 text-left hover:bg-bg-surface-2 transition-colors border-b border-border-color ${activeConv?._id === conv._id ? 'bg-accent/5' : ''}`}
                >
                  <Avatar fallback={other?.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary text-sm truncate">{other?.name || 'Unknown'}</p>
                    <p className="text-text-muted text-xs truncate">{conv.lastMessage || 'Start a conversation'}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className={`flex-1 flex flex-col bg-bg-primary ${!activeConv ? 'hidden sm:flex' : 'flex'}`}>
        {!activeConv ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState icon={MessageCircle} title="Select a conversation" description="Choose a conversation from the left to start chatting." />
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-border-color flex items-center gap-3 bg-bg-surface">
              <button className="sm:hidden text-text-muted mr-1" onClick={() => setActiveConv(null)}>←</button>
              <Avatar fallback={getOtherUser(activeConv)?.name} size="sm" />
              <span className="font-semibold text-text-primary">{getOtherUser(activeConv)?.name}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingMsgs ? (
                <div className="flex justify-center p-8"><LoadingSpinner /></div>
              ) : (
                messages.map((msg, i) => {
                  const isMine = msg.sender?._id === user?._id || msg.sender === user?._id;
                  return (
                    <div key={msg._id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${isMine ? 'bg-accent text-white rounded-br-sm' : 'bg-bg-surface border border-border-color text-text-primary rounded-bl-sm'}`}>
                        {msg.content}
                        <div className={`text-xs mt-1 ${isMine ? 'text-white/60' : 'text-text-muted'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>
            <div className="p-4 border-t border-border-color bg-bg-surface flex gap-2">
              <input
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Type a message..."
                className="input-field flex-1"
              />
              <button
                onClick={sendMessage}
                disabled={sending || !newMsg.trim()}
                className="p-2.5 bg-accent hover:bg-blue-600 text-white rounded-xl disabled:opacity-50 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Messages">
      {chatContent}
    </DashboardLayout>
  );
};

export default MessagesPage;
