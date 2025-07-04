import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  // Test Firestore connection
  const testFirestoreConnection = useCallback(async () => {
    try {
      console.log('Testing Firestore connection...');
      // Try to read from a simple collection first
      const testQuery = collection(db, 'projects');
      await getDocs(testQuery);
      console.log('Firestore connection successful');
      return true;
    } catch (err) {
      console.error('Firestore connection failed:', err);
      if (err.code === 'permission-denied') {
        setError('Firestore access denied. Please check security rules.');
      } else if (err.code === 'unavailable') {
        setError('Firestore service unavailable. Please try again later.');
      } else {
        setError(`Firestore connection error: ${err.message}`);
      }
      return false;
    }
  }, []);

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    if (!currentUser) {
      console.log('No current user, skipping fetch');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching projects for user:', currentUser.uid);
      setLoading(true);
      setError('');

      // Test connection first
      const connectionOk = await testFirestoreConnection();
      if (!connectionOk) {
        setLoading(false);
        return;
      }

      // Simple query without complex filters first
      const q = query(
        collection(db, 'projects'),
        where('userId', '==', currentUser.uid)
      );

      const querySnapshot = await getDocs(q);
      console.log('Query result:', querySnapshot.size, 'documents');

      let projectsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        console.log('Document data:', data);
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : new Date(data.createdAt),
        };
      });

      // Sort client-side by creation date (newest first)
      projectsData.sort((a, b) => {
        const aDate = a.createdAt || new Date(0);
        const bDate = b.createdAt || new Date(0);
        return bDate - aDate;
      });

      console.log('Processed projects data:', projectsData);
      setProjects(projectsData);
    } catch (err) {
      console.error('Error fetching projects:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);

      if (err.code === 'permission-denied') {
        setError('Permission denied. Please check Firestore security rules.');
      } else if (err.code === 'failed-precondition') {
        setError('Firestore index required. Check console for details.');
      } else if (err.code === 'unavailable') {
        setError('Firestore service unavailable. Please try again later.');
      } else {
        setError(`Failed to fetch projects: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [currentUser, testFirestoreConnection]);

  // Add project
  const addProject = async (projectData) => {
    if (!currentUser) {
      console.log('No current user for adding project');
      return;
    }

    try {
      console.log('Adding project:', projectData, 'for user:', currentUser.uid);

      const projectToAdd = {
        ...projectData,
        userId: currentUser.uid,
        createdAt: serverTimestamp(), // Use Firestore server timestamp
      };

      console.log('Project data to add:', projectToAdd);

      const docRef = await addDoc(collection(db, 'projects'), projectToAdd);
      console.log('Project added with ID: ', docRef.id);

      // Wait a bit for server timestamp to process, then refresh
      setTimeout(() => {
        fetchProjects();
      }, 1000);

      return docRef.id;
    } catch (err) {
      console.error('Error adding project:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);

      if (err.code === 'permission-denied') {
        setError('Permission denied. Please check Firestore security rules.');
      } else {
        setError(`Failed to add project: ${err.message}`);
      }
      throw err;
    }
  };

  // Update project
  const updateProject = async (projectId, updatedData) => {
    try {
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, updatedData);
      await fetchProjects(); // Refresh the list
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Failed to update project');
      throw err;
    }
  };

  // Delete project
  const deleteProject = async (projectId) => {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      await fetchProjects(); // Refresh the list
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project');
      throw err;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentUser, fetchProjects]);

  return {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    refreshProjects: fetchProjects,
  };
}
