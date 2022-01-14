import React, { useState } from 'react';

import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faGoogle,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const toggleAccount = () => setNewAccount((prev) => !prev);

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const auth = getAuth();
    try {
      let data;
      if (newAccount) {
        data = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        data = await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <AuthContainer>
        <FontAwesomeIcon
          icon={faTwitter}
          color={'#04AAFF'}
          size="3x"
          style={{ marginBottom: 30 }}
        />
        <Container onSubmit={onSubmit}>
          <AuthInput
            name="email"
            type="text"
            placeholder="Email"
            required
            value={email}
            onChange={onChange}
          />
          <AuthInput
            name="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={onChange}
          />
          <AuthSubmit
            type="submit"
            value={newAccount ? 'Create Account' : 'Log In'}
          />
          <AuthError>{error}</AuthError>
        </Container>
        <AuthSwitch onClick={toggleAccount}>
          {newAccount ? 'Sign in' : 'Create Account'}
        </AuthSwitch>
      </AuthContainer>
    </>
  );
};

export default Auth;

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const Container = styled.form`
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
`;

const AuthInput = styled.input`
  max-width: 320px;
  width: 100%;
  padding: 10px;
  border-radius: 30px;
  background-color: rgba(255, 255, 255, 1);
  margin-bottom: 10px;
  font-size: 12px;
  color: black;
  box-sizing: content-box;
`;

const AuthSubmit = styled.input`
  max-width: 320px;
  width: 100%;
  padding: 10px;
  border-radius: 30px;
  background-color: rgba(255, 255, 255, 1);
  margin-bottom: 10px;
  font-size: 12px;

  text-align: center;
  background: #04aaff;
  color: white;
  margin-top: 10px;
  cursor: pointer;
`;

const AuthError = styled.span`
  color: tomato;
  text-align: center;
  font-weight: 500;
  font-size: 12px;
`;

const AuthSwitch = styled.span`
  color: #04aaff;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 50px;
  display: block;
  font-size: 12px;
  text-decoration: underline;
`;
