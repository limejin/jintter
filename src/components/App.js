import { useState, useEffect } from 'react';
import AppRouter from 'components/Router';
import { authService } from '../fbase';
import { updateEmail } from 'firebase/auth';
const App = () => {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj({
          email: user.email,
          uid: user.uid,
          updateEmail: (args) => updateEmail(user, { email: user.email }),
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    setUserObj(authService.currentUser);
  };
  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        'Initializing....'
      )}
      <footer>&copy; {new Date().getFullYear()} Jintter </footer>
    </>
  );
};

export default App;
