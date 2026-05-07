interface StatusDotProps {
  status: 'good' | 'warning' | 'alert';
  label?: string;
}

export function StatusDot({ status, label }: StatusDotProps) {
  const colors = {
    good: 'bg-success',
    warning: 'bg-warning',
    alert: 'bg-destructive',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${colors[status]} animate-pulse`} />
      {label && <span className="text-sm text-gray-600">{label}</span>}
    </div>
  );
}
