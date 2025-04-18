const app = require("./app");
const connectDB = require("./config/mongo.config")
require("dotenv").config();

connectDB()

const PORT = process.env.PORT || 7005;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `Bull dashboard available at http://localhost:${PORT}/admin/queues`
  );
});
