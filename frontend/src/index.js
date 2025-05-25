import React from 'react';
import ReactDOM from 'react-dom';
import EnergyMonitorVisualization from './EnergyMonitorVisualization';

const options = window.panelOptions || {};
const entityId = options.entity_id;
const wsUrl = `${location.protocol.replace('http','ws')}//${location.host}/api/websocket`;

ReactDOM.render(
  <EnergyMonitorVisualization
    haUrl={wsUrl}
    sensorEntity={entityId}
  />, document.getElementById('root')
);