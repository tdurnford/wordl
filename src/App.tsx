import React, { useState } from 'react';
import { chunk } from 'lodash';
import './App.css';

import { words } from './words';

const columnCount = 3;

const getMostFrequent = (arr: string[]) => {
  const hashmap = arr.reduce<Record<string, number>>((acc, val) => {
   acc[val] = (acc[val] || 0 ) + 1
   return acc
  }, {});
  return Object.keys(hashmap).reduce((a, b) => hashmap[a] > hashmap[b] ? a : b, '')
}

const isValidChar = (char: string) => {
  return char === '' || /^[A-Z]$/i.test(char);
}

function App() {
  const [includedLetters, setIncludedLetters] = useState<string[]>([]);
  const [excludedLetters, setExcludedLetters] = useState<string[]>([]);

  const [first, setFirst] = useState<string[]>(Array(5).fill(''));

  const filteredWords = words
    .filter(word => includedLetters.every(include => word.includes(include)))
    .filter(word => !excludedLetters.some(exclude => word.includes(exclude)))
    .filter(word => first.every((char, index) => char ? word[index] === char : true))

  const handleIncludedChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setIncludedLetters(Array.from(event.target.value));
  }

  const handleExcludedChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setExcludedLetters(Array.from(event.target.value));
  }

  const handleChange: (index: number) => React.ChangeEventHandler<HTMLInputElement> = (index: number ) => (event) => {
    const updatedArray = [...first];
    if (isValidChar(event.target.value)) {
      updatedArray[index] = event.target.value.toLowerCase()
      setFirst(updatedArray)
    }
  }

  const wordChunks: Array<string[]> = chunk(filteredWords, Math.ceil(filteredWords.length / columnCount));

  return (
    <div>
      <label>Included letters</label><br />
      <input type="text" value={includedLetters.join('')} onChange={handleIncludedChange} /> <br />
      <label>Excluded letters</label><br />
      <input type="text" value={excludedLetters.join('')} onChange={handleExcludedChange} />
      <br />
      <br />
      <div className="letter-input-container" >
        {first.map((item, index) => <input type="text" value={item} onChange={handleChange(index)} />)}
      </div>
      {first.map((_, index) => getMostFrequent(filteredWords.map(word => word[index])))}
      <div>
        Word count: {filteredWords.length}
      </div>
      <div className="word-container">
        {wordChunks.map((column, index) => <ul key={index}>{column.map((word) => <li key={word}>{word}</li> )}</ul>)}
      </div>
    </div>
  );
}

export default App;
