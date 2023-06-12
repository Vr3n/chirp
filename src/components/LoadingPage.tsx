import LoadingSpinner from "./LoadingSpinner";

const LoadingPage = () => {
  return (
    <div className="absolute right-0 top-0 flex h-screen w-screen items-center justify-center align-middle">
      <LoadingSpinner size={80} />
    </div>
  );
};

export default LoadingPage;
