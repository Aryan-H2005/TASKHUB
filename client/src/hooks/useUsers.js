import { useState, useEffect } from 'react';
import api from '../services/api';

// Loads the list of users for the "Assigned user" dropdown
export default function useUsers() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    let active = true;
    api.get('/users').then((res) => active && setUsers(res.data)).catch(() => {});
    return () => { active = false; };
  }, []);
  return users;
}
