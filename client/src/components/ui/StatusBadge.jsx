import React from 'react';

const statusConfig = {
  pending:     { label: 'Pending',     dot: 'bg-warning',  text: 'text-warning',  bg: 'bg-warning/10  border-warning/20' },
  accepted:    { label: 'Accepted',    dot: 'bg-accent',   text: 'text-accent',   bg: 'bg-accent/10   border-accent/20' },
  confirmed:   { label: 'Confirmed',   dot: 'bg-accent-2', text: 'text-accent-2', bg: 'bg-accent-2/10 border-accent-2/20' },
  in_progress: { label: 'In Progress', dot: 'bg-purple-400',text: 'text-purple-400',bg:'bg-purple-500/10 border-purple-500/20'},
  completed:   { label: 'Completed',   dot: 'bg-success',  text: 'text-success',  bg: 'bg-success/10  border-success/20' },
  cancelled:   { label: 'Cancelled',   dot: 'bg-text-muted',text:'text-text-muted',bg:'bg-bg-surface-2  border-border-color'},
  rejected:    { label: 'Rejected',    dot: 'bg-danger',   text: 'text-danger',   bg: 'bg-danger/10   border-danger/20' },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
