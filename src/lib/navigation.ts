import { useNavigate } from 'react-router-dom';

export function registerAutoAdvance(_route: string, advance: () => void, delay = 1) {
  const timer = window.setTimeout(advance, delay);
  return () => window.clearTimeout(timer);
}

export function useAppNavigation() {
  const navigate = useNavigate();

  return {
    navigate: (path: string, options?: { replace?: boolean; state?: any }) => {
      navigate(path, options);
    },
    goBack: () => {
      navigate(-1);
    }
  };
}
