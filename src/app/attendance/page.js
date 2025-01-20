// app/attendance/page.js
"use client";

import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc
} from 'firebase/firestore';

export default function AttendancePage() {
  // Hard-coded list of students (id should be unique)
  const [students, setStudents] = useState([
    { id: 'student1', name: 'Alice', present: false },
    { id: 'student2', name: 'Bob', present: false },
    { id: 'student3', name: 'Charlie', present: false },
  ]);

  // On first load, fetch attendance from Firestore
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'attendance'));
        // Create a copy of students from state
        const updatedStudents = [...students];

        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          // docSnapshot.id is the same as our student id if we used it as the doc name
          const idx = updatedStudents.findIndex((s) => s.id === docSnapshot.id);
          if (idx !== -1) {
            updatedStudents[idx].present = data.present || false;
          }
        });

        setStudents(updatedStudents);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };

    fetchAttendance();
  }, []);

  // Toggle attendance for a student
  const toggleAttendance = async (student) => {
    try {
      const newStatus = !student.present;

      // Update local state first for instant UI feedback
      setStudents((prev) =>
        prev.map((s) =>
          s.id === student.id
            ? { ...s, present: newStatus }
            : s
        )
      );

      // Update Firestore (use doc ID = student's id)
      await setDoc(doc(db, 'attendance', student.id), {
        present: newStatus,
      });

    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  return (
    <main style={{ padding: '20px' }}>
      <h1>Attendance Page</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {students.map((student) => (
          <li key={student.id} style={{ marginBottom: '10px' }}>
            {student.name} - <b>{student.present ? 'Present' : 'Absent'}</b>
            {' '}
            <button onClick={() => toggleAttendance(student)}>
              Toggle
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
