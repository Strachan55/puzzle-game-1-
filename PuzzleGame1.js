import React, { useState, useEffect } from 'react';
import { Loader2, Shuffle } from 'lucide-react';

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const isPuzzleSolved = (pieces) => {
  return pieces.every((piece, index) => piece === index);
};

const PuzzlePiece = ({ index, currentIndex, image, onClick, isSelected }) => {
  const row = Math.floor(index / 5);
  const col = index % 5;

  return (
    <div
      className={`relative cursor-pointer overflow-hidden ${isSelected ? 'ring-4 ring-green-500' : ''}`}
      onClick={() => onClick(currentIndex)}
      style={{
        width: '20%',
        paddingBottom: '25%',
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${image})`,
          backgroundPosition: `${col * 25}% ${row * 33.33}%`,
          backgroundSize: '500% 400%',
        }}
      >
        <div className="absolute inset-0 border border-white"></div>
      </div>
    </div>
  );
};

const PuzzleGame1 = () => {
  const [image, setImage] = useState('/api/placeholder/500/400');
  const [pieces, setPieces] = useState([...Array(20)].map((_, i) => i));
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);

  useEffect(() => {
    shufflePieces();
  }, []);

  const shufflePieces = () => {
    setPieces(shuffleArray([...Array(20)].map((_, i) => i)));
    setMoves(0);
    setCompleted(false);
    setSelectedPiece(null);
  };

  const handlePieceClick = (index) => {
    if (completed) return;

    if (selectedPiece === null) {
      setSelectedPiece(index);
    } else {
      const newPieces = [...pieces];
      [newPieces[selectedPiece], newPieces[index]] = [newPieces[index], newPieces[selectedPiece]];

      setPieces(newPieces);
      setMoves(moves + 1);
      setSelectedPiece(null);

      if (isPuzzleSolved(newPieces)) {
        setCompleted(true);
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
        setLoading(false);
        shufflePieces();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Puzzle Game 1</h1>
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-2"
        />
        <button
          onClick={shufflePieces}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2"
        >
          <Shuffle className="inline-block mr-2" />
          Shuffle
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin" size={48} />
        </div>
      ) : (
        <div className="relative bg-gray-200 aspect-square">
          <div className="absolute inset-0 flex flex-wrap">
            {pieces.map((pieceIndex, currentIndex) => (
              <PuzzlePiece
                key={currentIndex}
                index={pieceIndex}
                currentIndex={currentIndex}
                image={image}
                onClick={handlePieceClick}
                isSelected={selectedPiece === currentIndex}
              />
            ))}
          </div>
        </div>
      )}
      <div className="mt-4">
        <p className="text-lg">Moves: {moves}</p>
        {completed && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4">
            <p className="font-bold">Congratulations!</p>
            <p>You completed the puzzle in {moves} moves.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PuzzleGame1;
