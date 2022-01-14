import React, { useState } from 'react';

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import { dbService, storageService } from 'fbase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from '@firebase/storage';

const Jweet = ({ jweetObj, isOwner }) => {
  const [editing, setEditng] = useState(false);
  const [newJweet, setNewJweet] = useState(jweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure?');

    if (ok) {
      const JweetTextRef = doc(dbService, 'jweets', `${jweetObj.id}`);

      await deleteDoc(JweetTextRef);

      if (jweetObj.attachmentUrl !== '') {
        await deleteObject(ref(storageService, jweetObj.attachmentUrl));
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
    <JweetContainer>
      {editing ? (
        <>
          <FormEdit onSubmit={onSubmit}>
            <FormInput
              onChange={onChange}
              type="text"
              placeholder="Edit your jweet"
              value={newJweet}
              required
              autoFocus
            />
            <input type="submit" value="Update jweet" css={formButton} />
          </FormEdit>

          <span onClick={toggleEditing} css={cancelButton}>
            Cancel
          </span>
        </>
      ) : (
        <>
          <JweetText>{jweetObj.text}</JweetText>
          {jweetObj.attachmentUrl && (
            <ContainerImg src={jweetObj.attachmentUrl} />
          )}
          {isOwner && (
            <>
              <JweetActions>
                <Pointer onClick={onDeleteClick}>
                  <FontAwesomeIcon icon={faTrash} />
                </Pointer>
                <Pointer onClick={toggleEditing}>
                  <FontAwesomeIcon icon={faPencilAlt} />
                </Pointer>
              </JweetActions>
            </>
          )}
        </>
      )}
    </JweetContainer>
  );
};

export default Jweet;

const JweetContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  max-width: 320px;
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  color: rgba(0, 0, 0, 0.8);
`;

const JweetText = styled.h4`
  font-size: 14px;
`;

const ContainerImg = styled.img`
  position: absolute;
  top: 20px;
  right: -10px;
  width: 50px;
  height: 50px;
  margin-top: 10px;
  border-radius: 50%;
`;

const FormEdit = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 320px;
  margin-top: 15px;
  margin-bottom: 5px;
  cursor: pointer;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px 20px;
  border: 1px solid black;
  border-radius: 20px;
  background-color: white;
  color: black;
  text-align: center;
`;

const JweetActions = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const Pointer = styled.span`
  cursor: pointer;
`;

const formButton = css`
  width: 100%;
  padding: 7px 20px;
  border-radius: 20px;
  background-color: #04aaff;
  color: white;
  cursor: pointer;
  text-align: center;
`;

const cancelButton = css`
  width: 100%;
  padding: 7px 20px;
  border-radius: 20px;
  background-color: tomato;
  text-align: center;
  color: white;
  cursor: pointer;
`;
