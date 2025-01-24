import { useEffect, useState } from 'react';
import { fetchTestData } from '../services/supabaseClient';

interface TestData {
  id: number;
  name: string;
  created_at: string;
}

const TestTableData = () => {
  const [data, setData] = useState<TestData[]>([]);

  useEffect(() => {
    const getData = async () => {
      const result = await fetchTestData();
      setData(result || []);
    };
    getData();
  }, []);

  return (
    <div>
      <h1>Dados da Tabela: test_table</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            ID: {item.id}, Name: {item.name}, Created At: {item.created_at}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestTableData;
