import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import streamingPlugin from 'chartjs-plugin-streaming';
import 'chartjs-adapter-luxon';
Chart.register(streamingPlugin);

export default function EnergyMonitorVisualization({ haUrl, sensorEntity }) {
  const latestRef = useRef(0);
  const data = { datasets: [{ label: 'Power (W)', borderColor: 'rgba(75,192,192,1)', data: [] }] };
  const options = {
    scales: {
      x: { type: 'realtime', realtime: { duration: 60000, refresh: 2000, delay: 2000, onRefresh: chart => chart.data.datasets[0].data.push({ x: Date.now(), y: latestRef.current }) } },
      y: { title: { display: true, text: 'Watts' } }
    }, plugins: { legend: { display: false } }, animation: false
  };

  useEffect(() => {
    const sock = new WebSocket(haUrl);
    sock.onopen = () => sock.send(JSON.stringify({ type: 'auth', access_token: null }));
    sock.onmessage = e => {
      const msg = JSON.parse(e.data);
      if (msg.type === 'auth_ok' || msg.type === 'auth_required') {
        sock.send(JSON.stringify({ id: 1, type: 'subscribe_events', event_type: 'state_changed', entity_id: sensorEntity }));
      }
      if (msg.event?.data?.new_state) latestRef.current = parseFloat(msg.event.data.new_state.state);
    };
    return () => sock.close();
  }, [haUrl, sensorEntity]);

  return (<div style={{ padding:16 }}><h2>Power Orb</h2><Line data={data} options={options} /></div>);
}