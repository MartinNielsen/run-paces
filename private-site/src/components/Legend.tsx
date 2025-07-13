const Legend = () => {
  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: '10px',
      borderRadius: '5px',
      zIndex: 1000,
      textAlign: 'left'
    }}>
      <h4>Activity Legend</h4>
      <div><span style={{color: 'red'}}>■</span> Run</div>
      <div><span style={{color: 'green'}}>■</span> Hike</div>
      <div><span style={{color: 'blue'}}>■</span> Cycle</div>
      <div><span style={{color: 'purple'}}>■</span> Walking</div>
      <div><span style={{color: 'brown'}}>■</span> Rucking</div>
    </div>
  );
};

export default Legend;
