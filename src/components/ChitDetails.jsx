import React, { useEffect } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useAppContext } from "./Context";
import { useLocation, useNavigate } from 'react-router-dom';

function ChitDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { getChit, chit, getAllParticipants, participants } = useAppContext();

  useEffect(() => {
    const pathname = location.pathname;
    const id = pathname.split("/chit/")[1];
    getChit(id);
    getAllParticipants(id);
  }, [location.pathname, getChit, getAllParticipants]);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-12">
        <div className="bg-white rounded-lg p-8 max-w-lg w-full text-center">
          {chit ? (
            <>
              <h2 className="text-lg font-bold mb-4">{chit.title}</h2>
              <p className="text-gray-500 text-sm mb-4">{chit.desc}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-lg font-bold text-gray-800 mb-2">{chit.total}</p>
                  <p className="text-gray-500 text-sm">Total Amount</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-lg font-bold text-gray-800 mb-2">{chit.inst}</p>
                  <p className="text-gray-500 text-sm">Installment Amount</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-lg font-bold text-gray-800 mb-2">{chit.period}</p>
                  <p className="text-gray-500 text-sm">Period (days)</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-lg font-bold text-gray-800 mb-2">{chit.participants}</p>
                  <p className="text-gray-500 text-sm">Number of Participants</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-2">Deadline: {chit.deadline}</p>
              <h3 className="text-lg font-bold mb-2">Payments</h3>
              <ul className="list-disc pl-4">
                {participants?.map(({ wallet, paid }, index) => (
                  <li className="flex items-center mb-2" key={index}>
                    <CheckCircleIcon
                      className={`w-4 h-4 mr-2 ${paid ? "text-green-500" : "text-gray-500"}`}
                    />
                    {wallet}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-gray-500">Loading chit details...</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ChitDetails;
