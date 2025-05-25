import React, { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import streamingPlugin from 'chartjs-plugin-streaming';
import 'chartjs-adapter-luxon';

Chart.register(streamingPlugin);

export default function EnergyMonitorVisualization({ haUrl, sensorEntity }) {
  const latestRef = useRef(0);

  const data = {
    datasets: [{
      label: 'Power (W)',
      borderWidth: 2,
      fill: false,
      data: [],
      borderColor: 'rgba(75,192,192,1)'  
    }]
  };

  const options = {
    animation: false,
    scales: {
      x: {
        type: 'realtime',
        realtime: {
          duration: 60000,
          refresh: 2000,
          delay: 2000,
          onRefresh: chart => chart.data.datasets[0].data.push({ x: Date.now(), y: latestRef.current })
        }
      },
      y: { title: { display: true, text: 'Watts' } }
    },
    plugins: { legend: { display: false } }
  };

  useEffect(() => {
    const sock = new WebSocket(haUrl);
    sock.onopen = () => sock.send(JSON.stringify({ type: 'auth', access_token: null }));
    sock.onmessage = ({ data }) => {
      const msg = JSON.parse(data);
      if (msg.type === 'auth_ok' || msg.type === 'auth_required') {
        sock.send(JSON.stringify({ id: 1, type: 'subscribe_events', event_type: 'state_changed', entity_id: sensorEntity }));
      }
      const state = msg.event?.data?.new_state?.state;
      if (state) latestRef.current = parseFloat(state);
    };
    return () => sock.close();
  }, [haUrl, sensorEntity]);

  return (
    <div style={{ padding: '1rem', maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>Power Orb</h2>
      <Line data={data} options={options} />
    </div>
  );
}