import { IsInt, IsString, IsUrl, MinLength } from 'class-validator'

export class BookmarkRequestDto {
  @IsString()
  @MinLength(1)
  title: string

  @IsUrl()
  link: string

  @IsInt()
  userId: number
}