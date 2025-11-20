const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = 9000;
app.use(express.json());
app.use(cors());

const mongo_URL =
  "mongodb+srv://zakibarte1_db_user:i5bXHERrVkfb5WI6@cluster0.r1xg9ip.mongodb.net/Finance?appName=Cluster0";

// MongoDB connection
async function connectMongoDB() {
  try {
    await mongoose.connect(mongo_URL);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}

const financeSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  price: {
    type: String,
    require: true,
  },
});

const Finance = mongoose.model("Finance", financeSchema);

app.get("/finance", async (req, res) => {
  const finances = await Finance.find();

  if (!finances) {
    res.json({ error: "there is no data stored" });
  }
  res.json(finances);
});

app.post("/finance", async (req, res) => {
  const { title, price } = req.body;
  try {
    const existing = await Finance.findOne({ title });
    if (existing) {
      existing.price = +Number(price);
      await existing.save();
      return res.json(existing);
    }

    const finance = req.body;
    const newFinance = new Finance(finance);
    await newFinance.save();
    res.json(newFinance);
  } catch (error) {
    res.json({ error });
  }
});

app.delete("/finance/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFinance = await Finance.findByIdAndDelete(id);
    console.log(deletedFinance);

    res.json(deletedFinance);
  } catch (error) {
    console.error(error);
  }
});

async function startServer() {
  try {
    await connectMongoDB();
    app.listen(PORT, () =>
      console.log(`Server running on port http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error(error);
  }
}
startServer();
