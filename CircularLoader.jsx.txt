const CircularLoader = ({ size = 32, color = '#4F0DCE' }) => {
  return (
    <div
      className='animate-spin rounded-full border-4 border-t-transparent m-4'
      style={{
        width: size,
        height: size,
        borderColor: color,
        borderTopColor: 'transparent',
      }}
    />
  );
};

export default CircularLoader;
