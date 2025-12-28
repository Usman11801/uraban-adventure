"use client";

const Loader = ({ fullScreen = true, message = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div 
        className="preloader" 
        style={{ 
          zIndex: 9999999,
          transition: 'opacity 0.3s ease-out, visibility 0.3s ease-out'
        }}
      >
        <div className="custom-loader" />
        {message && (
          <div style={{
            position: 'absolute',
            top: '60%',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'var(--heading-color)',
            fontSize: '14px',
            fontWeight: 500,
            marginTop: '20px'
          }}>
            {message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      minHeight: '200px'
    }}>
      <div className="custom-loader" style={{ width: '50px', height: '50px' }} />
      {message && (
        <div style={{
          marginTop: '15px',
          color: 'var(--heading-color)',
          fontSize: '14px',
          fontWeight: 500
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Loader;

