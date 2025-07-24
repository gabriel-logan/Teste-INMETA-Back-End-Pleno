import { ApiProperty } from "@nestjs/swagger";

export class CreateDocumentsTypeRequestDto {
  @ApiProperty()
  public name: string;
}
