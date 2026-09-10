export interface ShortUrlDto {
  id: number;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  createdAt: string;
  clickCount: number;
  userId?: number;
  createdBy?: string;
}

export interface CreateUrlDto {
  originalUrl: string;
}

export interface AuthResponseDto {
  token: string;
  email: string;
  role: string;
}
