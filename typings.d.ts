export interface Website {
  id?: string;
  name: string;
  url: string;
  email: string
  userId: string
}

export interface timeStats {
  timestamp: Date;
  status: number;
  ownerNotified: boolean
}

export interface templateFormat{
  html: string,
  text: string
}
