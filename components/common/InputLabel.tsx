
import React from 'react';

interface InputLabelProps {
  htmlFor: string;
  children: React.ReactNode;
}

const InputLabel: React.FC<InputLabelProps> = ({ htmlFor, children }) => {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
      {children}
    </label>
  );
};

export default InputLabel;
