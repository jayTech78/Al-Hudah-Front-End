// components/ReportCard.js
import React from 'react';

const ReportCard = ({ data }) => {
  return (
    <div className="max-w-5xl mx-auto border p-6 text-sm bg-white text-black print:bg-white print:text-black">
      {/* Header */}
      <div className="text-center border-b pb-2">
        <h1 className="text-xl font-bold">AL-HUDAH MODEL COLLEGE</h1>
        <p>Plot 7-9, Al-Hudah Street, Labaika Village, Itoko Titun, Abeokuta</p>
        <p className="mt-1 font-semibold">TERMINAL REPORT SHEET</p>
      </div>

      {/* Student Info */}
      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
        <div>
          <p><strong>Name:</strong> {data.name}</p>
          <p><strong>Class:</strong> {data.className}</p>
        </div>
        <div>
          <p><strong>Term:</strong> {data.term}</p>
          <p><strong>Session:</strong> {data.session}</p>
        </div>
      </div>

      {/* Subjects Table */}
      <table className="w-full mt-6 text-xs border border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Subjects</th>
            <th className="border px-2 py-1">C.A Test</th>
            <th className="border px-2 py-1">Exam</th>
            <th className="border px-2 py-1">Average</th>
            <th className="border px-2 py-1">Grade</th>
            <th className="border px-2 py-1">Position</th>
            <th className="border px-2 py-1">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {data.subjects.map((subject, index) => (
            <tr key={index}>
              <td className="border px-2 py-1">{subject.name}</td>
              <td className="border px-2 py-1">{subject.ca}</td>
              <td className="border px-2 py-1">{subject.exam}</td>
              <td className="border px-2 py-1">{subject.total}</td>
              <td className="border px-2 py-1">{subject.grade}</td>
              <td className="border px-2 py-1">{subject.position || '-'}</td>
              <td className="border px-2 py-1">{subject.remark}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <p><strong>Overall Total:</strong> {data.totalMark}</p>
        <p><strong>Total Obtained:</strong> {data.totalObtained}</p>
        <p><strong>Percentage:</strong> {data.percentage}%</p>
      </div>

      <div className="mt-2">
        <p><strong>Position:</strong> {data.position}</p>
        <p><strong>Status:</strong> {data.status}</p>
        <p><strong>Next Term Begins:</strong> {data.nextTerm}</p>
      </div>

      {/* Comments */}
      <div className="mt-4">
        <p><strong>Class Teacher's Comment:</strong> {data.teacherComment}</p>
        <p><strong>Principal's Comment:</strong> {data.principalComment}</p>
      </div>

      {/* Signature */}
      <div className="mt-6 text-right">
        <p><strong>Principal's Signature:</strong> ____________________</p>
      </div>
    </div>
  );
};

export default ReportCard;