import React, { useState } from 'react';

import styled from '@emotion/styled';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';

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

      newAccount
        ? (data = await createUserWithEmailAndPassword(auth, email, password))
        : (data = await signInWithEmailAndPassword(auth, email, password));
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

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Container = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 320px;
`;

const AuthInput = styled.input`
  width: 100%;
  max-width: 320px;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 30px;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 1);
  font-size: 12px;
  color: black;
`;

const AuthSubmit = styled.input`
  width: 100%;
  max-width: 320px;
  margin-bottom: 10px;
  margin-top: 10px;
  padding: 10px;
  border-radius: 30px;
  background-color: #04aafe;
  font-size: 12px;
  color: white;
  text-align: center;
  cursor: pointer;
`;

const AuthError = styled.span`
  font-weight: 500;
  font-size: 12px;
  color: tomato;
  text-align: center;
`;

const AuthSwitch = styled.span`
  display: block;
  margin-top: 10px;
  margin-bottom: 50px;
  font-size: 12px;
  color: #04aaff;
  text-decoration: underline;
  cursor: pointer;
`;

export default Auth;
