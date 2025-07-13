const Legend = () => {
  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: 'white',
      padding: '10px',
      borderRadius: '5px',
      zIndex: 1000
    }}>
      <h4>Activity Legend</h4>
      <div><span style={{color: 'red'}}>■</span> Run</div>
      <div><span style={{color: 'green'}}>■</span> Hike</div>
      <div><span style={{color: 'blue'}}>■</span> Cycle</div>
    </div>
  );
};

export default Legend;
