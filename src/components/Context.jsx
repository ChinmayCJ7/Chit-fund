import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Import ABI and contract address
import chitAbi from './ChitFundABI.json'; // Replace with your ABI path
const deployedAddress = "0x4ED71835B3E28c587bfcc5503aaCfeA4Ea8667FC"; // Replace with your deployed contract address

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [loadingContract, setLoadingContract] = useState(true);
  const [chits, setChits] = useState([]);
  const [myChits, setMyChits] = useState([]);
  const [createdChits, setCreatedChits] = useState([]);

  // Connect wallet and initialize contract
  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask!');
        return;
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = ethProvider.getSigner();

      const address = await signer.getAddress();
      setWalletAddress(address);
      setProvider(ethProvider);

      const chitContract = new ethers.Contract(deployedAddress, chitAbi, signer);
      setContract(chitContract);
      setLoadingContract(false);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  }, []);

  // Fetch all chits
  const fetchAllChits = useCallback(async () => {
    if (!contract) return;

    try {
      const allChits = await contract.getChits();
      console.log('Raw chits data:', allChits);

      const parsedChits = allChits.map((data, index) => ({
        id: index,
        title: data.title || 'Unknown Title',
        desc: data.description || 'No description provided',
        total: data.totalAmount ? ethers.utils.formatEther(data.totalAmount.toString()) : '0',
        inst: data.installmentAmount ? ethers.utils.formatEther(data.installmentAmount.toString()) : '0',
        deadline: data.deadline ? new Date(data.deadline * 1000) : 'No deadline',
        participants: data.numberOfParticipants?.toString() || '0',
        by: data.creator || 'Unknown',
      }));

      console.log('Formatted chits data:', parsedChits);
      setChits(parsedChits);
    } catch (err) {
      console.error('Error fetching chits:', err);
    }
  }, [contract]);

  // Fetch created chits
  const fetchCreatedChits = useCallback(async () => {
    if (!contract || !walletAddress) return;

    try {
      const allChits = await contract.getChits();
      const filtered = allChits.filter((chit) =>
        chit.creator?.toLowerCase() === walletAddress.toLowerCase()
      );

      console.log('Created chits:', filtered);
      setCreatedChits(filtered);
    } catch (err) {
      console.error('Error fetching created chits:', err);
    }
  }, [contract, walletAddress]);

  // Fetch user's joined chits
  const fetchMyChits = useCallback(async () => {
    if (!contract || !walletAddress) return;

    try {
      const allChits = await contract.getChits();
      const filtered = allChits.filter((chit) =>
        chit.participants?.some(
          (participant) => participant.wallet?.toLowerCase() === walletAddress.toLowerCase()
        )
      );

      console.log('My chits:', filtered);
      setMyChits(filtered);
    } catch (err) {
      console.error('Error fetching my chits:', err);
    }
  }, [contract, walletAddress]);

  // Create a new chit
  const createNewChit = useCallback(
    async (formData) => {
      if (!contract) {
        alert('Contract is not initialized.');
        return;
      }

      try {
        const tx = await contract.createChit(
          formData.title,
          formData.desc,
          ethers.utils.parseEther(formData.total).toString(),
          ethers.utils.parseEther(formData.inst).toString(),
          formData.participants,
          Math.floor(new Date(formData.deadline).getTime() / 1000)
        );

        await tx.wait();
        alert('Chit created successfully!');
        window.location.reload();
      } catch (err) {
        console.error('Error creating chit:', err);
        alert('Failed to create chit. Please try again.');
      }
    },
    [contract]
  );

  // Join a chit
  const joinChit = useCallback(
    async (chitId) => {
      if (!contract) {
        alert('Contract is not initialized.');
        return;
      }

      try {
        const tx = await contract.joinChit(chitId);
        await tx.wait();
        alert('Successfully joined the chit!');
      } catch (err) {
        console.error('Error joining chit:', err);
        alert('Failed to join the chit. Please try again.');
      }
    },
    [contract]
  );

  // Automatically fetch chits when contract is initialized
  useEffect(() => {
    if (contract) {
      fetchAllChits();
      fetchCreatedChits();
      fetchMyChits();
    }
  }, [contract, fetchAllChits, fetchCreatedChits, fetchMyChits]);

  return (
    <AppContext.Provider
      value={{
        connectWallet,
        walletAddress,
        chits,
        myChits,
        createdChits,
        createNewChit,
        joinChit,
        loadingContract,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
