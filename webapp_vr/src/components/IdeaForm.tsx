import React, { useState } from 'react';

type Props = { onSubmit:(text:string)=>void };

export default function IdeaForm({ onSubmit }:Props){
  const [text, setText] = useState('');
  return (
    <form onSubmit={e=>{e.preventDefault(); onSubmit(text);}}>
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Intentional seed" />
      <button type="submit">Add</button>
    </form>
  );
}
