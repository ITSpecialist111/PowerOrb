import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import streamingPlugin from 'chartjs-plugin-streaming';
import 'chartjs-adapter-luxon';

Chart.register(streamingPlugin);

export default function EnergyMonitorVisualization({ haUrl, token, sensorEntity }) {
  const chartRef = useRef(null);
  const latestValueRef = useRef(0);

  const data = {
    datasets: [
      {
        label: 'Power (W)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
        fill: false,
        data: []
      }
    ]
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
          onRefresh: chart => {
            chart.data.datasets[0].data.push({
              x: Date.now(),
              y: latestValueRef.current
            });
          }
        }
      },
      y: {
        title: { display: true, text: 'Watts' }
      }
    },
    plugins: { legend: { display: false } }
  };

  useEffect(() => {
    const socket = new WebSocket(haUrl);
    socket.addEventListener('open', () => {
      if (token) {
        socket.send(JSON.stringify({ type: 'auth', access_token: token }));
      }
    });

    socket.addEventListener('message', event => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'auth_ok' || !token) {
        socket.send(JSON.stringify({
          id: 1,
          type: 'subscribe_events',
          event_type: 'state_changed',
          entity_id: sensorEntity
        }));
      }
      if (msg.type === 'event' && msg.event?.data?.new_state) {
        const val = parseFloat(msg.event.data.new_state.state);
        if (!isNaN(val)) latestValueRef.current = val;
      }
    });

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ id: 1, type: 'unsubscribe_events' }));
        socket.close();
      }
    };
  }, [haUrl, token, sensorEntity]);

  return (
    <div style={{ padding: '1rem', maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>Real-Time Power Orb</h2>
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
}