import React from 'react';

export default function LivePollResults({ poll, results }) {
  if (!poll) return null;
  const total = Object.values(results).length;

  console.log(results);
  console.log(poll);

  return (
    <div>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Question 1</h2>
        <span className='text-red-500 font-medium'>⏱️ 00:15</span>
      </div>
      <div className='bg-gray-100 p-4 rounded-t-md font-medium'>
        {poll.question}
      </div>
      <div className='border rounded-b-md border-t-0 overflow-hidden'>
        {poll.options.map((opt, i) => {
          const count = Object.values(results).filter(
            (ans) => ans === opt
          ).length;
          const percent = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={i} className='px-4 py-3 border-t'>
              <div className='flex justify-between text-sm'>
                <span>{opt}</span>
                <span>{percent}%</span>
              </div>
              <div className='h-2 bg-purple-200 rounded-full mt-1'>
                <div
                  className='bg-purple-600 h-2 rounded-full'
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
