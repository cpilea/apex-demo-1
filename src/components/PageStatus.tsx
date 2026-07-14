type StatusProps = {
  title: string;
  message: string;
  action?: React.ReactNode;
};

export function ErrorState({ title, message, action }: StatusProps) {
  return (
    <section className="status-card status-card-error" role="alert" aria-live="polite">
      <h2 className="status-title">{title}</h2>
      <p className="status-message">{message}</p>
      {action ? <div className="status-action">{action}</div> : null}
    </section>
  );
}

export function EmptyState({ title, message, action }: StatusProps) {
  return (
    <section className="status-card" aria-live="polite">
      <h2 className="status-title">{title}</h2>
      <p className="status-message">{message}</p>
      {action ? <div className="status-action">{action}</div> : null}
    </section>
  );
}

export function LoadingState({ title, message }: Omit<StatusProps, "action">) {
  return (
    <section className="status-card" aria-live="polite" aria-busy="true">
      <div className="status-spinner" aria-hidden="true" />
      <h2 className="status-title">{title}</h2>
      <p className="status-message">{message}</p>
    </section>
  );
}