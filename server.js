const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Server is listening on port ${PORT}`);
  }
});