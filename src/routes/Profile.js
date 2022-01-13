import { authService } from 'fbase';
import { React, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { collection, getDocs, query, where } from '@firebase/firestore';
import { dbService } from 'fbase';
import { updateEmail } from 'firebase/auth';
const Profile = ({ refreshUser, userObj }) => {
  const history = useHistory();
  const [newEmail, setNewEmail] = useState(userObj.email);
  const onLogOutClick = () => {
    authService.signOut();
    history.push('/');
    refreshUser();
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
          .catch((error) => {
            console.log(error);
          });
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
    querySnapshot.forEach((doc) => {
      console.log(doc.id, ' => ', doc.data());
    });
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newEmail}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};
export default Profile;
