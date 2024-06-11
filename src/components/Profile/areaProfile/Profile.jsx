import React, { useState } from 'react';
import styles from './Profile.module.scss';
import { useUser } from '../../../context/UserContext'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { FormGroup, Switch, Stack, Typography } from '@mui/material';
import { useUserInfos } from '../../../hooks/userInfos'

const Profile = () => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL
  const auth = useAuthUser();
  const emailUserConnected = auth?.email;
  const { username, initials } = useUserInfos();
  const { userID, superUser, setSuperUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState(false);
  const [isSuperUserChecked, setIsSuperUserChecked] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    setIsSuperUserChecked(e.target.checked);
  };

  const isSkemaEmail = (email) => {
    const skemaEmailRegex = /@skema\.edu$/;
    return skemaEmailRegex.test(email);
  };
  const handleConfirmClick = async () => {
    if (isSkemaEmail(email)){
      try {
        const response = await fetch(`${baseUrl}/user/${email}/superUser`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ superUser: isSuperUserChecked }),
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log('Modification successful:', data);
  
        // Update superUser state
        if(emailUserConnected === email){
          setSuperUser(isSuperUserChecked);
        }
  
        // Reset state after modification
        setIsEditing(false);
        setEmail('');
      } catch (error) {
        console.error('Error modifying superUser:', error);
      }
    }else {
      setErrorMessage('Email format is incorrect');
    }
  };

  return (
    <div className={styles['profile-container']}>
      <div className={styles['profile-header']}>
        <h2>Admin Privileges</h2>
        {superUser ? (
          <p>Super</p>
        ) : (
          <p>Regular</p>
        )}
        <center><div className={styles['profile-initials']}>{initials}</div></center>
        <p><strong>{username}</strong></p>
      </div>
      <div className={styles['main-profile']}>
        <div className={styles['profile-info']}>
            {superUser ? (
              <>
              <p>
                You are a professor with full privileges.
              </p>
              <p>
                You have access to all features, including deleting VectorStores.
              </p>
              </>
            ) : (
              <>
              <p>
                You are a professor with restricted privileges.
              </p>
              <p>
                You cannot delete VectorStores.
              </p>
              </>
            )}
          
        </div>
        <div className={styles['edit-container']}>
        {superUser && (
          <div className={styles['edit-container']}>
            <p>Modify a super user</p>
            {!isEditing ? (
              <button className={styles['edit-button']} onClick={handleEditClick}>
                ➕
              </button>
            ) : (
              <div className={styles['edit-form']}>
                <input
                  type="email"
                  placeholder="Email de l'utilisateur"
                  value={email}
                  onChange={handleInputChange}
                />
                {errorMessage && <div className={styles['errorMessage']}>{errorMessage}</div>}
                <div className={styles['checkbox-container']}>
                  <FormGroup>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography>{false.toString()}</Typography>
                      <Switch checked={isSuperUserChecked} onChange={handleCheckboxChange} />
                      <Typography>{true.toString()}</Typography>
                    </Stack>
                  </FormGroup>
                </div>
                <button className={styles['confirm-button']} onClick={handleConfirmClick}>
                  Confirm the modification
                </button>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default Profile