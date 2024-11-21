import { useNavigate, useParams, ParamMap } from 'react-router-dom';

interface WithRouterProps {
  params: ParamMap; // type for params returned by useParams
  navigate: (path: string) => void; // type for navigate function from useNavigate
}

export const withRouter = <P extends object>(
  WrappedComponent: React.ComponentType<P & WithRouterProps>
) => {
  return (props: P) => {
    const params = useParams<ParamMap>();  // `useParams` returns an object where keys are strings and values are strings | undefined
    const navigate = useNavigate();  // `useNavigate` gives us a function to navigate to different paths

    return <WrappedComponent {...props} params={params} navigate={navigate} />;
  };
};
