import app from './App';
import * as BigNumber from 'bignumber.js';

const port = process.env.PORT || 3000;

BigNumber.config({
  EXPONENTIAL_AT: 1000
});

app.listen(port, (err: any) => {
  if (err) {
    return console.log(err);
  }

  return console.log(`server is listening on ${port}`);
});