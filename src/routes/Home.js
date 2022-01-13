import Jweet from 'components/Jweet';
import { dbService } from 'fbase';

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
      <div>
        <JweetFactory userObj={userObj} />
        <div>
          {jweets.map((jweet) => (
            <Jweet
              key={jweet.id}
              jweetObj={jweet}
              isOwner={jweet.creatorId === userObj.uid}
            />
          ))}
        </div>
      </div>
    </>
  );
};
export default Home;
