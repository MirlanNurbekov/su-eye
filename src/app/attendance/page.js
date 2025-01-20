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
  // Hard-coded students for demonstration
  const [students, setStudents] = useState([
    { id: 'student1', name: 'Alice', present: false },
    { id: 'student2', name: 'Bob', present: false },
    { id: 'student3', name: 'Charlie', present: false },
  ]);

  // Load current attendance status from Firestore
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'attendance'));
        const updated = [...students];

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const index = updated.findIndex(s => s.id === docSnap.id);
          if (index !== -1) {
            updated[index].present = data.present || false;
          }
        });

        setStudents(updated);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 
  // ^ We only want this to run once (on mount).

  // Toggle the checkbox in local state
  const handleCheckboxChange = (id) => {
    setStudents(prev => 
      prev.map(s => {
        if (s.id === id) {
          return { ...s, present: !s.present };
        }
        return s;
      })
    );
  };

  // Submit changes to Firestore (bulk update)
  const handleSubmit = async () => {
    try {
      // For each student, update Firestore doc
      // (Alternatively, you could do a batch write, but let's keep it simple.)
      const promises = students.map(s => 
        setDoc(doc(db, 'attendance', s.id), {
          present: s.present
        })
      );

      await Promise.all(promises);
      alert("Attendance updated!");
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert("Failed to update attendance. Check console for details.");
    }
  };

  return (
    <main style={{ padding: '20px' }}>
      <h1>Attendance (Submit Version)</h1>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {students.map(student => (
          <li key={student.id} style={{ marginBottom: '10px' }}>
            <label style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={student.present}
                onChange={() => handleCheckboxChange(student.id)}
                style={{ marginRight: '8px' }}
              />
              {student.name}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit}>Submit</button>
    </main>
  );
}
