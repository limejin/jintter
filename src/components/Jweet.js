import { dbService, storageService } from 'fbase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';

const Jweet = ({ jweetObj, isOwner }) => {
  const [editing, setEditng] = useState(false);
  const [newJweet, setNewJweet] = useState(jweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure?');
    if (ok) {
      const JweetTextRef = doc(dbService, 'jweets', `${jweetObj.id}`);
      await deleteDoc(JweetTextRef);
      if (jweetObj.attachmentUrl !== '') {
        await storageService.refFromURL(jweetObj.attachmentUrl).delete();
      }
    }
  };

  const toggleEditing = () => setEditng((prev) => !prev);

  const onSubmit = async (event) => {
    event.preventDefault();
    const JweetTextRef = doc(dbService, 'jweets', `${jweetObj.id}`);
    await updateDoc(JweetTextRef, {
      text: newJweet,
    });
    setEditng(false);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewJweet(value);
  };

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              onChange={onChange}
              type="text"
              placeholder="Edit"
              value={newJweet}
              required
            />
            <input type="submit" value="Update jweet" />
          </form>

          <button onClick={toggleEditing}>Cacel</button>
        </>
      ) : (
        <>
          <h4>{jweetObj.text}</h4>
          {jweetObj.attachmentUrl && (
            <img src={jweetObj.attachmentUrl} width="50px" heigh="50px" />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Jweet</button>
              <button onClick={toggleEditing}>Edit Jweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Jweet;
