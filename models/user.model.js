import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture:{
      type:String,
      default: "https://i.pngimg.me/thumb/f/720/c3f2c592f9.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

//Login
userSchema.methods.matchPassword = async function(enterPassword) {
  return await bcrypt.compare(enterPassword, this.password)
}

//Register
userSchema.pre("save", async function(next){
  if(!this.isModified("password")){
      next();
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema);
export default User;





