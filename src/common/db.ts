import { connect } from 'mongoose';

export const connection = connect(
    'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
);
