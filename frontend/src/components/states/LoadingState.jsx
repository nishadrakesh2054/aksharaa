import Loader from "../Loader";

const LoadingState = ({ label = "Loading..." }) => (
  <div className="text-center py-4">
    <Loader />
    <p className="text-muted small mt-2 mb-0">{label}</p>
  </div>
);

export default LoadingState;
