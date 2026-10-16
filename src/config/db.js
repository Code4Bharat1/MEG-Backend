import mongoose from "mongoose"

const connectDB = async  () => {
try {
  const mongoUri = process.env.MONGO_URI;
  await mongoose.connect(mongoUri);

  console.log("Database connected.")
} catch (error) {
console.log(`MONGODB Error : ${error}`)
}
}

export default connectDB ;
