import mongoose from 'mongoose'

const connectDatabase = () => {
    mongoose.connect(process.env.URI).then((data) => {
        console.group(`databace connected with ${data.connection.host}`)
    })
}

export default connectDatabase