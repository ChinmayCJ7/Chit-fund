import React, { useContext, createContext, useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Import the ABI and deployed contract address
import chitAbi from './ChitFundABI.json'; // Replace with the actual ABI file path
const deployedAddress = "0x4ED71835B3E28c587bfcc5503aaCfeA4Ea8667FC"; // Replace with the deployed contract address

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [loadingContract, setLoadingContract] = useState(true); // New loading state
  const [chits, setChits] = useState([]); // Add this state for chits
  const [myChits, setMyChits] = useState([]); // Add state for user chits
  const [createdChits, setCreatedChits] = useState([]); // Add state for created chits

  // Connect wallet and setup contract
  const connectWallet = useCallback(async () => {
    if (window.ethereum) {
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = ethProvider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      setProvider(ethProvider);

      // Initialize contract
      const chitContract = new ethers.Contract(deployedAddress, chitAbi, signer);
      setContract(chitContract);
      setLoadingContract(false); // Contract is now initialized
    } else {
      alert('Please install MetaMask!');
    }
  }, []);

  // Create a new chit
  const createNewChit = useCallback(
    async (formData) => {
      if (!contract) {
        alert('Contract is not initialized.');
        return;
      }

      try {
        const monthInUnix = Math.floor(new Date().getTime() / 1000);
        const tx = await contract.createChit(
          formData.title,
          formData.desc,
          ethers.utils.parseEther(formData.total).toString(),
          ethers.utils.parseEther(formData.inst).toString(),
          formData.participants,
          Math.floor(new Date(formData.deadline).getTime() / 1000)
        );

        await tx.wait(); // Wait for transaction confirmation
        alert('Chit created successfully!');
        window.location.replace('/');
      } catch (err) {
        console.error("Error creating chit:", err);
        alert("Failed to create chit. Please check your input and try again.");
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
        await tx.wait(); // Wait for transaction confirmation
        alert('Successfully joined the chit!');
      } catch (err) {
        console.error("Error joining chit:", err);
        alert("Failed to join the chit. Please try again.");
      }
    },
    [contract]
  );

  // Fetch created chits
  const fetchCreatedChits = useCallback(async () => {
    if (!contract) {
      console.warn('Contract not initialized.');
      return;
    }

    try {
      console.log("Fetching chits from contract...");
      const allChits = await contract.getChits();
      console.log("Raw chits data:", allChits);

      const formattedChits = allChits.map((data, index) => ({
        id: index,
        title: data.title,
        desc: data.description,
        people: data.participants.length,
        total: ethers.utils.formatEther(data.totalAmount.toString()),
        by: data.creator, // Assuming the creator address is part of the chit data
        initialInstallment: data.initialInstallment,
      }));

      console.log("Formatted chits data:", formattedChits);
      setChits(formattedChits); // Update the state here
    } catch (err) {
      console.error("Error fetching created chits:", err);
    }
  }, [contract]);


  // Automatically fetch chits when the contract is initialized
  useEffect(() => {
    if (contract) {
      fetchCreatedChits();
    }
  }, [contract, fetchCreatedChits]);

  return (
    <AppContext.Provider
      value={{
        connectWallet,
        walletAddress,
        createNewChit,
        fetchCreatedChits,
        createdChits,
        loadingContract,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);