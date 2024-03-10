import mongoose, { Document, Model } from "mongoose";

mongoose.connect('mongodb+srv://utkarsh172002srivastava:pay-1@cluster0.ti9nuof.mongodb.net/user')

interface UserDocument extends Document{
    username : string,
    password : string,
    firstname : string,
    lastname : string
}

interface UserModel extends Model<UserDocument>{}

const userSchema = new mongoose.Schema<UserDocument>({
    username : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
        minlength : 3,
        maxlength : 30
    },
    password : {
        type : String,
        required : true,
        minlength : 6
    },
    firstname: {
        type: String,
        required: false,
        trim: true,
        maxLength: 50
    },
    lastname: {
        type: String,
        required: false,
        trim: true,
        maxLength: 50
    }

})

// Create a model from the schema
const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { User, UserDocument, UserModel };