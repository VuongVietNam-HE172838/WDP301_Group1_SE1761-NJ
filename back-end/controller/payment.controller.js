const express = require("express");
const app = express();
app.use(express.json());

exports.callBack = async (req, res) => {
  const data = req.body; 
  console.log(data); // token là do bạn config ở phần webhook, payment là thông tin giao dịch
  //   {
  //     token: '123456789:ABCDEF',
  //     payment: {
  //       transaction_id: 'tbbank-15401929546',
  //       amount: 5000000,
  //       content: 'nap 323523',
  //       date: '2021-06-19T17:00:00.000Z',
  //       account_receiver: '04381598888',
  //       gate: 'TPBANK'
  //     }
  //   }
  res.status(200).send("Data received");
};

