import Jweet from 'components/Jweet';
import { dbService } from 'fbase';

import styled from '@emotion/styled';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import {
  collection,
  getDocs,
  query,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import JweetFactory from 'components/JweetFactory';

const Home = ({ userObj }) => {
  const [jweets, setJweets] = useState([]);

  const getJweets = async () => {
    const q = query(collection(dbService, 'jweets'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const jweetObj = {
        ...doc.data(),
        id: doc.id,
      };
      setJweets((prev) => [jweetObj, ...prev]);
    });
  };

  useEffect(() => {
    getJweets();
    const q = query(
      collection(dbService, 'jweets'),
      orderBy('createdAt', 'desc'),
    );
    onSnapshot(q, (snapshot) => {
      const jweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJweets(jweetArr);
    });
    return () => setJweets([]);
  }, []);

  return (
    <>
      <Container>
        <JweetFactory userObj={userObj} />
        <JweetContainer>
          {jweets.map((jweet) => (
            <Jweet
              key={jweet.id}
              jweetObj={jweet}
              isOwner={jweet.creatorId === userObj.uid}
            />
          ))}
        </JweetContainer>
      </Container>
    </>
  );
};
export default Home;

const Container = styled.div`
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
`;

const JweetContainer = styled.div`
  margintop: 30;
`;
