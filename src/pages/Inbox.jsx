import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  subscribeToMessages,
  updateMessageStatus,
  convertMessageToClient,
  deleteMessage,
} from "../services/messageService";
import {
  Mail,
  Archive,
  UserPlus,
  MessageSquare,
  Search,
  Filter,
  Trash2,
} from "lucide-react";

const formatAnswer = (value) => {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "N/A";
  return value || "N/A";
};

const getProjectBriefFields = (message) => [
  ["Project Type", message.projectType],
  ["Timeline", message.timeline],
  ["Budget", message.budget],
  ["Current Website", message.currentWebsite],
  ["Pages Needed", message.pages],
  ["Features Needed", message.features],
  ["Main Goal", message.mainGoal || message.message],
  ["Target Audience", message.targetAudience],
  ["Design Style", message.designStyle],
  ["References", message.references],
  ["Content Readiness", message.contentReadiness],
  ["Extra Notes", message.extraNotes],
];

const Inbox = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState("all"); // all, unread, contact, brief, archived
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToMessages((data) => {
      setMessages(data);
      setSelectedMessage((current) => {
        if (data.length === 0) return null;
        if (!current) return data[0];
        return data.find((msg) => msg.id === current.id) || data[0];
      });
    });
    return () => unsubscribe();
  }, []);

  const handleSelectMessage = (msg) => {
    setSelectedMessage(msg);
    if (msg.status === "unread") {
      updateMessageStatus(msg.id, "read", currentUser.uid);
    }
  };

  const handleStatusChange = async (msgId, status) => {
    setLoadingAction(true);
    try {
      await updateMessageStatus(msgId, status, currentUser.uid);
    } catch (err) {
      console.error("Failed to update message status:", err);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleConvertToClient = async (msg) => {
    setLoadingAction(true);
    try {
      await convertMessageToClient(msg, currentUser.uid);
      alert("Message successfully converted to Client record!");
    } catch (err) {
      console.error("Failed to convert message:", err);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteMessage = async (msg) => {
    if (!window.confirm(`Delete message from ${msg.name || msg.email || "this sender"}?`)) return;

    setLoadingAction(true);
    try {
      await deleteMessage(msg.id, currentUser.uid);
      setSelectedMessage((current) => (current?.id === msg.id ? null : current));
    } catch (err) {
      console.error("Failed to delete message:", err);
      alert("Failed to delete message");
    } finally {
      setLoadingAction(false);
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "unread") return msg.status === "unread";
    if (filter === "contact") return msg.type === "contact" || !msg.type;
    if (filter === "brief") return msg.type === "project_brief";
    if (filter === "archived") return msg.status === "archived";

    return msg.status !== "archived"; // Default hides archived
  });

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Inbox
            {unreadCount > 0 && (
              <span className="text-xs bg-brand-accent text-slate-950 font-bold px-2.5 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage contact inquiries and project brief submissions
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-brand-card border border-brand-border rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-accent"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-border pb-3 overflow-x-auto">
        <Filter className="w-4 h-4 text-slate-500 shrink-0" />
        {[
          { id: "all", label: "All Messages" },
          { id: "unread", label: "Unread" },
          { id: "brief", label: "Project Briefs" },
          { id: "contact", label: "Contact Inquiries" },
          { id: "archived", label: "Archived" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              filter === tab.id
                ? "bg-brand-accent/20 text-brand-accent border border-brand-accent/30"
                : "text-slate-400 hover:bg-brand-card"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Inbox Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 min-h-125">
        {/* Messages List Column */}
        <div className="lg:col-span-5 bg-brand-card border border-brand-border rounded-xl divide-y divide-brand-border overflow-hidden">
          {filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No messages found.</p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleSelectMessage(msg)}
                className={`p-4 cursor-pointer transition ${
                  selectedMessage?.id === msg.id
                    ? "bg-brand-border/40 border-l-4 border-l-brand-accent"
                    : "hover:bg-brand-border/20"
                }`}
              >
                <div className="flex items-center justify-between mb-1 gap-2">
                  <span className="font-medium text-white text-sm truncate">
                    {msg.name || "Anonymous"}
                  </span>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">
                    {msg.createdAt?.toDate
                      ? new Date(msg.createdAt.toDate()).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })
                      : "Recent"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium truncate mb-1">
                  {msg.subject ||
                    (msg.type === "project_brief"
                      ? "New Project Brief"
                      : "Contact Submission")}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      msg.type === "project_brief"
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}
                  >
                    {msg.type === "project_brief"
                      ? "Project Brief"
                      : "Contact Form"}
                  </span>
                  {msg.status === "unread" && (
                    <span className="w-2 h-2 rounded-full bg-brand-accent"></span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Detail View Column */}
        <div className="lg:col-span-7 bg-brand-card border border-brand-border rounded-xl p-4 sm:p-6">
          {selectedMessage ? (
            <div className="space-y-6">
              {/* Header Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs px-2.5 py-1 bg-brand-border/50 text-slate-300 rounded font-mono uppercase">
                    {selectedMessage.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedMessage.status !== "converted" && (
                    <button
                      disabled={loadingAction}
                      onClick={() => handleConvertToClient(selectedMessage)}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 sm:py-1.5 bg-brand-accent text-slate-950 rounded hover:bg-sky-400 transition"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Convert to Client
                    </button>
                  )}
                  <button
                    disabled={loadingAction}
                    onClick={() =>
                      handleStatusChange(
                        selectedMessage.id,
                        selectedMessage.status === "archived"
                          ? "read"
                          : "archived",
                      )
                    }
                    className="p-2 sm:p-1.5 text-slate-400 hover:text-white bg-brand-border/30 hover:bg-brand-border rounded transition"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <button
                    disabled={loadingAction}
                    onClick={() => handleDeleteMessage(selectedMessage)}
                    className="p-2 sm:p-1.5 text-slate-400 hover:text-red-300 bg-brand-border/30 hover:bg-red-500/10 rounded transition"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Details */}
              <div>
                <h2 className="text-lg font-bold text-white mb-1">
                  {selectedMessage.subject ||
                    (selectedMessage.type === "project_brief"
                      ? "Project Brief Inquiry"
                      : "Contact Submission")}
                </h2>
                <div className="text-xs text-slate-400 space-y-1 mt-2">
                  <p>
                    <strong className="text-slate-300">From:</strong>{" "}
                    <span className="break-words">{selectedMessage.name}</span>{" "}
                    <span className="break-all">({selectedMessage.email})</span>
                  </p>
                  {selectedMessage.phone && (
                    <p>
                      <strong className="text-slate-300">Phone:</strong>{" "}
                      {selectedMessage.phone}
                    </p>
                  )}
                  {selectedMessage.businessName && (
                    <p>
                      <strong className="text-slate-300">Business:</strong>{" "}
                      {selectedMessage.businessName}
                    </p>
                  )}
                  <p>
                    <strong className="text-slate-300">Received:</strong>{" "}
                    {selectedMessage.createdAt?.toDate
                      ? new Date(
                          selectedMessage.createdAt.toDate(),
                        ).toLocaleString()
                      : "Just now"}
                  </p>
                </div>
              </div>

              {/* Message Content */}
              <div className="p-4 bg-brand-dark/50 border border-brand-border rounded-lg text-sm text-slate-300 space-y-3">
                {selectedMessage.type === "project_brief" ? (
                  <div className="grid grid-cols-1 gap-3">
                    {getProjectBriefFields(selectedMessage).map(
                      ([label, value]) => (
                        <div
                          key={label}
                          className="rounded-lg border border-brand-border/70 bg-brand-dark/40 p-3"
                        >
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            {label}
                          </p>
                          <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-200">
                            {formatAnswer(value)}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">
                    {selectedMessage.message || "No body provided."}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12">
              <MessageSquare className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-sm">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;
