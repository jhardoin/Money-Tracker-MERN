import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const url = `${process.env.REACT_APP_API_URL}/transactions`;
    let response = await fetch(url);
    let json = await response.json();
    return json;
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = `${process.env.REACT_APP_API_URL}/transaction`;
    const price = parseFloat(name.split(' ')[0]); // Convert price to a number

    fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        name: name.substring(price.toString().length + 1),
        description,
        datetime,
        price
      })
    })
      .then(response => response.json())
      .then(json => {
        console.log('result', json);
        setTransactions([...transactions, json]); // Update state with the new transaction
        setName('');
        setDatetime('');
        setDescription('');
      })
      .catch(error => {
        console.error('Error adding transaction:', error);
      });
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance += transaction.price;
  }

  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1];
  balance = balance.split('.')[0];

  // Function to format datetime to display only the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Adjusts date to local timezone
  };

  return (
    <main>
      <h1>${balance}<span>{fraction}</span></h1>

      <form onSubmit={addNewTransaction}>
        <div className='basic'>
          <input type='text' 
                 value={name}
                 onChange={ev => setName(ev.target.value)}
                 placeholder='+1500 new samsung tv'/>
          <input value={datetime}
                 onChange={ev => setDatetime(ev.target.value)}
                 type='date' // Use type 'date' for date input
                 />
        </div>
        <div className='description'>
          <input type='text'
                 value={description}
                 onChange={ev => setDescription(ev.target.value)}
                 placeholder='description'/>
        </div>
        <button type='submit'>Add new transaction</button>
      </form>

      <div className='transactions'>
        {transactions.length > 0 &&
          transactions.map(transaction => (
            <div className='transaction' key={transaction._id}>
              <div className='left'>
                <div className='name'>{transaction.name}</div>
                <div className='description'>{transaction.description}</div>
              </div>
              <div className='right'>
                <div className={`price ${transaction.price < 0 ? 'red' : 'green'}`}>
                  {transaction.price}
                </div>
                <div className='datetime'>{formatDate(transaction.datetime)}</div>
              </div>
            </div>
          ))}
      </div>

    </main>
  );
}


export default App;