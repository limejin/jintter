import React from 'react';

import { Link } from 'react-router-dom';

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const NavListigation = ({ userObj }) => {
  return (
    <>
      <nav>
        <Container>
          <Link to="/" css={LinkToHome}>
            <FontAwesomeIcon icon={faTwitter} color={'#04AAFF'} size="2x" />
          </Link>
          <Link to="/profile" css={LinkToProfile}>
            <FontAwesomeIcon icon={faUser} color={'#04AAFF'} size="2x" />
            <UserEmail> {userObj.email}'s Profile</UserEmail>
          </Link>
        </Container>
      </nav>
    </>
  );
};

const Container = styled.ul`
  display: 'flex';
  justify-content: 'center';
  margin-top: 50px;
`;

const LinkToHome = css`
  margin-right: 10px;
`;

const LinkToProfile = css`
  display: 'flex';
  flex-direction: 'column';
  margin-left: 10px;
  align-items: 'center';
  font-size: 12px;
`;

const UserEmail = styled.span`
  margin-top: 10px;
`;

export default NavListigation;
