import React from 'react';

const FileLoader = () => {
  return (
    <div className="flex flex-row gap-2">
      <div className="animate-pulse bg-gray-300 w-14 h-14 rounded-2xl" />
      <div className="flex flex-col gap-2">
        <div className="animate-pulse bg-gray-300 w-48 h-11 mt-1.5 rounded-lg" />
      </div>
    </div>
  );
}

export default FileLoader;
