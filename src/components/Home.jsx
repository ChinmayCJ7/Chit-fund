import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAppContext } from './Context';


// Component to display user-created or participated chit details
const MyChit = ({ id, title, desc, people, amount, by, initial, paid }) => {
  const { sendETH } = useAppContext();


  return (
    <div style={{ width: '288px', padding: '15px', margin: '10px', borderRadius: '15px', backgroundColor: '#f8f9fa' }}>
      <h3 style={{ fontWeight: 'bold', fontSize: '18px', color: '#505050' }}>{title}</h3>
      <p style={{ marginTop: '5px', fontSize: '14px', color: '#808191' }}>{desc}</p>
      <div style={{ marginTop: '15px' }}>
        <p style={{ fontWeight: 'bold', color: '#b2b3bd' }}>{amount} ETH</p>
        <p style={{ marginTop: '3px', fontSize: '14px', color: '#808191' }}>Total: {amount * people}</p>
        <p style={{ marginTop: '3px', fontSize: '14px', color: '#808191' }}>
          Initial: {initial ? "✔️" : "❌"}
        </p>
      </div>
      <p style={{ marginTop: '10px', fontSize: '12px', color: '#808191' }}>
        by {by?.slice(0, 6)}...{by?.slice(-4)}
      </p>
      <button
        onClick={sendETH}
        style={{
          marginTop: '10px',
          padding: '8px 15px',
          backgroundColor: paid ? '#4caf50' : '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        {paid ? "Paid" : "Pay"}
      </button>
    </div>
  );
};

// Component to display chit card
const Card = ({ id, clickJoin, title, desc, people, amount, by, initial }) => {
  return (
    <div style={{ width: '288px', padding: '15px', margin: '10px', borderRadius: '15px', backgroundColor: '#f8f9fa' }}>
      <h3 style={{ fontWeight: 'bold', fontSize: '18px', color: '#505050' }}>{title}</h3>
      <p style={{ marginTop: '5px', fontSize: '14px', color: '#808191' }}>{desc}</p>
      <div style={{ marginTop: '15px' }}>
        <p style={{ fontWeight: 'bold', color: '#b2b3bd' }}>{amount} ETH</p>
        <p style={{ marginTop: '3px', fontSize: '14px', color: '#808191' }}>Total: {amount * people}</p>
        <p style={{ marginTop: '3px', fontSize: '14px', color: '#808191' }}>
          Initial: {initial ? "✔️" : "❌"}
        </p>
      </div>
      <p style={{ marginTop: '10px', fontSize: '12px', color: '#808191' }}>
        by {by?.slice(0, 6)}...{by?.slice(-4)}
      </p>
      <button
        onClick={() => clickJoin(id)}
        style={{
          marginTop: '10px',
          padding: '8px 15px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Join
      </button>
    </div>
  );
};

// Home component to display all chits, user chits, and created chits
const Home = () => {
  const {
    fetchCreatedChits,
    fetchUserChits,
    getMyChits,
    chits = [],
    myChits = [],
    createdChits = [],
    formattedChits = [],
    contract,
    joinTheChit,
  } = useAppContext();

  useEffect(() => {
    if (contract) {
      console.log("Contract initialized:", contract);
      fetchCreatedChits();
      fetchUserChits();
      getMyChits();
    } else {
      console.warn("Contract not initialized.");
    }
  }, [contract, fetchCreatedChits, fetchUserChits, getMyChits]);

  useEffect(() => {
    console.log("Chits:", chits);
    console.log("My Chits:", myChits);
    console.log("Created Chits:", createdChits);
  }, [chits, myChits, createdChits]);

  const clickJoin = (id) => {
    joinTheChit(id);
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>All Chits</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {console.log("Rendering formattedChits:", formattedChits)}
          {formattedChits.length > 0 ? (
            formattedChits.map((post) => (
              <Card
                key={post.id}
                id={post.id}
                clickJoin={clickJoin}
                title={post.title}
                desc={post.desc}
                people={post.people}
                amount={post.total}
                by={post.by}
                initial={post.initialInstallment}
              />
            ))
          ) : (
            <p>No formatted chits available.</p>
          )}
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>My Chits (Participant)</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {myChits.length > 0 ? (
            myChits.map((post) => (
              <MyChit
                key={post.id}
                id={post.id}
                title={post.title}
                desc={post.desc}
                people={post.people}
                amount={post.amount}
                by={post.by}
                initial={post.initialInstallment}
                paid={post.paid}
              />
            ))
          ) : (
            <p>No chits joined.</p>
          )}
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Chits I Created</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {createdChits.length > 0 ? (
            createdChits.map((post) => (
              <MyChit
                key={post.id}
                id={post.id}
                title={post.title}
                desc={post.desc}
                people={post.people}
                amount={post.amount}
                by={post.by}
                initial={post.initialInstallment}
                paid={post.paid}
              />
            ))
          ) : (
            <p>No chits created.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
