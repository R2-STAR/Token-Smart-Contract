import express from 'express';
import bodyParser from 'body-parser';


const app = express();
const port = 3000;

app.use(bodyParser.json());

type Address = string;

let balances: { [address: Address]: number } = {};

let allowances: {
  [address: Address]: {           //user 1 can send to user 2
    [address: Address]: number;   // user 2
  }
} = {};

app.post('/create', (req, res) => {  //created a dummy backend server
  const { userId, initialBalance } = req.body;
  if (balances[userId]) {   //if account is already there
    return res.status(400).send("Account already exists!");
  }
  balances[userId] = initialBalance;  //if a new account is created, put in the amount = initialBalanceinto that account
  res.send(`Account for ${userId} created with balance: ${initialBalance}`);
});

app.post('/transfer', (req, res) => {   // to transfer, when user mentions the to and fro accounts
  const { fromUserId, toUserId, amount } = req.body;
  if (!balances[fromUserId] || !balances[toUserId]) {
    return res.status(400).send("Account doesn't exist!");
  }
  if (balances[fromUserId] < amount) {
    return res.status(400).send("Insufficient funds!");
  }
  balances[fromUserId] -= amount;
  balances[toUserId] += amount;
  res.send(`Transferred ${amount} tokens from ${fromUserId} to ${toUserId}`);
});

//this endpoint approves allowance i.e, allows an account to spend from another account, eg: a child spends money from parent's account
app.post('/approve', (req, res) => {   //approve endpoint ensures that spenderId can spend money from the ownerId
  const { ownerId, spenderId, amount } = req.body;
  if (!balances[ownerId]) {
    return res.status(400).send("Account doesn't exist!");
  }

  if (!allowances[ownerId]) {  //initialize the allowance of this owner if it doesn't already exist
    allowances[ownerId] = {};
  }

  allowances[ownerId][spenderId] = amount;
  res.send(`${ownerId} has approved ${spenderId} to spend ${amount} tokens on their behalf.`);
});

app.post('/transferFrom', (req, res) => {  //works for allowances too
  const { fromUserId, toUserId, spenderId, amount } = req.body;
  if (!balances[fromUserId] || !balances[toUserId]) {
    return res.status(400).send("Account doesn't exist!");
  }

  const allowedAmount = allowances[fromUserId] && allowances[fromUserId][spenderId];  //important check 

  if (!allowedAmount || allowedAmount < amount) {
    return res.status(400).send("Insufficient allowance!");
  }
  if (balances[fromUserId] < amount) {
    return res.status(400).send("Insufficient funds!");
  }

  balances[fromUserId] -= amount;
  balances[toUserId] += amount;
  allowances[fromUserId][spenderId] -= amount;  //update this, eg: if 1k spent from 10k allowance, the new allowance will be 9k only

  res.send(`${spenderId} transferred ${amount} tokens from ${fromUserId} to ${toUserId}`);
});

app.get('/balance/:userId', (req, res) => {  //returns the balance amount in a particular account
  const balance = balances[req.params.userId];
  if (balance === undefined) {
    return res.status(404).send("Account not found!");
  }
  res.send(`Balance of ${req.params.userId}: ${balance}`);
});

app.listen(port, () => {
  console.log(`Token simulator app listening on http://localhost:${port}`);
});
