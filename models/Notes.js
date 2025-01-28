const mongoose =require('mongoose');

const NotesSchema=new mongoose.Schema(
    {
        title:{
            type:String,
            required:true
        },
        des:{
            type:String,
            required:true
        },
        
        author:{
            //type: mongoose.Schema.Types.ObjectId,
            type:String,
            ref: 'User',
            required: true,
            default:"admin"
        },
        reference:{
            type:String
        }, 
        confirm_note: {
            type: String,
            required: true,
            enum: ["approved", "rejected", "pending"],
            default: "pending"
        },        
       
        date: {
            type: Date,
            default: Date.now
        },
       
    }
)

// Pre-save middleware to update the updatedAt field
NotesSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});



const Notes=mongoose.model('Notes',NotesSchema);

module.exports=Notes;