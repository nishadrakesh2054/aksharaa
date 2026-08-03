const EmptyState = ({ message = "No data found." }) => (
  <div className="text-center text-muted py-4">
    {message}
  </div>
);

export default EmptyState;
