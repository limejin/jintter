import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { React, useState } from 'react';

import { collection, getDocs, query, where } from '@firebase/firestore';
import { dbService, authService } from 'fbase';
import { updateEmail } from 'firebase/auth';
import styled from '@emotion/styled';

const Profile = ({ refreshUser, userObj }) => {
  const [newEmail, setNewEmail] = useState(userObj.email);
  const history = useHistory();

  const onLogOutClick = () => {
    authService.signOut();
    history.push('/');
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewEmail(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (newEmail !== '') {
      if (userObj.email !== newEmail) {
        await updateEmail(authService.currentUser, newEmail)
          .then(() => {})
          .catch((error) => {});
        refreshUser();
      }
    }
  };

  const getMyJweets = async () => {
    const q = query(
      collection(dbService, 'jweets'),
      where('creatorId', '==', `${userObj.uid}`),
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {});
  };

  return (
    <>
      <Container>
        <ProfileForm onSubmit={onSubmit}>
          <ProfileFormInput
            onChange={onChange}
            type="text"
            placeholder="Display name"
            autoFocus
            value={newEmail}
          />
          <ProfileFormButton type="submit" value="Update Profile" />
        </ProfileForm>

        <LogOutButton
          className="formBtn cancelBtn logOut"
          onClick={onLogOutClick}
        >
          Log Out
        </LogOutButton>
      </Container>
    </>
  );
};
export default Profile;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 320px;
`;

const ProfileForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.9);
`;

const ProfileFormInput = styled.input`
  width: 100%;
  padding: 10px 20px;
  border-radius: 20px;
  border: 1px solid black;
  background-color: white;
  text-align: center;
  color: black;
`;

const ProfileFormButton = styled.input`
  width: 100%;
  margin-top: 10px;
  padding: 7px 20px;
  border-radius: 20px;
  background-color: #04aaff;
  cursor: pointer;
  text-align: center;
  color: white;
`;

const LogOutButton = styled.span`
  width: 100%;
  margin-top: 50px;
  margin-bottom: 5px;
  padding: 7px 20px;
  border-radius: 20px;
  background-color: tomato;
  cursor: pointer;
  text-align: center;
  color: white;
`;
