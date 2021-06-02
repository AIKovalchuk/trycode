import { Schema, model, Document } from "mongoose";

export interface Char {
    char: string;
    position: number[];
}

export interface EditorPosition {
    line: number;
    ch: number;
}

export interface ISession extends Document {
    uuid: string;
    title: string;
    type: string;
    content: Char[][];
}

const Session: Schema = new Schema({
    title: {
        type: String,
    },
    uuid: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        require: true,
    },
    content: [
        [
            {
                char: String,
                position: [Number],
            },
        ],
    ],
});

export default model<ISession>("Session", Session);
