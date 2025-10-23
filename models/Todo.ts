import { Schema, models, model } from "mongoose";

const TodoSchema = new Schema(
  {
    text: { type: String, required: true },
    done: { type: Boolean, default: false },
  },
  { timestamps: true } // ger createdAt/updatedAt
);

export default models.Todo || model("Todo", TodoSchema);
