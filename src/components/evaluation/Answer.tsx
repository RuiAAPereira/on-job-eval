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
    <div key={id}>
      <div>
        <h3>
          {name}
          <br />
          <span>{description}</span>
        </h3>
      </div>
      <div>
        <input type="hidden" value={id} />
        <input
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
