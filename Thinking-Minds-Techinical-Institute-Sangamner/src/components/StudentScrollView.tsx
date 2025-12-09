import React from "react";

interface Student {
  name: string;
  photo: string;
}

const students: Student[] = [
  { name: "Aditya Navale", photo: "https://i.pravatar.cc/200?img=1" },
  { name: "Sneha Patil", photo: "https://i.pravatar.cc/200?img=2" },
  { name: "Rohit Sharma", photo: "https://i.pravatar.cc/200?img=3" },
  { name: "Anjali Deshmukh", photo: "https://i.pravatar.cc/200?img=4" },
  { name: "Vikram Singh", photo: "https://i.pravatar.cc/200?img=5" },
  { name: "Priya Joshi", photo: "https://i.pravatar.cc/200?img=6" },
];

const scrollStudents = [...students, ...students, ...students];

const StudentScrollView = () => {
  return (
    <div className="absolute bottom-0 left-0 w-screen overflow-hidden">
      <div className="flex relative items-center">
        <div className="flex animate-scroll gap-6 py-6 px-4">
          {scrollStudents.map((student, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center min-w-[120px] bg-white rounded-xl shadow-lg p-2"
            >
              {/* Rectangle photo */}
              <div className="w-32 h-40 rounded-lg overflow-hidden">
                <img
                  src={student.photo}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name below photo */}
              <p className="mt-2 text-sm font-semibold text-gray-800 text-center">
                {student.name}
              </p>

              {/* Separator design */}
              <div className="mt-1 w-16 h-1 rounded-full bg-blue-600"></div>
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.3333%); }
          }

          .animate-scroll {
            animation: scroll 6s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default StudentScrollView;
