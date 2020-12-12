import { useCallback, useRef, useState } from 'react'
import produce from 'immer'

const numRows = 50
const numCols = 50

// Represents rows around grid cell
const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
]

function App() {
  const [grid, setGrid] = useState(() =>{
    const rows = []
    for (let i = 0; i < numRows; i++){
      rows.push(Array.from(Array(numCols), () => 0))
    }

    return rows
  });

  const [running, setRunning] = useState(false)
  
  const runningRef = useRef(running);
  runningRef.current = running

  const runSimulation = useCallback(() => {
    if(!runningRef.current){
      return;
    }

    // Simulation
    setGrid((g) => {
      return produce(g, gridCopy => {
        for(let i = 0; i < numRows; i++){
          for (let j = 0; j < numCols; j++){
            // Compute number of neighbors
            let neighbors = 0;
            operations.forEach(([x, y]) =>{
              const newI = i + x;
              const newJ = j + y;
            // ensures we stay within in the grid
              if(newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols){
                neighbors += g[newI][newJ]
              }
            })

            // Determines whether a cell lives or dies
            if(neighbors < 2 || neighbors > 3){
              gridCopy[i][j] = 0
            } else if(g[i][j] === 0 && neighbors ===3){
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 100)
  }, [])

  return (
    <>
      <button onClick={() => {
        setRunning(!running)
        if(!running){
        runningRef.current = true;
        runSimulation()
        }
      }}>{running ? 'stop' : 'start'}</button>

      <div style={{display: 'grid', gridTemplateColumns: `repeat(${numCols}, 20px)`}}>
        {grid.map((rows, i) => 
          rows.map((col, k) => ( 
            <div 
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                })
                setGrid(newGrid)
              }}
              style={{width:20, 
                height: 20, 
                backgroundColor: grid[i][k] ? 'pink' : undefined,
                border: '1px solid black'
              }}
            />
          ))
        )}
      </div>
    </>
  );
}

export default App;
