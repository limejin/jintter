import { storageService, dbService } from 'fbase';
import { ref, uploadString, getDownloadURL } from '@firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection } from 'firebase/firestore';
import React, { useRef, useState } from 'react';

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
      <form onSubmit={onSubmit}>
        <input
          value={jweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
        />
        <input type="submit" value="jweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
    </>
  );
};

export default JweetFactory;
