declare type Bot = {
  initialize: () => void;
  /** return the square to mark **/
  getNextMove: (gameState: GameState) => Coords;
};

declare type BotConfig = {
  [configOption: string]: any;
  seed?: any;
  difficulty?: number;
};

declare type BotFactory = (config?: BotConfig) => Bot;
