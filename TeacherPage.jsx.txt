import React, { useState, useEffect, useRef } from 'react';
import IntervuePollButton from '../components/IntervuePollButton';
import LivePollResults from '../components/LivePollResults';
import { socket } from '../socket';

export default function TeacherPage() {
  const [currentPoll, setCurrentPoll] = useState(null);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [correctOptions, setCorrectOptions] = useState([false, false]);
  const [timeout, setTimeoutValue] = useState(60);
  const [responses, setResponses] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [pastPolls, setPastPolls] = useState([]);
  const timerRef = useRef(null);
  const [studentList, setStudentList] = useState([]);

  const handleCreatePoll = () => {
    const newPoll = { question, options, timeout, timestamp: Date.now() };
    setCurrentPoll(newPoll);
    setResponses(null);
    socket.emit('teacher:create_poll', newPoll);
    setTimeLeft(timeout);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
    setCorrectOptions([...correctOptions, false]);
  };

  useEffect(() => {
    socket.on('poll:update', (data) => setResponses(data));
    socket.on('poll:results', (data) => {
      setResponses(data);
    });

    return () => {
      socket.off('poll:update');
      socket.off('poll:results');
    };
  }, []);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  useEffect(() => {
    socket.emit('teacher:request_student_list');

    socket.on('teacher:student_list', (list) => {
      setStudentList(list);
    });

    return () => socket.off('teacher:student_list');
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/past-polls`)
      .then((res) => res.json())
      .then((data) => setPastPolls(data));
  }, []);

  const handleNewPoll = () => {
    const completedPoll = {
      ...currentPoll,
      responses,
    };
    const updatedHistory = [completedPoll, ...pastPolls];
    setPastPolls(updatedHistory);

    setCurrentPoll(null);
    setQuestion('');
    setOptions(['', '']);
    setCorrectOptions([false, false]);
    setTimeoutValue(60);
    setResponses(null);
    setTimeLeft(null);
  };

  return (
    <div className='max-w-3xl mx-auto p-8 text-gray-800'>
      <IntervuePollButton />

      {currentPoll && responses ? (
        <>
          <LivePollResults poll={currentPoll} results={responses} />
          <div className='text-center mt-6'>
            <p className='text-gray-500 mb-2'>
              Time is over. You may ask a new question.
            </p>
            <button
              onClick={handleNewPoll}
              className='bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700'
            >
              Ask New Question
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className='text-3xl font-bold mb-2'>
            Let's <span className='text-black'>Get Started</span>
          </h1>
          <p className='text-gray-500 mb-6'>
            You’ll have the ability to create and manage polls, ask questions,
            and monitor your students' responses in real-time.
          </p>

          <div className='mb-4'>
            <div className='flex items-center justify-between mb-2'>
              <label className='block font-semibold'>Enter your question</label>
              <select
                value={timeout}
                onChange={(e) => setTimeoutValue(Number(e.target.value))}
                className='bg-light border rounded px-3 py-1'
              >
                {[30, 45, 60, 90].map((t) => (
                  <option key={t} value={t}>
                    {t} seconds
                  </option>
                ))}
              </select>
            </div>
            <textarea
              maxLength={100}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className='w-full p-4 border border-gray-300 rounded-lg resize-none bg-gray-100'
              rows={3}
            />
            <div className='text-right text-sm text-gray-400'>
              {question.length}/100
            </div>
          </div>

          <div className='flex justify-between items-center mb-4'>
            <h2 className='font-semibold'>Edit Options</h2>
            <label className='text-sm'>Is it Correct?</label>
          </div>

          <div className='space-y-4 mb-4'>
            {options.map((opt, i) => (
              <div key={i} className='flex items-center space-x-4'>
                <span className='w-6 h-6 flex items-center justify-center bg-primary text-white rounded-full'>
                  {i + 1}
                </span>
                <input
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...options];
                    newOpts[i] = e.target.value;
                    setOptions(newOpts);
                  }}
                  className='flex-1 px-4 py-2 border rounded-md bg-gray-100'
                  placeholder={`Option ${i + 1}`}
                />

                <div className='flex items-center space-x-2'>
                  <label className='flex items-center space-x-1'>
                    <input
                      type='radio'
                      name={`correct-${i}`}
                      checked={correctOptions[i] === true}
                      onChange={() => {
                        const newCorrect = [...correctOptions];
                        newCorrect[i] = true;
                        setCorrectOptions(newCorrect);
                      }}
                    />
                    <span className='text-sm'>Yes</span>
                  </label>
                  <label className='flex items-center space-x-1'>
                    <input
                      type='radio'
                      name={`correct-${i}`}
                      checked={correctOptions[i] === false}
                      onChange={() => {
                        const newCorrect = [...correctOptions];
                        newCorrect[i] = false;
                        setCorrectOptions(newCorrect);
                      }}
                    />
                    <span className='text-sm'>No</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddOption}
            className='text-purple-600 border border-purple-600 px-4 py-1 rounded mb-6 hover:bg-purple-50'
          >
            + Add More option
          </button>

          <div className='text-right'>
            <button
              disabled={
                !question ||
                !Array.isArray(options) ||
                options.length === 0 ||
                options.every((opt) => !opt.trim())
              }
              onClick={handleCreatePoll}
              className={`font-semibold px-6 py-3 rounded-full shadow transition
    ${
      !question || options.every((opt) => !opt.trim())
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-darkish text-white hover:bg-primary'
    }`}
            >
              Ask Question
            </button>
          </div>
        </>
      )}

      {studentList.length > 0 && (
        <div className='mt-6'>
          <h3 className='font-semibold mb-2'>Connected Students</h3>
          <ul className='space-y-2'>
            {studentList.map(({ name, isKicked }) => (
              <li
                key={name}
                className='flex items-center justify-between p-2 bg-gray-100 rounded'
              >
                <span className={isKicked ? 'text-red-500 line-through' : ''}>
                  {name}
                </span>
                {!isKicked && (
                  <button
                    onClick={() => socket.emit('teacher:kick_student', name)}
                    className='text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-100 text-sm'
                  >
                    Kick Out
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {pastPolls.length > 0 && (
        <div className='mt-10'>
          <h3 className='text-lg font-semibold mb-2'>Previous Polls</h3>
          <ul className='space-y-6'>
            {pastPolls.map((poll, i) => (
              <li key={i} className='p-3 border rounded bg-gray-50'>
                <LivePollResults poll={poll} results={poll.responses} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
