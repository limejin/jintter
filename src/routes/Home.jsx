import React, { useState, useEffect } from 'react';

import { dbService } from 'fbase';
import {
  collection,
  getDocs,
  query,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';

import styled from '@emotion/styled';

import JweetFactory from 'components/JweetFactory';
import Jweet from 'components/Jweet';

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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 320px;
`;

const JweetContainer = styled.div`
  margin-top: 30;
`;

export default Home;
