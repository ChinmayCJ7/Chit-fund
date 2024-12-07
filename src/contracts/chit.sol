// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title ChitFund
 * @dev A smart contract to create and manage chit funds (group savings schemes).
 */
contract ChitFund is Ownable {
    using Counters for Counters.Counter;

    // Struct to represent a chit
    struct Chit {
        uint256 id;
        string title;
        string description;
        uint256 totalAmount;
        uint256 installmentAmount;
        uint256 deadline;
        uint256 createdAt;
        uint256 participantLimit;
        address[] participants;
        bool isCompleted;
    }

    Counters.Counter private chitCounter;
    mapping(uint256 => Chit) public chits;
    mapping(address => uint256[]) public userChits;

    event ChitCreated(
        uint256 indexed id,
        string title,
        uint256 totalAmount,
        uint256 participantLimit,
        address indexed creator
    );
    event JoinedChit(uint256 indexed id, address indexed participant);

    /**
     * @notice Constructor that initializes the contract and sets the initial owner.
     * @param initialOwner The address of the initial owner of the contract.
     */
    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @notice Create a new chit fund.
     * @param _title The title of the chit.
     * @param _description A brief description of the chit.
     * @param _totalAmount The total amount to be collected in the chit.
     * @param _installmentAmount The amount to be contributed in each installment.
     * @param _participantLimit The maximum number of participants allowed.
     * @param _deadline The timestamp (in Unix) by when the chit must be completed.
     */
    function createChit(
        string memory _title,
        string memory _description,
        uint256 _totalAmount,
        uint256 _installmentAmount,
        uint256 _participantLimit,
        uint256 _deadline
    ) external {
        require(bytes(_title).length > 0, "Title is required.");
        require(bytes(_description).length > 0, "Description is required.");
        require(_totalAmount > 0, "Total amount must be greater than zero.");
        require(_installmentAmount > 0, "Installment amount must be greater than zero.");
        require(_participantLimit > 0, "Participant limit must be greater than zero.");
        require(_deadline > block.timestamp, "Deadline must be in the future.");

        chitCounter.increment();
        uint256 newChitId = chitCounter.current();

        Chit storage newChit = chits[newChitId];
        newChit.id = newChitId;
        newChit.title = _title;
        newChit.description = _description;
        newChit.totalAmount = _totalAmount;
        newChit.installmentAmount = _installmentAmount;
        newChit.deadline = _deadline;
        newChit.createdAt = block.timestamp;
        newChit.participantLimit = _participantLimit;
        newChit.participants.push(msg.sender);

        userChits[msg.sender].push(newChitId);

        emit ChitCreated(
            newChitId,
            _title,
            _totalAmount,
            _participantLimit,
            msg.sender
        );
    }

    /**
     * @notice Join an existing chit fund.
     * @param _chitId The ID of the chit to join.
     */
    function joinChit(uint256 _chitId) external {
        Chit storage chit = chits[_chitId];

        require(chit.id != 0, "Chit does not exist.");
        require(block.timestamp < chit.deadline, "Cannot join after deadline.");
        require(chit.participants.length < chit.participantLimit, "Chit is full.");
        require(!_isParticipant(_chitId, msg.sender), "Already joined this chit.");

        chit.participants.push(msg.sender);
        userChits[msg.sender].push(_chitId);

        emit JoinedChit(_chitId, msg.sender);
    }

    /**
     * @notice Get all participants of a specific chit.
     * @param _chitId The ID of the chit.
     * @return An array of participant addresses.
     */
    function getParticipants(uint256 _chitId) external view returns (address[] memory) {
        Chit storage chit = chits[_chitId];
        return chit.participants;
    }

    /**
     * @notice Get all chits created so far.
     * @return An array of all chits.
     */
    function getChits() external view returns (Chit[] memory) {
        uint256 totalChits = chitCounter.current();
        Chit[] memory chitList = new Chit[](totalChits);

        for (uint256 i = 1; i <= totalChits; i++) {
            chitList[i - 1] = chits[i];
        }

        return chitList;
    }

    /**
     * @notice Check if an address is already a participant in a chit.
     * @param _chitId The ID of the chit.
     * @param _participant The address to check.
     * @return True if the address is a participant, false otherwise.
     */
    function _isParticipant(uint256 _chitId, address _participant) internal view returns (bool) {
        Chit storage chit = chits[_chitId];
        for (uint256 i = 0; i < chit.participants.length; i++) {
            if (chit.participants[i] == _participant) {
                return true;
            }
        }
        return false;
    }
}