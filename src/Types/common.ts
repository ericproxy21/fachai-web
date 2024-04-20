export enum ROLE {
    User = 'user',
    Assistant = 'assistant',
  }
  
  export type Message = {
    role: ROLE;
    content: string;
  };
  