
if (process.env.NODE_ENV === 'production'){
  module.exports = {
    mongoURI: process.env.MONGO_URI
  }

}else{
  module.exports = {
    mongoURI: "mongodb+srv://Zain:Zain@cluster0.c23hs.mongodb.net/myMainDB?retryWrites=true&w=majority"
  }

}
