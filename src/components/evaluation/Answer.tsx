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
    <div className="mt-10 flex flex-wrap gap-x-6 gap-y-8" key={id}>
      <div className="grow">
        <h3 className="text-sm font-medium leading-6 text-gray-400">
          {name}
          <br />
          <span>{description}</span>
        </h3>
      </div>
      <div className="grow-1">
        <input type="hidden" value={id} />
        <input
          className="input justify-self-end"
          type="number"
          min={1}
          max={5}
          step={0.1}
          name={id}
          id={id}
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
