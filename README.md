# Token Implementation Project (Node.js + Smart Contract)

This project demonstrates how tokens work off-chain and on-chain, starting with a Node.js token simulator and extending to a Solidity smart contract.


## Project Structure

 - backend/ – Node.js + Express token simulator
 - contracts/ – Solidity smart contract (ERC-20 style)


## Features (Node.js)

 - Create accounts with balances
 - Transfer tokens between users
 - Approve allowances (spender model)
 - Transfer using allowance (transferFrom)
 - Query balances
This mirrors ERC-20 logic using in-memory storage.


## Smart Contract

 - Implements token logic on Ethereum
 - Uses balances and allowances mappings
 - Includes transfer, approve, transferFrom


## Tech Stack

 - Node.js, Express, TypeScript
 - Solidity
 - npm


## Run Backend

 - npm install
 - npm start


## Goal

Learn token mechanics before deploying real smart contracts.


