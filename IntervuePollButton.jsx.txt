import React from 'react';
import sparkle from '../assets/sparkle.png';

const IntervuePollButton = () => {
  return (
    <button className='flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-primary to-darkish transition my-4 px-3 py-[0.5em] text-sm font-semibold mb-4'>
      <img src={sparkle} alt='' className='w-5 h-5 filter invert' />
      <span>Intervue Poll</span>
    </button>
  );
};

export default IntervuePollButton;
