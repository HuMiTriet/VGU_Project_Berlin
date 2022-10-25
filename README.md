# VGU Project Group: Berlin

![flowchart](./diagram/Flowchart.drawio.png)

# Using UTXO to hide user balance:

- Creating fungible tokens (like money bills) that can be spent 
- the full value must be completely spent

> As an example, if you own an unspent transaction output representing 5000 tokens, and you need to transfer 100 tokens to a recipient, the transaction would spen
> the 5000 token UTXO as input, create a new 100 token UTXO output owned by the recipient, and return a new 4900 token UTXO to you as 'change'. 

## UTXO vs accounts 
- UTXO paper money bills 
- Accounts are like banks

## Pros and cons of UTXO and Accounts

Pros UTXO:
  - Better privacy
  - Divisible 
  - Pick which of your bills to spend
  - Concurrency: you have two seperate $20 bills and can spent them in two 
  different places - as in account need to keep track that you are not doing 
  double spending

Cons UTXO:
  - 

Pros Account:
  - easier to reason with smart contracts with Account base than UTXO
  - Real time update of accounts and have a balance without requiring additional 
  computation

Cons Accounts:
 - has to manage a Nonce to prevent double spending
