// app/attendance/page.js
"use client";

import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc
} from 'firebase/firestore';

export default function AttendancePage() {
  // Hard-coded student data
  const [students, setStudents] = useState([
    { id: 'student1', name: 'Alice', present: false },
    { id: 'student2', name: 'Bob', present: false },
    { id: 'student3', name: 'Charlie', present: false },
  ]);

  // Fetch current attendance status from Firestore on first load
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'attendance'));
        const updatedStudents = [...students];

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          // docSnap.id should match student.id (e.g., 'student1')
          const index = updatedStudents.findIndex(s => s.id === docSnap.id);
          if (index !== -1) {
            updatedStudents[index].present = data.present || false;
          }
        });

        setStudents(updatedStudents);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 
  // ^ If we include 'students' in dependency array, it might re-fetch repeatedly.
  // So we only fetch once on mount.

  // Toggle attendance and save to Firestore
  const toggleAttendance = async (studentId) => {
    try {
      // Update local state quickly for immediate UI change
      setStudents(prev =>
        prev.map(s => {
          if (s.id === studentId) {
            const newStatus = !s.present;
            // Also update Firestore
            setDoc(doc(db, 'attendance', studentId), { present: newStatus });
            return { ...s, present: newStatus };
          }
          return s;
        })
      );
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  return (
    <main style={{ padding: '20px' }}>
      <h1>Attendance</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {students.map((student) => (
          <li key={student.id} style={{ marginBottom: '10px' }}>
            {student.name} - <b>{student.present ? 'Present' : 'Absent'}</b>
            {' '}
            <button onClick={() => toggleAttendance(student.id)}>
              Toggle
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
