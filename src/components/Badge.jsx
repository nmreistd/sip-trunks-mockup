export function Badge({ children, variant = 'gray', className = '' }) {
  const variants = {
    green: 'bg-green-100 text-green-700 border border-green-200',
    yellow: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    red: 'bg-red-100 text-red-700 border border-red-200',
    blue: 'bg-blue-100 text-blue-700 border border-blue-200',
    purple: 'bg-td-purple-light text-td-purple border border-td-purple-border',
    gray: 'bg-gray-100 text-gray-600 border border-gray-200',
    orange: 'bg-orange-100 text-orange-700 border border-orange-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    active: { label: 'Active', variant: 'green' },
    pending: { label: 'Pending', variant: 'yellow' },
    suspended: { label: 'Suspended', variant: 'red' },
    deleted: { label: 'Deleted', variant: 'gray' },
  };
  const { label, variant } = map[status] || { label: status, variant: 'gray' };
  return <Badge variant={variant}>{label}</Badge>;
}

export function ModeBadge({ mode }) {
  return (
    <Badge variant={mode === 'registered' ? 'purple' : 'blue'}>
      {mode === 'registered' ? 'Registered' : 'Static IP'}
    </Badge>
  );
}

export function TransportBadge({ transport }) {
  const map = { TLS: 'blue', TCP: 'gray', UDP: 'orange' };
  return <Badge variant={map[transport] || 'gray'}>{transport}</Badge>;
}

export function RegionBadge({ region }) {
  return <Badge variant="gray" className="font-mono">{region}</Badge>;
}
