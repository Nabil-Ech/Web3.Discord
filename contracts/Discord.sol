// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract Discord is ERC721 {
    address public owner;
    uint256 public totalNFT;
    uint256 public totalchannel = 0;

    mapping (uint256 => Channel) public channels;
    mapping (uint256 => address) public channel_owner;
    mapping (uint256 => mapping (address => bool)) public has_joined;

    struct Channel {
        uint256 id;
        string name;
        uint256 cost;
    }


    constructor (string memory  _name, string memory  _symbol) ERC721 (_name, _symbol) {
        owner = msg.sender;
    }    

    function create_channel(string memory _name, uint256 _cost) public {
        totalchannel++;
        channels[totalchannel] = Channel(totalchannel, _name, _cost);
        channel_owner[totalchannel] = msg.sender; // to be reviewed
        has_joined[totalchannel][msg.sender] = true;
    }

    function join_channel(uint256 _id) public payable {
        require(msg.value >= channels[_id].cost);
        require(has_joined[_id][msg.sender] == false);
        require(_id != 0);
        require(_id <= totalchannel);
        
        

        //20% fee goes to the website owner
        uint256 feeAmount = (msg.value * 1/5); 
        uint256 amountToSendToOwner = msg.value - feeAmount;

        // payment goes to the channel owner
        // address payable channelOwner = payable(channel_owner[_id]);
        
        
        // channelOwner.transfer(amountToSendToOwner * 10**18);
        // owner.transfer(feeAmount * 10**18); // Transfer fee to website owner

        (bool success, ) = channel_owner[_id].call{value: amountToSendToOwner }("");
        require(success, "something wrong" );
        (bool success1, ) = owner.call{value: feeAmount}("");
        require(success1, "something wrong" );

        /* I could have used the call method
            (bool success, data) = channelOwner.call{value: amountToSendToOwner}(additionalData);
            // Check if the transfer was successful
            require(success, "Transfer failed");
        */

       // regestring te joined member
        has_joined[_id][msg.sender] = true;
        totalNFT++;

        _safeMint(msg.sender, totalNFT);
        
    }

    // function widraw(address add, fi) {
    //     (bool success, ) = add.call
    // }

    
 }
