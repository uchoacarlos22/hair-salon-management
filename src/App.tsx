import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { fetchTestData } from './services/supabaseClient';

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchTestData();
        setData(result || []);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
    getData();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4">Home</Typography>
      <h1>Dados da Tabela: test_table</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            ID: {item.id}, Nome: {item.name}, Criado em:{' '}
            {item.created_at}
          </li>
        ))}
      </ul>
    </Box>
  );
}

function About() {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4">About</Typography>
    </Box>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
