import React from 'react';
import { ListItem, Typography } from '@material-ui/core';

import LockClosedIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import UpdateIcon from '@material-ui/icons/Create';

import './ListSavedQuizzes.css';

const formatDate = date => date.split('T')[0];

const ListSavedQuizzes = ({ group, selectGroup, editGroup }) => {
  return (
    <ListItem
      style={{
        display: 'flex',
        cursor: 'pointer',
        maxWidth: '500px',
        background: '#fffaf0',
        padding: '8px 16px',
        margin: '8px auto',
        borderRadius: '8px'
      }}
    >
      <div
        onClick={selectGroup}
        style={{ display: 'block', cursor: 'pointer', width: '100%' }}
      >
        <Typography style={{ color: '#581845' }}>{`${group.title}`}</Typography>
        <Typography
          style={{ opacity: '0.7' }}
        >{`Questions: ${group.count}`}</Typography>
        <Typography style={{ color: '#777777', opacity: '0.7' }}>
          {`Created: ${formatDate(group.createdDate)}`}
        </Typography>
        {group.lastEditedDate && (
          <Typography style={{ color: '#777777', opacity: '0.7' }}>
            {`Last Edited: ${formatDate(group.lastEditedDate)}`}
          </Typography>
        )}
      </div>
      <div
        onClick={selectGroup}
        style={{ color: '#581845', padding: '0 12px' }}
      >
        {group.isPublic ? <LockOpenIcon /> : <LockClosedIcon />}
      </div>
      <div
        className="edit-icon"
        onClick={editGroup}
        style={{
          color: '#581845',
          paddingLeft: '12px',
          opacity: '0.8',
          borderLeft: '1px solid #581845cc'
        }}
      >
        <UpdateIcon />
      </div>
    </ListItem>
  );
};

export default ListSavedQuizzes;
