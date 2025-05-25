import React from 'react';
import ReactDOM from 'react-dom';
import EnergyMonitorVisualization from './EnergyMonitorVisualization';

// Grab entity_id from HA add-on options injected via window.panelOptions
const options = window.panelOptions || {};
const entityId = options.entity_id || 'sensor.home_power';

ReactDOM.render(
  <EnergyMonitorVisualization
    haUrl={location.protocol.replace('http', 'ws') + '//' + location.host + '/api/websocket'}
    token={null}               // panel has already authenticated via HA
    sensorEntity={entityId}
  />, 
  document.getElementById('root')
);