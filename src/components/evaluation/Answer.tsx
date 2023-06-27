import React, { useState } from "react";
import { Questions } from "@/types";

type QuestionProps = {
  question: Questions;
  onChange: (value: number) => void;
};

export default function Answer({ question, onChange }: QuestionProps) {
  const { id, name, description } = question;

  const [newAnswer, setNewAnswer] = useState(1);

  return (
    <div className="mb-6 md:flex md:items-center" key={id}>
      <input type="hidden" value={id} />
      <div className="flex items-center justify-between gap-2 w-full border-b py-2">
        <label
          className="wrap font-bold text-gray-500 flex flex-col justify-center"
          htmlFor={"question-" + id}
        >
          {name}
          {/* <span className=" text-sm">{description}</span> */}
        </label>

          <input
            className="rounded border-2 border-gray-300 px-4 py-2 leading-tight text-gray-700 focus:border-blue-500 focus:bg-white focus:outline-none"
            type="number"
            min={1}
            max={5}
            step={0.1}
            name={id}
            id={"question-" + id}
            required
            placeholder="1 - 5"
            value={newAnswer ?? null}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setNewAnswer(value);
              onChange(value);
            }}
          />

      </div>
    </div>
  );
}
