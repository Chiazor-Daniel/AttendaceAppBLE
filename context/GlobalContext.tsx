import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Course {
  id: string;
  code: string;
  name: string;
  schedule?: {
    day: string;
    time: string;
  }[];
}

interface GlobalContextType {
  courses: Course[];
  addCourse: (course: Course) => void;
  removeCourse: (courseId: string) => void;
  updateCourse: (courseId: string, courseData: Partial<Course>) => void;
  loading: boolean;
  error: string | null;
}

export const GlobalContext = createContext<GlobalContextType>({
  courses: [],
  addCourse: () => {},
  removeCourse: () => {},
  updateCourse: () => {},
  loading: false,
  error: null,
});

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const storedCourses = await AsyncStorage.getItem('courses');
      if (storedCourses) {
        setCourses(JSON.parse(storedCourses));
      }
    } catch (err) {
      setError('Failed to load courses');
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveCourses = async (updatedCourses: Course[]) => {
    try {
      await AsyncStorage.setItem('courses', JSON.stringify(updatedCourses));
    } catch (err) {
      setError('Failed to save courses');
      console.error('Error saving courses:', err);
    }
  };

  const addCourse = async (course: Course) => {
    try {
      const updatedCourses = [...courses, course];
      setCourses(updatedCourses);
      await saveCourses(updatedCourses);
    } catch (err) {
      setError('Failed to add course');
      console.error('Error adding course:', err);
    }
  };

  const removeCourse = async (courseId: string) => {
    try {
      const updatedCourses = courses.filter(course => course.id !== courseId);
      setCourses(updatedCourses);
      await saveCourses(updatedCourses);
    } catch (err) {
      setError('Failed to remove course');
      console.error('Error removing course:', err);
    }
  };

  const updateCourse = async (courseId: string, courseData: Partial<Course>) => {
    try {
      const updatedCourses = courses.map(course =>
        course.id === courseId ? { ...course, ...courseData } : course
      );
      setCourses(updatedCourses);
      await saveCourses(updatedCourses);
    } catch (err) {
      setError('Failed to update course');
      console.error('Error updating course:', err);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        courses,
        addCourse,
        removeCourse,
        updateCourse,
        loading,
        error,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
