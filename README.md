Requirements:
- npm install ethers
- npm install bignumber.js
<hr>
~ Update: Results will be exported @ transactions.txt ✅ <br>
~ Update(2): Timestamp ✅ <br>
~ Update(3): Telegram Bot ✅
<hr>
Telegram Bot: <br>
- Run npm init -y to create a new package.json file. <br>
- Install the node-telegram-bot-api library by running npm install node-telegram-bot-api in the terminal. <br>
- Add this piece of code from tracker-telegram-bot.js file to the main code. <br>
<hr>
Because the newer version of Ethers seems to be unstable, downgrade your ethers version to 5.7.2 by going to your .json
{ "ethers": "5.7.2" }
