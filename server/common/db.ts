import { connect, Mongoose } from 'mongoose';

export const mongoose: Promise<Mongoose> = connect(
    'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false',
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    },
);
