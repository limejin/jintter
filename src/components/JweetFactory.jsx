import React, { useRef, useState } from 'react';

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

import { storageService, dbService } from 'fbase';
import { ref, uploadString, getDownloadURL } from '@firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection } from 'firebase/firestore';

const JweetFactory = ({ userObj }) => {
  const [jweet, setJweet] = useState('');
  const [attachment, setAttachment] = useState('');

  const fileInput = useRef();

  const onSubmit = async (e) => {
    e.preventDefault();

    let attachmentUrl = '';

    if (attachment !== '') {
      // 파일 경로 참조 만들기
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);

      //storage 참조 경로 파일 업로드
      const uploadFile = await uploadString(
        attachmentRef,
        attachment,
        'data_url',
      );

      attachmentUrl = await getDownloadURL(uploadFile.ref);
    }

    const docRef = await addDoc(collection(dbService, 'jweets'), {
      text: jweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    });

    setJweet('');
    setAttachment('');
  };

  const onChange = ({ target: { value } }) => {
    setJweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFIle = files[0];
    const reader = new FileReader();

    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;

      setAttachment(result);
    };

    reader.readAsDataURL(theFIle);
  };

  const onClearAttachment = () => {
    setAttachment('');
    fileInput.current.value = null;
  };

  return (
    <>
      <FactoryForm onSubmit={onSubmit}>
        <FactoryInputContainer>
          <FactoryInput
            value={jweet}
            onChange={onChange}
            type="text"
            placeholder="What's on your mind?"
            maxLength={120}
          />
          <FactoryInputArrow type="submit" value="jweet" />
        </FactoryInputContainer>

        <label htmlFor="attach-file" css={factoryInput__label}>
          <Add>Add photos</Add>
          <FontAwesomeIcon icon={faPlus} />
        </label>

        <AttachInput
          id="attach-file"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
        />

        {attachment && (
          <FactoryFormAttachment>
            <FactoryFormAttachmentImage src={attachment} alt="profile" />
            <FactoryFormClear onClick={onClearAttachment}>
              <RemoveSpan>Remove</RemoveSpan>
              <FontAwesomeIcon icon={faTimes} />
            </FactoryFormClear>
          </FactoryFormAttachment>
        )}
      </FactoryForm>
    </>
  );
};

export default JweetFactory;

const FactoryForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const FactoryInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
  margin-bottom: 20px;
  width: 100%;
`;

const FactoryInput = styled.input`
  flex-grow: 1;
  height: 40px;
  padding: 0px 20px;
  border: 1px solid #04aaff;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: white;
`;

const FactoryInputArrow = styled.input`
  position: absolute;
  right: 0;
  height: 40px;
  width: 40px;
  padding: 10px 0px;
  border-radius: 20px;
  box-sizing: border-box;
  background-color: #04aaff;
  color: white;
  text-align: center;
`;

const Add = styled.span`
  margin-right: 10px;
  font-size: 12px;
  color: #04aaff;
  cursor: pointer;
`;

const AttachInput = styled.input`
  opacity: 0;
`;

const FactoryFormAttachment = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FactoryFormAttachmentImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-image: attachment;
`;
const FactoryFormClear = styled.div`
  color: #04aaff;
  text-align: center;
  cursor: pointer;
`;

const RemoveSpan = styled.span`
  margin-right: 10px;
  font-size: 12px;
`;

const factoryInput__label = css`
  color: #04aaff;
  cursor: pointer;
`;
