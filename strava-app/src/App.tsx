import React, { useEffect, useState } from 'react';
import './App.css';

interface Athlete {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
}

interface ActivityTotals {
  count: number;
  distance: number;
  moving_time: number;
}

interface Stats {
  biggest_ride_distance: number;
  biggest_climb_elevation_gain: number;
  recent_ride_totals: ActivityTotals;
  recent_run_totals: ActivityTotals;
}

function App() {
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const token = process.env.REACT_APP_STRAVA_TOKEN;

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    fetch('https://www.strava.com/api/v3/athlete', { headers })
      .then((res) => res.json())
      .then((data: Athlete) => {
        setAthlete(data);
        return fetch(`https://www.strava.com/api/v3/athletes/${data.id}/stats`, { headers });
      })
      .then((res) => res.json())
      .then((data: Stats) => setStats(data))
      .catch((err) => console.error('Error loading Strava data', err));
  }, [token]);

  if (!token) {
    return <p>Please provide a Strava access token in <code>REACT_APP_STRAVA_TOKEN</code>.</p>;
  }

  return (
    <div className="App">
      <header className="App-header">
        {athlete ? (
          <div>
            <h1>
              {athlete.firstname} {athlete.lastname}
            </h1>
            <p>Username: {athlete.username}</p>
            <p>Athlete ID: {athlete.id}</p>
            {stats ? (
              <div>
                <h2>Recent Ride Totals</h2>
                <p>Rides: {stats.recent_ride_totals.count}</p>
                <p>Distance: {stats.recent_ride_totals.distance} m</p>
                <p>Moving Time: {stats.recent_ride_totals.moving_time} sec</p>
                <h2>Recent Run Totals</h2>
                <p>Runs: {stats.recent_run_totals.count}</p>
                <p>Distance: {stats.recent_run_totals.distance} m</p>
                <p>Moving Time: {stats.recent_run_totals.moving_time} sec</p>
              </div>
            ) : (
              <p>Loading stats...</p>
            )}
          </div>
        ) : (
          <p>Loading athlete...</p>
        )}
      </header>
    </div>
  );
}

export default App;
