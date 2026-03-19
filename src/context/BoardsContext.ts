import { createContext } from 'react';
import { BoardsContextValue, initialBoardsContextValue } from '../misc/boards';

const BoardsContext = createContext<BoardsContextValue>(initialBoardsContextValue);

export default BoardsContext;